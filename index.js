'use strict';

let lang = 'en';

const ERRORS = {
    LACK_OF_NAME: {
        en: 'You must type a name',
        pl: 'Musisz podać imię'
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
    LACK_OF_TEAMS_IN_TOUR: {
        en: 'You cannot create a tour without teams',
        pl: 'Nie można zdefiniować turnieju bez podania drużyn'
    }
}

const DOM = {
    // PAGES
    addingPlayersPageJQ: $('#adding-players'),
    tourSettingsPageJQ: $('#tour-settings'),
    leagueViewPageJQ: $('#league-view'),
    cupViewPageJQ: $('#cup-view'),
    statsViewPageJQ: $('#stats-view'),

    newPlayerJQ: $('.player-name'),
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
    }
    addTeam(team) {
        // dodawaj od razu drużynę w tabeli HTML
        // ZWERYFIKUJ DANE Z POLA INPUT
        let playerNameDOM = $()
        // POBIERZ DANE Z POLA INPUT I WYCZYŚĆ JE
    }
    removeTeam(team) {

    }
}

// const tourApp = new Tour();