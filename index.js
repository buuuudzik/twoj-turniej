'use strict';

let lang = 'en';

const ERRORS = {
    LACK_OF_NAME: {
        en: 'You must type a name',
        pl: 'Musisz podać imię'
    }
}


class Team {
    constructor(name) {
        if (!name) throw Error(ERRORS.LACK_OF_NAME);
        
        this.name = name;
        this.won = 0;
        this.draw = 0;
        this.lost = 0;
        this.goalsScored = 0;
        this.goalsLost = 0;
    }
}


class Match {

}


class League {

}


class Tournament {

}


class App {

}