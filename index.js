'use strict';

// USEFUL FUNCTIONS



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
    }
}

const DOM = {
    // PAGES
    addingTeamsPageJQ: $('#adding-teams'),
    tourSettingsPageJQ: $('#tour-settings'),
    leagueViewPageJQ: $('#league-view'),
    cupViewPageJQ: $('#cup-view'),
    statsViewPageJQ: $('#stats-view'),

    newTeamJQ: $('.team-name'),
    addTeamBtnJQ: $('.add-team'),
    addedTeamsJQ: $('.added-teams'),
    readyTeamsBtnJS: $('.ready-teams'),
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
        });
    }
    addTeam(newTeam) {
        if (!newTeam) return alert(ALERTS.LACK_OF_NAME[lang]);
        this.teams.push(new Team(newTeam));        
    }
    removeTeam(team) {

    }
}

const tourEmitter = new TourEmitter();
const tour = new Tour();


DOM.addTeamBtnJQ.on('click', function() {
    let {newTeamJQ} = DOM;
    let newTeam = newTeamJQ.val();
    if (!newTeam) return alert(ALERTS.LACK_OF_NAME[lang]);
    tour.addTeam(newTeam);
    newTeamJQ.val('');
});

DOM.readyTeamsBtnJS.on('click', function() {
    // WHAT WHEN TEAM LIST IS READY?
});
