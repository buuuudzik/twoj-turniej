'use strict';

// USEFUL FUNCTIONS
function hide(objJQ) {
    if (objJQ.length > 1) {
        for (let o in objJQ) {
            if (!objJQ.hasClass('hidden')) objJQ.addClass('hidden');
        };
    } else {
        if (!objJQ.hasClass('hidden')) objJQ.addClass('hidden');
    };
};
function show(objJQ) {
    if (objJQ.length > 1) {
        for (let o in objJQ) {
            if (objJQ.hasClass('hidden')) objJQ.removeClass('hidden');
        };
    } else {
        if (objJQ.hasClass('hidden')) objJQ.removeClass('hidden');
    };
};
function showAndHide(showObjJQ, hideObjJQ) {
    hide(hideObjJQ); show(showObjJQ);
};
function goToPage(objJQ) {
    DOM.allPagesJQ.each(function() {hide($(this))});
    show(objJQ);
};
function intFromText(objJQ) {
    return parseInt(objJQ.text());
};
function toggleBackupBtns() {
    if (localStorage.getItem('twoj_turniej_backup')) {
        show(DOM.loadBackupBtnJQ);
        show(DOM.clearBackupBtnJQ);
    } else {
        hide(DOM.loadBackupBtnJQ);
        hide(DOM.clearBackupBtnJQ);
    };
};

// MUST BE CALL ON OBJECT by call/apply/bind methods
function addClass(className) {
    if (!this.hasClass(className)) this.addClass(className);
};
function removeClass(className) {
    if (this.hasClass(className)) this.removeClass(className);
};

// CHOOSE A LANGUAGE
let lang = 'pl'; // pl, en

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
    },
    LACK_OF_MATCHES_IN_ROUND: {
        en: 'You cannot create a round without matches',
        pl: 'Nie można zdefiniować rundy bez podania meczów'
    },
    BACKUP_CREATION_FAILED: {
        en: 'Backup creation failed!',
        pl: 'Błąd przy tworzeniu backupu. Backup nie utworzony.'
    }
}

const ALERTS = {
    LACK_OF_NAME: {
        en: 'You must type a team name',
        pl: 'Musisz podać nazwę drużyny'
    },
    MAX_NUMBER_OF_TEAMS: {
        en: 'You cannot add more than 64 teams!',
        pl: 'Nie możesz dodać więcej niż 64 drużyny!'
    },
    NAN_IN_ADDING_RESULT: {
        en: 'You cannot add a result without typing goals!',
        pl: 'Nie możesz dodać wyniku bez wypełnienia goli!'
    },
    TOURNAMENT_IS_FINISHED: {
        en: 'This was the last match in this tour. The winner is',
        pl: 'To był ostatni mecz w turnieju. Zwyciężyła drużyna'
    },
    PENALTIES_START: {
        en: 'Penalties time!',
        pl: 'Czas na rzuty karne!'
    },
    TOO_MUCH_TEAMS: {
        en: 'It can be maximum 64 teams in the tour!',
        pl: 'Maksymalnie może być 64 drużyny!'
    },
    DO_YOU_WANT_SAVE_BACKUP: {
        en: 'Do you really want SAVE backup?',
        pl: 'Czy na pewno chcesz zapisać bieżacy stan?'
    },
    DO_YOU_WANT_LOAD_BACKUP: {
        en: 'Do you really want LOAD from backup?',
        pl: 'Czy na pewno chcesz wczytać zapisany stan?'
    },
    DO_YOU_WANT_CLEAR_BACKUP: {
        en: 'Do you really want CLEAR backup?',
        pl: 'Czy na pewno chcesz usunąć zapisany stan?'
    },
    SOME_TEAM_HAS_SUCH_NAME: {
        en: 'There is already a team with such name!',
        pl: 'Już jest drużyna o tej nazwie!'
    }
}

const INTERFACE = {
    LEAGUE: {
        en: 'league',
        pl: 'liga'
    },
    ROUND: {
        en: 'round',
        pl: 'runda'
    },
    MATCH: {
        en: 'match',
        pl: 'mecz'
    },
    TIE: {
        en: 'tie',
        pl: 'dwumecz'
    },
}

const DOM = {
    // PAGES
    allPagesJQ: $('.page'),
    addingTeamsPageJQ: $('#adding-teams'),
    tourSettingsPageJQ: $('#tour-settings'),
    leagueViewPageJQ: $('#league-view'),
    cupViewPageJQ: $('#cup-view'),
    statsViewPageJQ: $('#stats-view'),

    addResultBarJQ: $('#add-result'),
    newTeamJQ: $('.team-name'),
    addTeamBtnJQ: $('.add-team'),
    teamsInTableTipJQ: $('.add-teams-tip'),
    addedTeamsTableJQ: $('.added-teams-table'),
    addedTeamsJQ: $('.added-teams'),
    readyTeamsBtnJQ: $('.ready-teams'),
    tourNameJQ: $('.tour-name'),
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
    leagueFixturesJQ: $('.league-fixtures'),
    addingResultJQ: $('.adding-result'),
    addingResultHostJQ: $('.adding-result > .host'),
    addingResultHostGoalsJQ: $('.adding-result > .host-goals'),
    addingResultGuestJQ: $('.adding-result > .guest'),
    addingResultGuestGoalsJQ: $('.adding-result > .guest-goals'),
    addResultBtnJQ: $('.add-result'),
    leagueTableJQ: $('.league-table'),
    cupFixturesJQ: $('.cup-fixtures'),
    goToCupViewBtnJQ: $('.goto-cup-view'),
    goToLeagueViewBtnJQ: $('.goto-league-view'),
    saveBackupBtnJQ: $('.save-backup'),
    autosaveBackupBtnJQ: $('.auto-save-backup'),
    loadBackupBtnJQ: $('.load-backup'),
    clearBackupBtnJQ: $('.clear-backup'),
    selectHostInFastGoalsBtnJQ: $('.host-fast-goals'),
    selectGuestInFastGoalsBtnJQ: $('.guest-fast-goals'),
    fastGoalsBtnJQ: $('.fast-goals'),
    logoJQ: $('#logo'),
    resultsInFixturesJQ: $('.league-fixtures .result'),
}

// GLOBAL EMITTER OBJECTS FOR CONTROLLING OF DATA FLOW IN APP
class TourEmitter {
    constructor() {
        this.eventsList = {}
    }

    emit(event, data) {
        if (!this.eventsList[event]) return; // NO LISTENERS
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

        this.onTeamListJQ = $(`<tr><td>${this.name}</td><td class="delete-team"><div>&times;</div></td></tr>`).appendTo(DOM.addedTeamsJQ);
        this.onTeamListJQ.find('.delete-team').on('click', () => {
            this.onTeamListJQ.remove();
            tourEmitter.emit('deletedTeam', this.name);
        });

        let leagueTableLength = DOM.leagueTableJQ.find('tbody > tr').length
        this.onLeagueTable = $(`<tr><td class="position">${leagueTableLength+1}</td><td class="name">${this.name}</td><td class="points">${this.points}</td><td class="wins">${this.won}</td><td class="draws">${this.draw}</td><td class="lost">${this.lost}</td><td class="goals-scored">${this.goalsScored}</td><td class="goals-lost">${this.goalsLost}</td></tr>`).appendTo(DOM.leagueTableJQ);
    }

    getLastMatch() {
        return this.matches[this.matches.length-1];
    }

    updateOnLeagueTable() {
        let sorted = false;
        // UPDATE WARTOŚCI
        let id = this.onLeagueTable.find('.position');
        let name = this.onLeagueTable.find('.name');
        let points = this.onLeagueTable.find('.points');
        points.text(this.points);
        let wins = this.onLeagueTable.find('.wins');
        wins.text(this.won);
        let draws = this.onLeagueTable.find('.draws');
        draws.text(this.draw);
        let lost = this.onLeagueTable.find('.lost');
        lost.text(this.lost);
        let goalsScored = this.onLeagueTable.find('.goals-scored');
        goalsScored.text(this.goalsScored);
        let goalsLost = this.onLeagueTable.find('.goals-lost');
        goalsLost.text(this.goalsLost);

        let lastMatch = this.getLastMatch();
        
        if (lastMatch.isDraw() || lastMatch.isAWinOf(this.name)) {
            let aboveRow = this.onLeagueTable.prev();
            let abovePoints = parseInt(aboveRow.find('.points').text());
            let aboveWins = parseInt(aboveRow.find('.wins'));
            let aboveDraws = parseInt(aboveRow.find('.draws'));
            let aboveLost = parseInt(aboveRow.find('.lost'));
            let aboveGoalsScored = parseInt(aboveRow.find('.goals-scored'));
            let aboveGoalsLost = parseInt(aboveRow.find('.goals-lost'));

            if (abovePoints < points) aboveRow.after(this.onLeagueTable);
        } else {
            // zobacz czy nie musisz przesunąć poniżej poprzednika, i patrz tylko na różnicę goli
            let belowRow = this.onLeagueTable.next();
        };
    }
    recalcStats() {
        // WYZERUJ WYNIKI ZAWODKÓW
        this.clearStats();
        this.matches.forEach((m, i) => {
            let stats = m.getTeamStats(this.name);
            let {points, won, draw, lost, goalsScored, goalsLost} = stats;
            
            this.points += points;
            this.won += won;
            this.draw += draw;
            this.lost += lost;
            this.goalsScored += goalsScored;
            this.goalsLost += goalsLost;
        });
    }
    clearStats() {
        this.won = 0;    
        this.draw = 0;    
        this.lost = 0;    
        this.points = 0;    
        this.goalsScored = 0;    
        this.goalsLost = 0;    
    }
    backup() {
        let {name} = this; // BRAKUJE reszty właściwości
        return name;
    }
}

// ADD CHANGABLE POINTS FOR WIN/DRAW/LOOSE EG. IN FOOTBALL 3/1/0
class Match {
    constructor(host, guest, stage, isRevenge = false) {
        if (!host || !guest) throw Error(ERRORS.LACK_OF_TEAMS_IN_MATCH[lang]);

        this.host = host;
        this.guest = guest;
        this.hostGoals = 0;
        this.guestGoals = 0;
        this.finished = false;
        this.stage = stage;
        this.penalties = false;
        this.hostPenaltiesGoals = 0;
        this.guestPenaltiesGoals = 0;
        this.penaltiesWinner = '';
        this.isRevenge = isRevenge;
        this.partOfTie = false;
        
        if (this.stage.match(/league/g)) {
            this.onFixturesList = $(`<tr><td>${host.name}</td><td class="result"></td><td>${guest.name}</td></tr>`).appendTo(DOM.leagueFixturesJQ);
        } else if (this.stage.match(/cup/g)) {
            this.onFixturesList = $(`<tr><td>${host.name}</td><td class="result"></td><td>${guest.name}</td></tr>`).appendTo(DOM.cupFixturesJQ);
            if (this.partOfTie) {
                if (stage.match(/cup-1\/1/g) || this.isRevenge) this.penalties = true;
            } else this.penalties = true;
        };
    }
    addResult(hostGoals, guestGoals) {
        this.finished = true;
        this.hostGoals = hostGoals;
        this.guestGoals = guestGoals;
        if (this.stage.match(/league/g)) this.updateTeamsResults();
        this.onFixturesList.find('.result').text(`${hostGoals}:${guestGoals}`);
        if (hostGoals === guestGoals && this.penalties) this.playPenalties();;
        tourEmitter.emit('finishedMatch', this);
    }
    updateResultOnView() {
        if (!this.finished) return;
        if (this.stage.match(/league/g)) this.updateTeamsResults();
        this.onFixturesList.find('.result').text(`${this.hostGoals}:${this.guestGoals}`);
    }
    isHost(name) {
        if (this.host.name === name) return true;
        else return false;
    }
    isDraw() {
        if (this.finished) return this.hostGoals === this.guestGoals;
        return -1;
    }
    isAWinOf(name) {
        if (this.isDraw()) return false;
        else {
            if (this.isHost(name)) return this.hostGoals > this.guestGoals;
            else return this.hostGoals < this.guestGoals;
        };
    }
    updateTeamsResults() {
        let {host, guest, hostGoals, guestGoals} = this;
        
        for (let t of [host.name, guest.name]) {
            if (this.isHost(t)) {
                host.matches.push(this);
                host.goalsScored += hostGoals;
                host.goalsLost += guestGoals;
    
                if (this.isDraw()) {
                    host.points += 1;
                    host.draw += 1;
                } else if (hostGoals > guestGoals) {
                    host.points += 3;
                    host.won += 1;
                } else {
                    host.lost += 1;
                };
            } else {
                guest.matches.push(this);
                guest.goalsScored += guestGoals;
                guest.goalsLost += guestGoals;
    
                if (this.isDraw()) {
                    guest.points += 1;
                    guest.draw += 1;
                } else if (hostGoals < guestGoals) {
                    guest.points += 3;
                    guest.won += 1;
                } else {
                    guest.lost += 1;
                };
            };
        };
        host.updateOnLeagueTable();
        guest.updateOnLeagueTable();
    }
    showAsCurrentMatch() {
        DOM.addingResultHostJQ.text(this.host.name);
        DOM.addingResultGuestJQ.text(this.guest.name);
    }
    whoWon() {
        // licz bramki u siebie i na wyjeździe
        let {host, guest, hostGoals, guestGoals} = this;
        if (hostGoals > guestGoals) return host;
        else if (hostGoals < guestGoals) return guest;
        else return this.penaltiesWinner;
    }
    getTeamStats(name) {
        let {host, guest, hostGoals, guestGoals} = this;
        let points, won, draw, lost, goalsScored, goalsLost;
        
        if (name === host.name) {
            goalsScored = hostGoals;
            goalsLost = guestGoals;
        } else if (name === guest.name) {
            goalsScored = guestGoals;
            goalsLost = hostGoals;
        } else return {points: 0, won: 0, draw: 0, lost: 0, goalsScored: 0, goalsLost: 0};

        if (goalsScored === goalsLost) {points = 1; won = 0, draw = 1, lost = 0}
        else if (goalsScored>goalsLost) {points = 3; won = 1, draw = 0, lost = 0}
        else if (goalsScored<goalsLost) {points = 0; won = 0, draw = 0, lost = 1};
        
        return {points, won, draw, lost, goalsScored, goalsLost};
    }
    playPenalties() {
        // PRZEPROWADŹ KARNE!!!
        alert(ALERTS.PENALTIES_START[lang]);
        let {host, guest} = this;
        this.hostPenaltiesGoals = parseInt(prompt(`Podaj gole dla ${host.name}:`, 5)); // ZMIEŃ NA LEPSZĄ WERSJĘ
        this.guestPenaltiesGoals = parseInt(prompt(`Podaj gole dla ${guest.name}:`, 5)); // ZMIEŃ NA LEPSZĄ WERSJĘ

        let lastResultJQ = this.onFixturesList.find('.result');
        lastResultJQ.text(`${lastResultJQ.text()} (${this.hostPenaltiesGoals}:${this.guestPenaltiesGoals})`);

        if (this.hostPenaltiesGoals > this.guestPenaltiesGoals) {
            this.penaltiesWinner = host;
            return host;
        } else {
            this.penaltiesWinner = guest;
            console.log(this);
            return guest;
        };
    }
    backup() {
        let {host, guest, hostGoals, guestGoals, finished, stage, penalties, hostPenaltiesGoals, guestPenaltiesGoals, penaltiesWinner, isRevenge, partOfTie} = this;
        if (penaltiesWinner) penaltiesWinner = penaltiesWinner.name;
        return {
            host: host.name,
            guest: guest.name,
            hostGoals,
            guestGoals,
            finished,
            stage,
            penalties,
            hostPenaltiesGoals,
            guestPenaltiesGoals,
            penaltiesWinner, // podmiana na imię
            isRevenge,
            partOfTie
        };
    }
    updateFromBackup(hostGoals, guestGoals, finished, stage, penalties, hostPenaltiesGoals, guestPenaltiesGoals, penaltiesWinner, partOfTie) {
        this.hostGoals = hostGoals;
        this.guestGoals = guestGoals;
        this.finished = finished;
        this.penalties = penalties;
        this.hostPenaltiesGoals = hostPenaltiesGoals;
        this.guestPenaltiesGoals = guestPenaltiesGoals;
        this.penaltiesWinner = penaltiesWinner;
        this.partOfTie = partOfTie;
        this.updateResultOnView();
    }
}


class Tie {
    constructor(match1, match2, stage = 'cup') {
        this.matches = [match1, match2];
        this.stage = stage;
        this.penalties = true;  // BY DEFAULT IS ON
        this.hostPenaltiesGoals = 0;
        this.guestPenaltiesGoals = 0;
        this.penaltiesWinner = '';
        this.finished = false;
        this.matches.forEach(m => m.partOfTie = true);

        tourEmitter.listen('finishedMatch', (match) => {
            if (this.finished) return;
            console.log(this.matches[this.matches.length-1].finished, this.matches[this.matches.length-1])
            if (this.matches[this.matches.length-1].finished) {
                if (this.isDraw() && this.penalties && !this.penaltiesWinner) {console.log('karne 1'); this.playPenalties();};
                this.finished = true;
            };
        });
    }
    isDraw() {
        console.log('tu1', this.matches);
        if (this.matches.every(v => v.finished)) {
            // licz bramki u siebie i na wyjeździe
            let [m1, m2] = this.matches;
            let t1 = {name: m2.host.name, goalsScored: 0, goalsLost: 0};
            let t2 = {name: m2.guest.name, goalsScored: 0, goalsLost: 0};

            for (let m of this.matches) {
                ['host', 'guest'].forEach(v => {
                    if (m.host.name === t1.name) {
                        t1.goalsScored += m.host.goalsScored;
                        t2.goalsScored += 2*(m.guest.goalsScored);
                    } else {
                        t1.goalsScored += 2*(m.guest.goalsScored);
                        t2.goalsScored += m.host.goalsScored;
                    };
                });
            };
            
            if (t1.goalsScored > t2.goalsScored || t1.goalsScored < t2.goalsScored) return false;
            else return this.true;
        } else return false;
    }
    whoWon() {
        if (this.matches.every(v => v.finished)) {
            // licz bramki u siebie i na wyjeździe
            let [m1, m2] = this.matches;
            let teams = [{name: m2.host.name, goalsScored: 0}, {name: m2.guest.name, goalsScored: 0}];

            for (let m of this.matches) {
                let host = teams.find(t => t.name === m.host.name);
                let guest = teams.find(t => t.name === m.guest.name);
                host.goalsScored += m.hostGoals;
                guest.goalsScored += 2*(m.guestGoals);
            };
            
            let [t1, t2] = teams;
            if (t1.goalsScored > t2.goalsScored) return m2.host;
            else if (t1.goalsScored < t2.goalsScored) return m2.guest;
            else return this.penaltiesWinner;
        } else return false;
    }
    getNextMatch() {
        if (this.finished === false) {
            let found = this.matches.find(v => !v.finished);
            if (!found) this.finished = false;
            else return found;
        } else return false;
    }
    showAsCurrentMatch() {
        let nextMatch = this.getNextMatch();
        if (nextMatch) nextMatch.showAsCurrentMatch();
    }
    addResult(hostGoals, guestGoals) {
        let nextMatch = this.getNextMatch();
        if (nextMatch) nextMatch.addResult(hostGoals, guestGoals);
        
        nextMatch = this.getNextMatch();
        if (!nextMatch) {
            if (!this.whoWon() && this.penalties) this.playPenalties();
        };
    }
    playPenalties() {
        // PRZEPROWADŹ KARNE!!!
        alert(ALERTS.PENALTIES_START[lang]);
        let [m1, m2] = this.matches;
        let t1Penalties = parseInt(prompt(`Podaj gole dla ${m2.host.name}:`, 5)); // ZMIEŃ NA LEPSZĄ WERSJĘ
        let t2Penalties = parseInt(prompt(`Podaj gole dla ${m2.guest.name}:`, 5)); // ZMIEŃ NA LEPSZĄ WERSJĘ
        console.log('to', this.matches)
        m2.hostPenaltiesGoals = t1Penalties;
        m2.guestPenaltiesGoals = t2Penalties;

        let lastResultJQ = m2.onFixturesList.find('.result');
        lastResultJQ.text(`${lastResultJQ.text()} (${m2.hostPenaltiesGoals}:${m2.guestPenaltiesGoals})`);

        if (t1Penalties > t2Penalties) {
            this.penaltiesWinner = m2.host;
            return m2.host;
        } else {
            this.penaltiesWinner = m2.guest;
            return m2.guest;
        };
    }
    clearStats() {
        this.matches.forEach(m => m.clearStats());
    }
    backup() {
        let {matches, stage, penalties, hostPenaltiesGoals, guestPenaltiesGoals, penaltiesWinner, finished} = this;
        return {
            matches: matches.map(v => v.backup()),
            stage,
            penalties,
            hostPenaltiesGoals,
            guestPenaltiesGoals,
            penaltiesWinner: penaltiesWinner.name,
            finished
        };
    }
    updateFromBackup(finished, penalties, hostPenaltiesGoals, guestPenaltiesGoals, penaltiesWinner, matches) {
        matches.map(m => {
            let {host, guest, stage, isRevenge, hostGoals, guestGoals, finished, penalties, hostPenaltiesGoals, guestPenaltiesGoals, penaltiesWinner} = m;
            let newMatch = new Match(tour.getTeam(host), tour.getTeam(guest), stage, isRevenge);
            newMatch.updateFromBackup(hostGoals, guestGoals, finished, penalties, hostPenaltiesGoals, guestPenaltiesGoals, penaltiesWinner, true);
        });
        this.hostGoals = hostGoals;
        this.guestGoals = guestGoals;
        this.finished = finished;
        this.penalties = penalties;
        this.hostPenaltiesGoals = hostPenaltiesGoals;
        this.guestPenaltiesGoals = guestPenaltiesGoals;
        this.penaltiesWinner = penaltiesWinner;
        this.partOfTie = partOfTie;
    }
}


class Round {
    constructor(matches) {
        if (!matches) throw Error(ERRORS.LACK_OF_MATCHES_IN_ROUND[lang]);
        this.matches = matches;
        this.finished = false;

        tourEmitter.emit('roundCreated');
        tourEmitter.listen('finishedMatch', (match) => {
            if (this.finished) return;
            if (this.matches[this.matches.length-1].finished) {
                this.finished = true;
                tourEmitter.emit('roundFinished');
            };
        });
    }
    getNextMatch() {
        if (this.finished === false) {
            let found = this.matches.find(v => !v.finished);
            if (!found) this.finished = false; // RETURNS UNDEFINED
            else return found;
        } else return false;
    }
    getWinners() {
        let winners = [];
        this.matches.forEach(m => {
            let winner = m.whoWon();
            if (winner) winners.push(winner);
            else {
                if (m.isDraw() && m.penalties) {
                    m.playPenalties();
                    winners.push(m.whoWon());
                };
            };
        });

        if (!winners) return console.log('There is no winners!'); // ZMIEŃ TO
        winners.forEach(w => {
            console.log(w);
            w.clearStats();
        });
        return winners;
    }
    backup() {
        let {matches, finished} = this;
        return {
            matches: matches.map(v => v.backup()),
            finished
        };
    }
}


class League {
    constructor(teams, revenges) {
        if (!teams) throw Error(ERRORS.LACK_OF_TEAMS_IN_LEAGUE[lang]);

        this.type = 'league';
        this.teams = teams;
        this.revenges = revenges;
        this.rounds = [];
        this.finished = false;
        this.generateLeague();

        tourEmitter.emit('leagueCreated');
        tourEmitter.emit('stageCreated');
        tourEmitter.listen('finishedMatch', () => {
            setTimeout(() => {
                this.sortLeagueTable();
                tourEmitter.emit('tableSorted');
                if ($('.league-fixtures .result').length > 10) this.hideFinishedMatches();
            }, 50);
        });
        tourEmitter.listen('roundFinished', () => {
            if (this.finished === true) return;
            
            if (this.rounds[this.rounds.length-1].finished) {
                this.finished = true;
                this.showAllMatches();
                tourEmitter.emit('stageFinished');
            };
            setTimeout(() => {
                this.sortLeagueTable();
                tourEmitter.emit('tableSorted');
            }, 50);
        });
    }

    generateLeague() {
        let repeatCount = 1;
        
        if (this.revenges) repeatCount = 2;

        for (let i=1; i<=repeatCount; i++) {
            let isRevenge = false;
            let generatedMatches = generateLeague(this.teams.length, this.teams);
            if (i === 2) {
                // REVERSE ORDER FOR REVENGE MATCHES AND TEAMS IN MATCHES
                generatedMatches.reverse();
                for (let r of generatedMatches) {
                    for (let m of r) m.reverse();
                };
                isRevenge = true;
            };

            for(let r of generatedMatches) {
                let roundNumber = this.rounds.length + 1;
                let matches = [];
                for (let m of r) matches.push(new Match(m[0], m[1], `league-stage-${roundNumber}`, isRevenge));
                this.rounds.push(new Round(matches));
            };
        };
    }

    getNextMatch() {
        let round = this.rounds.find(r => !r.finished);
        if (round) {
            let nextMatch = round.getNextMatch();
            if (nextMatch) return nextMatch;
            else return false;
        } else return false;
    }
    sortLeagueTable() {
        let tbody = DOM.leagueTableJQ.find('tbody');
        let ni = 0;
        tbody.find('tr').sort(function(a, b) {
            // ONLY DESC DIRECTION
            
            function returnFromDelta(delta) {
                if (delta > 0) return +1;
                else if (delta < 0) return -1;
                else return 0;
            };

            let pointsDelta = intFromText($('td:nth(2)', b)) - intFromText($('td:nth(2)', a));
            if (pointsDelta) return returnFromDelta(pointsDelta);

            let aGoalsScored = intFromText($('td:nth(7)', a));
            let aGoalsLost = intFromText($('td:nth(7)', a));
            let bGoalsScored = intFromText($('td:nth(6)', b));
            let bGoalsLost = intFromText($('td:nth(7)', b));
            let goalDelta = (bGoalsScored - bGoalsLost) - (aGoalsScored - aGoalsLost);
            if (goalDelta) return returnFromDelta(goalDelta);

            let winsDelta = intFromText($('td:nth(3)', b)) - intFromText($('td:nth(3)', a));
            if (winsDelta) return returnFromDelta(winsDelta);

            let drawDelta = intFromText($('td:nth(4)', b)) - intFromText($('td:nth(4)', a));
            if (drawDelta) return returnFromDelta(drawDelta);

            let moreGoalsScored = bGoalsScored - aGoalsScored;
            if (moreGoalsScored) return returnFromDelta(moreGoalsScored);

            let lessGoalslost = -bGoalsLost - (-aGoalsLost);
            if (lessGoalslost) return returnFromDelta(lessGoalslost);

            let lostDelta = -intFromText($('td:nth(5)', b)) - (-intFromText($('td:nth(5)', a)));
            if (lostDelta) return returnFromDelta(lostDelta);
        }).appendTo(tbody);

        // UPDATE IDS
        tbody.find('tr').each(function(index) {
            $('td:nth(0)', this).text(index+1);
        }).appendTo(tbody);
    }
    getBestTeamNames() {
        let bestTeams = [];
        let teamsInTableJQ = DOM.leagueTableJQ.find('tbody > tr').each((i, v) => {
            if (i < 3) bestTeams.push($(v).find('.name').text());
        });
        if (bestTeams) return bestTeams;
        else return false;
    }
    getNumberOfTeamsForCup() {
        let halfTeamsInLeague = this.teams.length/2 - this.teams.length%2;
        let found = [64,32,16,8,4,2].filter(n => n < halfTeamsInLeague).find(n => halfTeamsInLeague >= n);
        if (found) return found;
        else return false;
    }
    getQualifiedTeams() {
        let qualifiedTeamNames = [];
        let numberOfTeamsForCup = this.getNumberOfTeamsForCup();
        
        let teamsInTableJQ = DOM.leagueTableJQ.find('tbody > tr').each((i, v) => {
            let name = $(v).find('.name').text();
            if (i < numberOfTeamsForCup) qualifiedTeamNames.push(name);
        });
        let qualifiedTeams = qualifiedTeamNames.map(name => this.teams.find(team => name === team.name));
        if (qualifiedTeams) return qualifiedTeams;
        else return false;
    }
    backup() {
        let {type, teams, revenges, rounds, finished} = this;
        return {
            type,
            teams: teams.map(t => t.backup()),
            revenges,
            rounds: rounds.map(r => r.backup()),
            finished
        };
    }
    updateFromBackup(teams, rounds, finished) {
        this.clearLeague();
        this.teams = teams;
        this.finished = finished;
        rounds.forEach((r, i) => {
            let {matches, finished} = r;
            // popraw matches
            let roundNumber = i + 1;
            matches = matches.map(m => {
                let newMatch = new Match(tour.getTeam(m.host), tour.getTeam(m.guest), m.stage, m.isRevenge);
                let {hostGoals, guestGoals, finished, stage, penalties, hostPenaltiesGoals, guestPenaltiesGoals, penaltiesWinner, isRevenge, partOfTie} = m;
                newMatch.updateFromBackup(hostGoals, guestGoals, finished, stage, penalties, hostPenaltiesGoals, guestPenaltiesGoals, penaltiesWinner, isRevenge, partOfTie);
                return newMatch;
            });
            let round = new Round(matches, `league-stage-${roundNumber}`);
            round.finished = finished;
            this.rounds.push(round);
        });
        // PRZELICZ WYNIK ZAWODNIKÓW
        this.sortLeagueTable();
        tour.teams.forEach(t => t.recalcStats());
        tour.decorateBestOnView();
        if (!this.finished) show(DOM.addResultBarJQ);

        setTimeout(() => {
                if (tour.stages.length > 1) {
                    show(DOM.goToLeagueViewBtnJQ);
                    show(DOM.goToCupViewBtnJQ);
                    addClass.call(DOM.goToCupViewBtnJQ, 'active');
                    removeClass.call(DOM.goToLeagueViewBtnJQ, 'active');
                };
                tour.decorateBestOnView();
        }, 60);
        goToPage(DOM.leagueViewPageJQ);
    }
    clearLeague() {
        this.teams = [];
        this.rounds = [];
        DOM.leagueFixturesJQ.find('tbody').empty();
    }
    getLastMatch() {
        let {rounds} = this;
        let round = rounds.find(r => !r.finished);
        if (!round) {
            round = rounds[rounds.length-1];
            return round.matches[round.matches.length-1];
        } else {
            let finished = round.matches.filter(m => m.finished);
            return finished[finished.length-1];
        };
    }
    hideFinishedMatches() {
        $('.league-fixtures .result').each(function(array) {
            let resultCell = $(this);
            let numberOfVisibleRows = $('.league-fixtures tbody tr:visible').length;
            if (resultCell.text() && numberOfVisibleRows > 8) {
                resultCell.parent().fadeOut(300);
                addClass.call(DOM.leagueFixturesJQ.find('thead'), 'hiding-something');
            };
        });
    }
    showAllMatches() {
        $('.league-fixtures .result').each(function() {
            let resultCell = $(this);
            resultCell.parent().show();
            removeClass.call(DOM.leagueFixturesJQ.find('thead'), 'hiding-something');
        });
    }
}


class Cup {
    constructor(teams, revenges) {
        if (!teams) throw Error(ERRORS.LACK_OF_TEAMS_IN_CUP[lang]);

        this.type = 'cup';
        this.teams = teams;
        this.revenges = revenges;
        this.rounds = []; // GENERATE NEW ROUND AT END OF LAST UNTIL FINAL
        this.finished = false;
        this.generateNextRound();
        tourEmitter.emit('cupCreated');
        tourEmitter.emit('stageCreated');
        tourEmitter.listen('roundFinished', () => {
            if (this.finished === true) return;
            
            if (this.rounds[this.rounds.length-1].finished) {
                this.finished = true;
                tourEmitter.emit('stageFinished');
            };
        });
    }

    getWinnersToNextStage() {
        // 1, 2, 4, 8, 16, bez 32, 64
        // liczba drużyn/2 np. gdy 32 drużyny wtedy wychodzi 16
        let lastRound = this.rounds[this.rounds.length-1];
        if (lastRound) {
            let winners = lastRound.getWinners();
            if (winners) return winners;
            else return false;
        } else return this.teams;
    }

    generateNextRound() {
        // prepare new table of teams which win in last round
        // if last round was final then return nothing
        let teams = this.getWinnersToNextStage();
        
        if (teams.length === 0) {
            // AFTER FINAL
            // FIRST CHECK IF PENALTIES WASN'T PLAYED
            if (this.rounds.length > 0) {
                let lastMatch = this.rounds[this.rounds.length-1].matches[0];
                let winner = lastMatch.whoWon();
                if (winner) console.log(`Zwyciężył ${winner.name}!`);
                else {
                    lastMatch.playPenalties();
                    winner = lastMatch.whoWon();
                    alert(`${ALERTS.TOURNAMENT_IS_FINISHED[lang]} ${winner.name}!`);
                };
            };
            return false;
        } else if (teams.length === 1) {
            // komunikat o wygraniu pucharu
            let [winner] = teams;
            alert(`${ALERTS.TOURNAMENT_IS_FINISHED[lang]} ${winner.name}!`);
        };

        let matches = [];
        let nextStage = `cup-${this.getNextRoundName()}`;

        if (teams.length > 1) {
            for (let i=0; i<teams.length; i=i+2) {
                let team1 = teams[i], team2 = teams[i+1];
    
                // DODAJ WYCZYSZCZENIE STATYSTYK DRUŻYN PRZED NOWĄ RUNDĄ
                teams.forEach(t => t.clearStats());
    
                if (this.revenges && teams.length > 2) matches.push(new Tie(new Match(team1, team2, nextStage), new Match(team2, team1, nextStage), nextStage));
                else if (this.revenges && teams.length === 2) matches.push(new Match(team1, team2, nextStage));
                else if (!this.revenges) matches.push(new Match(team1, team2, nextStage));
            };
        };
        if (matches.length > 0) this.rounds.push(new Round(matches));
    }
    getRoundName() {
        let {rounds} = this;
        if (rounds) return `1/${rounds[rounds.length-1].length}`;
        else return false;
    }
    getNextRoundName() {
        let {rounds, teams} = this;
        let lastRound = rounds[rounds.length-1];
        if (!lastRound) return `1/${teams.length/2}`; // zmien na ALERTS

        let matchesInCurrentStage = rounds[rounds.length-1].matches.length;

        if (matchesInCurrentStage >= 2) return `1/${matchesInCurrentStage/4}`;
        else if (matchesInCurrentStage === 1) return `1/1`;
        else return false;
    }
    getLastMatch() {
        let {rounds} = this;
        let round = rounds.find(r => !r.finished);
        if (!round) {
            round = rounds[rounds.length-1];
            return round.matches[round.matches.length-1];
        } else {
            let finished = round.matches.filter(m => m.finished);
            return finished[finished.length-1];
        };
    }
    getNextMatch() {
        let {rounds} = this;
        let round = rounds.find(r => !r.finished);

        if (round) return round.getNextMatch();
        else {
            this.generateNextRound();
            round = rounds.find(r => !r.finished);
            if (round) {
                let nextMatch = round.getNextMatch();
                if (nextMatch) return nextMatch;
                else return false;
            };
        };
    }
    backup() {
        let {type, teams, revenges, rounds, finished} = this;
        return {
            type,
            teams: teams.map(t => t.backup()),
            revenges,
            rounds: rounds.map(r => r.backup()),
            finished
        };
    }
    updateFromBackup(teams, rounds, finished) {
        this.clearCup();
        this.teams = teams;
        this.finished = finished;
        rounds.forEach((r, i) => {
            let {matches, finished} = r;
            let roundNumber = i + 1;

            if (matches.matches) {
                // generate Tie but not in final
                let ties = matches.map(t => new Tie(tour.getTeam(t.host), tour.getTeam(t.guest), t.stage));
                ties.forEach(t => {
                    let {finished, penalties, hostPenaltiesGoals, guestPenaltiesGoals, penaltiesWinner, matches} = t;
                    t.updateFromBackup(finished, penalties, hostPenaltiesGoals, guestPenaltiesGoals, penaltiesWinner, matches);
                });
            } else {
                matches = matches.map(m => new Match(tour.getTeam(m.host), tour.getTeam(m.guest), m.stage, m.isRevenge));
                matches.forEach(m => {
                    let {hostGoals, guestGoals, finished, stage, penalties, hostPenaltiesGoals, guestPenaltiesGoals, penaltiesWinner, isRevenge, partOfTie} = m;
                    m.updateFromBackup(hostGoals, guestGoals, finished, stage, penalties, hostPenaltiesGoals, guestPenaltiesGoals, penaltiesWinner, isRevenge, partOfTie);
                });
                let round = new Round(matches, `cup-${roundNumber}`);
                round.finished = finished;
                this.rounds.push(round);
            };
        });
        if (!this.finished) show(DOM.addResultBarJQ);
        // WYZERUJ WYNIKI ZAWODKÓW
        this.teams.forEach(t => t.clearStats());
        
        setTimeout(() => {
            if (tour.stages.length>1) {
                show(DOM.goToLeagueViewBtnJQ);
                show(DOM.goToCupViewBtnJQ);
                addClass.call(DOM.goToCupViewBtnJQ, 'active');
                removeClass.call(DOM.goToLeagueViewBtnJQ, 'active');
            };
        }, 60);
        goToPage(DOM.cupViewPageJQ);
    }
    clearCup() {
        this.teams = [];
        this.rounds = [];
        DOM.cupFixturesJQ.find('tbody').empty();
    }
}


class Tour {
    constructor() {
        // SPRAWDŹ CZY W localStorage jest kopia jakiejś poprzedniej rozgrywki?
        // JEŚLI TAK PRZEKAŻ JĄ DO APLIKACJI I ODTWÓRZ STAN ROZGRYWKI
        // JEŚLI NIE WYŚWIETL OKNO DEFINIOWANIA DRUŻYNY 
        this.name = '';
        this.type = 'l';
        this.leagueRevenge = false;
        this.cupRevenge = false;
        this.teams = [];
        this.stages = [];
        this.finished = false;
        tourEmitter.listen('deletedTeam', (name) => this.removeTeam(name));
        tourEmitter.listen('finishedMatch', () => {
            setTimeout(() => {
                this.updateAddingResultView();
                if (DOM.autosaveBackupBtnJQ.hasClass('active')) this.backup();
            }, 50);
        });
        tourEmitter.listen('stageFinished', (match) => {
            setTimeout(() => {
                this.updateAddingResultView();
                
                if (this.stages[this.stages.length-1].finished) {
                    if (this.type === 'lc' && this.stages.length === 1) {
                        // GENERUJ FAZĘ PUCHAROWĄ
                        this.stages[0].sortLeagueTable();
                        let teams = this.stages[this.stages.length-1].getQualifiedTeams();
                        this.stages.push(new Cup(teams, this.cupRevenge));
                        show(DOM.goToCupViewBtnJQ);
                        addClass.call(DOM.goToCupViewBtnJQ, 'active');
                        removeClass.call(DOM.goToLeagueViewBtnJQ, 'active');

                        // SHOW OTHER STAGE VIEW
                        show(DOM.goToLeagueViewBtnJQ);
                        show(DOM.goToCupViewBtnJQ);

                        goToPage(DOM.cupViewPageJQ);
                    } else if (this.type === 'l') {
                        this.finished = true;
                        hide(DOM.addResultBarJQ);

                        this.stages[0].sortLeagueTable();
                        let winner = DOM.leagueTableJQ.find('tbody > tr:first-child .name').text();
                        alert(`${ALERTS.TOURNAMENT_IS_FINISHED[lang]} ${winner}!`);
                    } else if (this.type === 'c' || (this.type === 'lc' && this.stages.length === 2)) {
                        this.finished = true;
                        hide(DOM.addResultBarJQ);

                        let lastMatch = this.stages[this.stages.length-1].getLastMatch();
                        let winner = lastMatch.whoWon();
                        alert(`${ALERTS.TOURNAMENT_IS_FINISHED[lang]} ${winner.name}!`);
                    };
                };
            }, 50);
        });
        tourEmitter.listen('tableSorted', (match) => {
            // if (this.finished === true) return; // jeśli dodam tą linijkę, wtedy po ostatniej kolejce nie wykona się kod dekoratora
            this.decorateBestOnView();
        });
        tourEmitter.listen('stageCreated', () => {
            setTimeout(() => this.updateAddingResultView(), 60);
        });
    }
    addTeam(newTeam) {
        if (!newTeam) return alert(ALERTS.LACK_OF_NAME[lang]);
        if (this.teams.find(t => t.name === newTeam)) return alert(ALERTS.SOME_TEAM_HAS_SUCH_NAME[lang]);
        if (this.teams.length >= 64) return alert(ALERTS.MAX_NUMBER_OF_TEAMS);
        this.teams.push(new Team(newTeam));
        if (this.teams.length >= 2) show(DOM.readyTeamsBtnJQ);
        this.showOnlyPossibleTypes();
        this.toggleTeamsTable();
    }
    removeTeam(name) {
        this.teams.splice(this.teams.findIndex(t => t.name === name), 1);
        if (this.teams.length < 2) hide(DOM.readyTeamsBtnJQ);
        this.toggleTeamsTable(); 
    }
    toggleTeamsTable() {
        if (this.teams.length === 0) {
            hide(DOM.addedTeamsTableJQ);
            show(DOM.teamsInTableTipJQ);
        } else {
            show(DOM.addedTeamsTableJQ);
            hide(DOM.teamsInTableTipJQ);
        };
    }
    canPlayCup() { // ADD CHECKING FOR LEAGUE+CUP BECAUSE AFTER LEAGUE THE NUMBER OF TEAMS CAN BE TOO SMALL!!!
        let numberOfTeams = this.teams.length;
        if (numberOfTeams%2 !== 0 || ![2,4,8,16,32,64].includes(numberOfTeams)) return false;
        else return true;
    }
    showOnlyPossibleTypes() { // SAME AS ABOVE
        let {selectCupJQ, cupRevengeJQ, cupRevengeValueJQ} = DOM;
        if (this.canPlayCup()) show(selectCupJQ);
        else hide(selectCupJQ);
        this.toggleRevengeCheckboxes();
    }
    toggleRevengeCheckboxes() {
        let {selectTourTypeJQ, cupRevengeJQ, leagueRevengeJQ} = DOM;
        let selectedType = selectTourTypeJQ.val();

        if (selectedType === 'l') {
            showAndHide(leagueRevengeJQ, cupRevengeJQ);
            cupRevengeJQ[0].checked = false;
        } else if (selectedType === 'c') {
            showAndHide(cupRevengeJQ, leagueRevengeJQ);
            leagueRevengeJQ[0].checked = false;
        } else if (selectedType === 'lc') {
            show(leagueRevengeJQ);
            if (this.canPlayCup()) show(cupRevengeJQ);
            else hide(cupRevengeJQ);
        };
    }
    startTour() {
        // GENERATE CUP (1ST STAGE OR ONLY)
        let {type, teams, leagueRevenge, cupRevenge} = this;

        if (type === 'l' || type === 'lc') {
            this.stages.push(new League(teams, leagueRevenge));
        } else this.stages.push(new Cup(teams, cupRevenge));

        switch(this.type) {
            case 'l': goToPage(DOM.leagueViewPageJQ); break;
            case 'c': goToPage(DOM.cupViewPageJQ); break;
            case 'lc': goToPage(DOM.leagueViewPageJQ); break;
        };
        this.updateAddingResultView();
        this.updateLogo();
    }
    getNextMatch() {
        let stage = this.stages.find(stage => {
            if (!stage.finished) return true;
            else return false;
        });
        
        if (stage) return stage.getNextMatch();
        else return false;
    }
    addResultToNextMatch(hostGoals, guestGoals) {
        let nextMatch = this.getNextMatch();
        if (nextMatch) nextMatch.addResult(hostGoals, guestGoals);
        else {
            let lastMatch = this.stages[this.stages.length-1].getLastMatch();
            let winner = lastMatch.whoWon();
            alert(`${ALERTS.TOURNAMENT_IS_FINISHED[lang]} ${winner.name}!`);
        };
    }
    updateAddingResultView() {
        let nextMatch = this.getNextMatch();

        if (nextMatch) {
            nextMatch.showAsCurrentMatch();
            DOM.addingResultHostGoalsJQ.val('');
            DOM.addingResultGuestGoalsJQ.val('');
        } else {
            // hide adding result view
        };
    }
    getCurrentStage() {
        for (let s in this.stages) {
            if (!this.stages[s].finished) return this.stages[s];
        };
        return false;
    }
    decorateBestOnView() {
        let currentStage = this.getCurrentStage();
        if (currentStage) {
            if (currentStage.type.match(/league/g)) {
                let bestPlayers = currentStage.getBestTeamNames();
                if (!bestPlayers) return;

                let {leagueFixturesJQ} = DOM;
                let [first, second, third] = currentStage.getBestTeamNames();
                $('.league-fixtures .first, .league-fixtures .second, .league-fixtures .third').removeClass('first second third');
                leagueFixturesJQ.find(`tbody td:contains('${first}')`).addClass('first');
                leagueFixturesJQ.find(`tbody td:contains('${second}')`).addClass('second');
                leagueFixturesJQ.find(`tbody td:contains('${third}')`).addClass('third');
            };
        };

    }
    updateLogo() {
        DOM.logoJQ.text(this.name);
    }
    getTeam(name) {
        return this.teams.find(t => t.name === name);
    }
    backup() {
        let {name, type, leagueRevenge, cupRevenge, teams, stages, finished} = this;
        let backup = {
            name,
            type,
            leagueRevenge,
            cupRevenge,
            teams: teams.map(t => t.backup()),
            stages: stages.map(m => m.backup()),
            finished
        };
        let backupJSON = JSON.stringify(backup);
        if (backup) localStorage.setItem('twoj_turniej_backup', backupJSON);
        else throw new Error(ERRORS.BACKUP_CREATION_FAILED[lang]);
    }
    clearTour() {
        tour.stages = [];
        tour.teams = [];
        DOM.leagueFixturesJQ.find('tbody').empty();
        DOM.cupFixturesJQ.find('tbody').empty();
        DOM.leagueTableJQ.find('tbody').empty();
    }
    loadFromBackup() {
        let backupJSON = localStorage.getItem('twoj_turniej_backup');
        
        if (backupJSON) {
            this.clearTour();
            let bTour = JSON.parse(backupJSON);
            let {name, type, leagueRevenge, cupRevenge, finished, teams, stages} = bTour;
            this.name = name;
            this.type = type;
            this.leagueRevenge = leagueRevenge;
            this.cupRevenge = cupRevenge;
            this.finished = finished;
            this.teams = teams.map(t => new Team(t)); // odtwórz drużyny bez statystyk

            stages.forEach(s => {
                let {type, teams, revenges, rounds, finished} = s;

                teams = teams.map(t => this.getTeam(t));
                let stage;
                if (type === 'league') stage = new League(teams, revenges);
                else if (type === 'cup') stage = new Cup(teams, revenges);

                if (stage) {
                    stage.updateFromBackup(teams, rounds, finished);
                    this.stages.push(stage);
                };
            });
            if (this.getNextMatch()) show(DOM.addResultBarJQ);
            this.updateLogo();
        };
    }
}

const tourEmitter = new TourEmitter();
const tour = new Tour();

function addTeam(name) {
    // JEŚLI JUŻ JEST 64 DRUŻYNY, NIE MOŻNA DODAĆ WIĘCEJ NIŻ 64 DRUŻYNY
    if (!name) return alert(ALERTS.LACK_OF_NAME[lang]);
    if (tour.teams.length >= 64) return alert(ALERTS.TOO_MUCH_TEAMS[lang]);
    tour.addTeam(name);
};

function addTeamFromInput() {
    // JEŚLI JUŻ JEST 64 DRUŻYNY, NIE MOŻNA DODAĆ WIĘCEJ NIŻ 64 DRUŻYNY
    let {newTeamJQ} = DOM;
    let name = newTeamJQ.val();
    if (addTeamsWhenSpecialCode(name)) return;
    addTeam(name);
    newTeamJQ.val('');
    newTeamJQ.focus();
};

let teamNames = [
    {en: 'Giants', pl: 'Giganci'},
    {en: 'Shepherds', pl: 'Pasterze'},
    {en: 'Carpenters', pl: 'Stolarze'},
    {en: 'Mechanics', pl: 'Mechanicy'},
    {en: 'Sailors', pl: 'Żeglarze'},
    {en: 'Shopkeepers', pl: 'Sklepikarze'},
    {en: 'Apothecaries', pl: 'Aptekarze'},
    {en: 'Amateurs', pl: 'Amatorzy'},
    {en: 'Footballers', pl: 'Piłkarze'},
    {en: 'Golfers', pl: 'Golfiści'},
    {en: 'Singers', pl: 'Piosenkarze'},
    {en: 'Stars', pl: 'Gwiazdy'},
    {en: 'Planets', pl: 'Planety'},
    {en: 'Postmans', pl: 'Listonosze'},
    {en: 'Scientists', pl: 'Naukowcy'},
    {en: 'Teachers', pl: 'Nauczyciele'},
    {en: 'Pupils', pl: 'Uczniowie'},
    {en: 'Parents', pl: 'Rodzice'},
    {en: 'Kids', pl: 'Dzieci'},
    {en: 'Drivers', pl: 'Kierowcy'},
]; // POWINNO BYć 64

function addTeamsWhenSpecialCode(code) {
    let generateTeams = '##g';
    if (code.match(generateTeams)) {
        code = code.slice(generateTeams.length, code.length);
        let type = code[0];
        if (type === 's') {
            let howMany = parseInt(code.slice(1, code.length)) || 4;
            for (let i=0; i<howMany; i++) {
                addTeam(teamNames[i][lang]);
            };
            return true;
        };
    };
};

DOM.addTeamBtnJQ.on('click', addTeamFromInput);
$(document).on('keydown', function (event) {  
    if (event.which == 13 && event.target === DOM.newTeamJQ[0]) addTeamFromInput();                
});

DOM.readyTeamsBtnJQ.on('click', function() {
    goToPage(DOM.tourSettingsPageJQ);
    hide(DOM.addResultBarJQ);
});

DOM.backToAddingTeamsJQ.on('click', function() {
    goToPage(DOM.addingTeamsPageJQ);
    hide(DOM.addResultBarJQ);
});

DOM.selectTourTypeJQ.on('change', function() {
    tour.toggleRevengeCheckboxes();
});

DOM.startTourBtnJQ.on('click', function() {
    let {tourNameJQ, selectTourTypeJQ, cupRevengeValJQ, leagueRevengeValJQ} = DOM;
    tour.name = tourNameJQ.val() || 'Puchar Króla';
    tour.type = selectTourTypeJQ.val();
    tour.leagueRevenge = leagueRevengeValJQ[0].checked;
    tour.cupRevenge = cupRevengeValJQ[0].checked;
    tour.startTour();
    show(DOM.addResultBarJQ);
});

function addResult() {
    // POBIERZ WARTOŚCI Z PÓL
    let hostGoals = parseInt(DOM.addingResultHostGoalsJQ.val());
    let guestGoals = parseInt(DOM.addingResultGuestGoalsJQ.val());
    if (isNaN(hostGoals) || isNaN(guestGoals)) alert(ALERTS.NAN_IN_ADDING_RESULT[lang]);
    else tour.addResultToNextMatch(hostGoals, guestGoals);
    DOM.addingResultHostGoalsJQ.focus();
    fastGoalsForHost();
};

DOM.addResultBtnJQ.on('click', addResult);
$(document).on('keydown', function(event) {  
    if (event.which == 13 && (event.target === DOM.addingResultHostGoalsJQ[0] || event.target === DOM.addingResultGuestGoalsJQ[0])) addResult();   
});

DOM.goToCupViewBtnJQ.on('click', function() {  
    goToPage(DOM.cupViewPageJQ);
    addClass.call(DOM.goToCupViewBtnJQ, 'active');
    removeClass.call(DOM.goToLeagueViewBtnJQ, 'active');              
});

DOM.goToLeagueViewBtnJQ.on('click', function() {  
    goToPage(DOM.leagueViewPageJQ);
    addClass.call(DOM.goToLeagueViewBtnJQ, 'active');            
    removeClass.call(DOM.goToCupViewBtnJQ, 'active');            
});


toggleBackupBtns();
DOM.loadBackupBtnJQ.on('click', function() {
    if (!confirm(ALERTS.DO_YOU_WANT_LOAD_BACKUP[lang])) return;
    tour.loadFromBackup();
});

DOM.saveBackupBtnJQ.on('click', function() {
    if (!confirm(ALERTS.DO_YOU_WANT_SAVE_BACKUP[lang])) return;
    tour.backup();
    toggleBackupBtns();
});

DOM.clearBackupBtnJQ.on('click', function() {
    if (!confirm(ALERTS.DO_YOU_WANT_CLEAR_BACKUP[lang])) return;
    localStorage.removeItem('twoj_turniej_backup');
    toggleBackupBtns();
});


function fastGoalsForHost() {
    addClass.call(DOM.addingResultHostJQ, 'active');
    removeClass.call(DOM.addingResultGuestJQ, 'active');
};
function fastGoalsForGuest() {
    addClass.call(DOM.addingResultGuestJQ, 'active');
    removeClass.call(DOM.addingResultHostJQ, 'active');
};

DOM.addingResultHostJQ.on('click', fastGoalsForHost);
DOM.addingResultGuestJQ.on('click', fastGoalsForGuest);

DOM.fastGoalsBtnJQ.on('click', function() {
    let hostIsActive = DOM.addingResultHostJQ.hasClass('active');
    let guestIsActive = DOM.addingResultGuestJQ.hasClass('active');
    let goals = $(this).val();

    if (hostIsActive) {
        DOM.addingResultHostGoalsJQ.val(goals);
        fastGoalsForGuest();
    } else if (guestIsActive) DOM.addingResultGuestGoalsJQ.val(goals);
});

DOM.autosaveBackupBtnJQ.on('click', function() {
    $(this).toggleClass('active');
});

DOM.leagueFixturesJQ.find('thead').on('click', function() {
    let thead = $(this);
    if (thead.hasClass('hiding-something')) tour.stages[0].showAllMatches();
    else tour.stages[0].hideFinishedMatches();
});


// PO ZAKOŃCZENIU LIGI, SPRAWDZENIE CZY TRZEBA WYGENEROWAĆ JESZCZE FAZĘ PUCHAROWĄ

// INNE POMYSŁY
// ZRÓB FAZĘ GRUPOWĄ

// Po zakończeniu fazy lub całego turnieju ukryj pola dodawania wyniku

// Po kliknięciu na zawodnika w tabli wyświetla się lista jego meczy

// PODŚWIETLAJ PROWADZĄCEGO W TABELI W FIXTURES

// PODŚWIETL ZWYCIĘZCĘ
// KOLORUJ PIERWSZE 3 MIEJSCA W FIXTURES ZŁOTYM, SREBRNYM I BRĄZOWYM PODKREŚLENIEM (dopiero po pierwszej rundzie)
// KOLORUJ AKTUALNY MATCH NA LIŚCIE MECZY I PODŚWIETL NA JAKIE MIEJSCE MOŻE WSKOCZYĆ DANA DRUŻYNA W PRZYPADKU WYSOKIEJ WYGRANEJ

// DODAJ NOWY TYP TZN. FREE TOUR: ZDEFINIOWANIE DRUŻYN I NA BIEŻĄCO DODAWANIE MECZÓW

// ZAPISUJ W LOCALSTORAGE UŻYTE NAZWY I SYGERUJ JE PODCZAS DODAWANIA GRACZY

// przyciski popularnych wyników lub -/+ lub 1-5 żeby ułatwić wprowadzanie wyniku

// cofnij 1 mecz

// wyczyść stan rozgrywki w pucharze, lidze lub całym turnieju (może być przydatne również podczas wczytywania backupu)

// obsługa karnych w pucharze, przy remisie w meczu lub dwumeczu

// nie pozwól dodać jakiegoś bardzo, bardzo wysokiego wyniku

// dodaj opcję automatycznie dokończ bieżącą fazę i przejdź do następnej

// generuj nazwę drużyny

// grupy graczy np. pingiel, żeby za każdym razem nie dodawać ich, a im bardziej intuicyjne tym lepiej

// Źle podświetla na końcu w fixtures chyba po prostu nie aktualizuje

// dodaj obsługę karnych
// gdy finał zakończy się remisem nie wyświetlają się karne

// wyświetlaj karne obok wyniku podstawowego

// dodaj obsługę skrótów np. ##a-e = dodanie zawodników a, b, c, d, e

// wyświetlaj przyciski przechodzenia pomiędzy fazami turnieju tylko jeśli są co najmniej 2 fazy

// zablokuj możliwość dodania dwóch drużyn o tej samej nazwie

// Dodaj stoper, który startuje i odlicza zdefiniowany czas

// Popraw sortowanie, ponieważ nie działa poprawnie w lidze, sprawdzone na ##gs12
// TRZEBA PO PROSTU NA POCZĄTKU SORTOWAĆ WSZYSTKIE DRUŻYNY

// Przy bardzo dużej lidze źle sortuje tabelę

// Liga + puchar nie pozkazuje Rewanże w pucharze?