'use strict';

// USEFUL FUNCTIONS
function hide(objJQ) {
    if (!objJQ.hasClass('hidden')) objJQ.addClass('hidden');
};
function show(objJQ) {
    if (objJQ.hasClass('hidden')) objJQ.removeClass('hidden');
};
function goToPage(objJQ) {
    DOM.allPagesJQ.each(function() {hide($(this))});
    show(objJQ);
};

// CHOOSE A LANGUAGE
let lang = 'en';

const ERRORS = {
    LACK_OF_NAME: {
        en: 'You must type a team name',
        pl: 'Musisz podać nazwę drużyny'
    },
    LACK_OF_TEAMS_IN_MATCH: {
        en: 'You cannot create a match without a 2 teams',
        pl: 'Nie można zdefiniować meczu bez podania 2 drużyn'
    },
    LACK_OF_TEAMS_IN_LEAGUE: {
        en: 'You cannot create a league without teams',
        pl: 'Nie można zdefiniować ligi bez podania drużyn'
    },
    LACK_OF_TEAMS_IN_CUP: {
        en: 'You cannot create a cup without teams',
        pl: 'Nie można zdefiniować pucharu bez podania drużyn'
    },
    LACK_OF_TEAMS_IN_TOUR: { // CHECK IF NECESSARY
        en: 'You cannot create a tour without teams',
        pl: 'Nie można zdefiniować turnieju bez podania drużyn'
    }
}

const ALERTS = {
    LACK_OF_NAME: {
        en: 'You must type a name',
        pl: 'Musisz podać imię'
    },
    MAX_NUMBER_OF_TEAMS: {
        en: 'You cannot add more than 64 teams!',
        pl: 'Nie możesz dodać więcej niż 64 drużyny!'
    }
}

const DOM = {
    // PAGES
    allPagesJQ: $('.page'),
    addingTeamsPageJQ: $('#adding-teams'),
    tourSettingsPageJQ: $('#tour-settings'),
    leagueViewPageJQ: $('#league-view'),
    cupViewPageJQ: $('#cup-view'),
    statsViewPageJQ: $('#stats-view'),

    newTeamJQ: $('.team-name'),
    addTeamBtnJQ: $('.add-team'),
    addedTeamsJQ: $('.added-teams'),
    readyTeamsBtnJQ: $('.ready-teams'),
    selectTourTypeJQ: $('#tour-type'),
    selectLeagueJQ: $('.league-type'),
    selectCupJQ: $('.cup-type'),
    selectLeagueCupJQ: $('.league-cup-type'),
    backToAddingTeamsJQ: $('.back-to-teams'),
    startTourBtnJQ: $('.start-tour'),
    leagueRevengeJQ: $('.league-revenge'),
    leagueRevengeValJQ: $('#league-revenge-value'),
    cupRevengeJQ: $('.cup-revenge'),
    cupRevengeValJQ: $('#cup-revenge-value'),
}

// GLOBAL EMITTER OBJECTS FOR CONTROLLING OF DATA FLOW IN APP
class TourEmitter {
    constructor() {
        this.eventsList = {}
    }

    emit(event, data) {
        for (let callback of this.eventsList[event]) callback(data);
    }

    listen(event, callback) {
        if (!this.eventsList[event]) this.eventsList[event] = [];
        this.eventsList[event].push(callback);
    }
}


class Team {
    constructor(name) {
        if (!name) throw Error(ERRORS.LACK_OF_NAME[lang]);

        this.name = name;
        this.won = 0;
        this.draw = 0;
        this.lost = 0;
        this.points = 0; // HOW WITH POINTS WHEN STAGE IS CHANGING? CLEARING?
        this.goalsScored = 0;
        this.goalsLost = 0;
        this.matches = [];

        this.onTeamListJQ = $(`<tr><td>${this.name}</td><td class="delete-team">&times;</td></tr>`).appendTo(DOM.addedTeamsJQ);
        this.onTeamListJQ.find('.delete-team').on('click', () => {
            this.onTeamListJQ.remove();
            tourEmitter.emit('deletedTeam', this.name);
        });
    }
}


class Match {
    constructor(host, guest) {
        if (!host || !guest) throw Error(ERRORS.LACK_OF_TEAMS_IN_MATCH[lang]);

        this.host = host;
        this.guest = guest;
        this.hostGoals = 0;
        this.guestGoals = 0;
        this.played = false;
    }
}


class League {
    constructor(teams) {
        if (!teams) throw Error(ERRORS.LACK_OF_TEAMS_IN_LEAGUE[lang]);

        this.teams = teams;
        this.rounds = [];
        this.played = false;
    }

    generateLeague() {

    }
}


class Cup {
    constructor(teams) {
        if (!teams) throw Error(ERRORS.LACK_OF_TEAMS_IN_CUP[lang]);

        this.played = false;
    }

    generateCup() {

    }
}


class Tour {
    constructor(name, type) {
        // SPRAWDŹ CZY W localStorage jest kopia jakiejś poprzedniej rozgrywki?
        // JEŚLI TAK PRZEKAŻ JĄ DO APLIKACJI I ODTWÓRZ STAN ROZGRYWKI
        // JEŚLI NIE WYŚWIETL OKNO DEFINIOWANIA DRUŻYNY 
        this.name;
        this.teams = [];

        tourEmitter.listen('deletedTeam', (name) => {
            this.teams.splice(this.teams.findIndex(t => t.name === name), 1);
            if (this.teams.length < 2) hide(DOM.readyTeamsBtnJQ);
        });
    }
    addTeam(newTeam) {
        if (!newTeam) return alert(ALERTS.LACK_OF_NAME[lang]);
        if (this.teams.length >= 64) return alert(ALERTS.MAX_NUMBER_OF_TEAMS);
        this.teams.push(new Team(newTeam));
        if (this.teams.length >= 2) show(DOM.readyTeamsBtnJQ);
        this.showOnlyPossibleTypes();   
    }
    removeTeam(team) {

    }
    canPlayCup() {
        let numberOfTeams = this.teams.length;
        if (numberOfTeams%2 !== 0 || ![2,4,8,16,32,64].includes(numberOfTeams)) return false;
        else return true;
    }
    showOnlyPossibleTypes() {
        let {selectCupJQ, cupRevengeJQ, cupRevengeValueJQ} = DOM;
        if (this.canPlayCup()) {
            show(selectCupJQ);
        } else {
            hide(selectCupJQ);
            DOM.cupRevengeJQ[0].checked = false;
            hide(cupRevengeJQ);
        };
        this.toggleRevengeChexboxes();
    }
    toggleRevengeChexboxes() {
        let {selectTourTypeJQ, cupRevengeJQ, leagueRevengeJQ} = DOM;
        let selectedType = selectTourTypeJQ.val();

        if (selectedType === 'Liga') {
            show(leagueRevengeJQ);
            hide(cupRevengeJQ);
            cupRevengeJQ[0].checked = false;
        } else if (selectedType === 'Puchar') {
            show(cupRevengeJQ);
            hide(leagueRevengeJQ);
            leagueRevengeJQ[0].checked = false;
        } else if (selectedType === 'Liga+Puchar') {
            show(leagueRevengeJQ);
            if (this.canPlayCup()) show(cupRevengeJQ);
            else hide(cupRevengeJQ);
        };
    }
}

const tourEmitter = new TourEmitter();
const tour = new Tour();


DOM.addTeamBtnJQ.on('click', function() {
    // JEŚLI JUŻ JEST 64 DRUŻYNY, NIE MOŻNA DODAĆ WIĘCEJ NIŻ 64 DRUŻYNY
    let {newTeamJQ} = DOM;
    let newTeam = newTeamJQ.val();
    if (!newTeam) return alert(ALERTS.LACK_OF_NAME[lang]);
    tour.addTeam(newTeam);
    newTeamJQ.val('');
});

DOM.readyTeamsBtnJQ.on('click', function() {
    goToPage(DOM.tourSettingsPageJQ);
});

DOM.backToAddingTeamsJQ.on('click', function() {
    goToPage(DOM.addingTeamsPageJQ);
});

DOM.selectTourTypeJQ.on('change', function() {
    tour.toggleRevengeChexboxes();
});