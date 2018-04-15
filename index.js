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
    },
    LACK_OF_MATCHES_IN_ROUND: {
        en: 'You cannot create a round without matches',
        pl: 'Nie można zdefiniować rundy bez podania meczów'
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
    },
    NAN_IN_ADDING_RESULT: {
        en: 'You cannot add a result without typing goals!',
        pl: 'Nie możesz dodać wyniku bez wypełnienia goli!'
    },
    TOURNAMENT_IS_FINISHED: {
        en: 'This was the last match in this tour. See you next time!',
        pl: 'To był ostatni mecz w turnieju. Do zobaczenia następnym razem!'
    },
    PENALTIES_START: {
        en: 'Penalties time!',
        pl: 'Czas na rzuty karne!'
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

    addResultBarJQ: $('#add-result'),
    newTeamJQ: $('.team-name'),
    addTeamBtnJQ: $('.add-team'),
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

        this.onTeamListJQ = $(`<tr><td>${this.name}</td><td class="delete-team">&times;</td></tr>`).appendTo(DOM.addedTeamsJQ);
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
        goalsLost.text(this.goalsScored);

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
    clearStats() {
        this.won = 0;    
        this.draw = 0;    
        this.lost = 0;    
        this.points = 0;    
        this.goalsScored = 0;    
        this.goalsLost = 0;    
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
        if (this.stage.match(/league/g)) {
            this.onFixturesList = $(`<tr><td>${host.name}</td><td class="result"></td><td>${guest.name}</td></tr>`).appendTo(DOM.leagueFixturesJQ);
        } else if (this.stage.match(/cup/g)) {
            this.onFixturesList = $(`<tr><td>${host.name}</td><td class="result"></td><td>${guest.name}</td></tr>`).appendTo(DOM.cupFixturesJQ);
            if (stage.match(/cup-1\/1/g)) this.penalties = true;
        };
    }
    addResult(hostGoals, guestGoals) {
        this.finished = true;
        this.hostGoals = hostGoals;
        this.guestGoals = guestGoals;
        if (this.stage.match(/league/g)) {
            this.updateTeamsResults();
            this.onFixturesList.find('.result').text(`${hostGoals}:${guestGoals}`);
        } else {
            this.onFixturesList.find('.result').text(`${hostGoals}:${guestGoals}`);
        };
        if (hostGoals === guestGoals && this.penalties) this.playPenalties();
        tourEmitter.emit('finishedMatch', this);
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
    playPenalties() {
        // PRZEPROWADŹ KARNE!!!
        alert(ALERTS.PENALTIES_START[lang]);
        let {host, guest} = this;
        this.hostPenaltiesGoals = parseInt(prompt(`Podaj gole dla ${host.name}:`, 5)); // ZMIEŃ NA LEPSZĄ WERSJĘ
        this.guestPenaltiesGoals = parseInt(prompt(`Podaj gole dla ${guest.name}:`, 5)); // ZMIEŃ NA LEPSZĄ WERSJĘ

        if (this.hostPenaltiesGoals > this.guestPenaltiesGoals) {
            this.penaltiesWinner = host;
            console.log(this);
            return host;
        } else {
            this.penaltiesWinner = guest;
            console.log(this);
            return guest;
        };
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

        tourEmitter.listen('finishedMatch', (match) => {
            if (this.finished) return;
            console.log(this.matches[this.matches.length-1].finished, this.matches[this.matches.length-1])
            if (this.matches[this.matches.length-1].finished) {
                if (this.isDraw() && this.penalties && !this.penaltiesWinner) this.playPenalties();
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
    whoWon() { // HERE IS A BUG
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
    
}


class Round {
    constructor(matches) {
        if (!matches) throw Error(ERRORS.LACK_OF_MATCHES_IN_ROUND[lang]);
        this.matches = matches;
        this.finished = false;

        console.log(matches);
        tourEmitter.listen('finishedMatch', (match) => {
            if (this.finished) return;
            if (this.matches[this.matches.length-1].finished) this.finished = true;
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
                console.log(m.isDraw(), m.penalties, m);
                if (m.isDraw() && m.penalties) {
                    m.playPenalties();
                    winners.push(m.whoWon());
                };
            };
        });
        console.log('winners', winners);
        if (!winners) return console.log('There is no winners!'); // ZMIEŃ TO
        winners.forEach(w => {
            console.log(w);
            w.clearStats();
        });
        return winners;
    }

}


class League {
    constructor(teams, leagueRevenge) {
        if (!teams) throw Error(ERRORS.LACK_OF_TEAMS_IN_LEAGUE[lang]);

        this.type = 'league';
        this.teams = teams;
        this.leagueRevenge = leagueRevenge;
        this.rounds = [];
        this.finished = false;
        this.generateLeague();

        tourEmitter.listen('finishedMatch', (match) => {
            if (this.finished === true) return;
            if (this.rounds[this.rounds.length-1].finished) this.finished = true;
            setTimeout(() => {
                this.sortLeagueTable();
                tourEmitter.emit('tableSorted');
            }, 50);
        });
    }

    generateLeague() {
        let repeatCount = 1;
        
        if (this.leagueRevenge) repeatCount = 2;

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
        let nextMatch = round.getNextMatch();
        if (nextMatch) return nextMatch;
        else return false;
    }
    updateAddingResult() {
        let nextMatch = this.getNextMatch();
        if (nextMatch) nextMatch.show//
        else ; // UKRYJ FORMULARZ ADDING MATCH RESULT
    }
    sortLeagueTable() {
        let tbody = DOM.leagueTableJQ.find('tbody');
        tbody.find('tr').sort(function(a, b) {
            // ONLY DESC DIRECTION
            let pointsDelta = intFromText($('td:nth(2)', b)) - intFromText($('td:nth(2)', a));
            if (pointsDelta) return pointsDelta > 0;

            let aGoalsScored = intFromText($('td:nth(7)', a));
            let aGoalsLost = intFromText($('td:nth(7)', a));
            let bGoalsScored = intFromText($('td:nth(6)', b));
            let bGoalsLost = intFromText($('td:nth(7)', b));
            let goalDelta = (bGoalsScored - bGoalsLost) - (aGoalsScored - aGoalsLost);
            if (goalDelta) return goalDelta > 0;

            let winsDelta = intFromText($('td:nth(3)', b)) - intFromText($('td:nth(3)', a));
            if (winsDelta) return winsDelta;

            let drawDelta = intFromText($('td:nth(4)', b)) - intFromText($('td:nth(4)', a));
            if (drawDelta) return drawDelta > 0;

            let moreGoalsScored = bGoalsScored - aGoalsScored;
            return moreGoalsScored > 0;

            let lostDelta = intFromText($('td:nth(5)', a)) - intFromText($('td:nth(5)', b));
            if (lostDelta) return lostDelta > 0;
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
    getQualifiedTeams() {
        let qualifiedTeamNames = [];
        let teamsInTableJQ = DOM.leagueTableJQ.find('tbody > tr').each((i, v) => {
            if (i < this.teams.length/2) qualifiedTeamNames.push($(v).find('.name').text());
        });

        let qualifiedTeams = qualifiedTeamNames.map(name => this.teams.find(team => name === team.name));

        if (qualifiedTeams) return qualifiedTeams;
        else return false;
    }
}


class Cup {
    constructor(teams, cupRevenge) {
        if (!teams) throw Error(ERRORS.LACK_OF_TEAMS_IN_CUP[lang]);

        this.type = 'cup';
        this.teams = teams;
        this.cupRevenge = cupRevenge;
        this.rounds = []; // GENERATE NEW ROUND AT END OF LAST UNTIL FINAL
        this.finished = false;
        this.generateNextRound();
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
        if (teams.length === 1) {
            alert(ALERTS.TOURNAMENT_IS_FINISHED[lang]);
            // DODAJ POKAZANIE ZWYCIĘZCY
        };

        let matches = [];
        let nextStage = `cup-${this.getNextRoundName()}`;
        for (let i=0; i<teams.length; i=i+2) {
            let team1 = teams[i], team2 = teams[i+1];
            if (!team1 || !team2) {
                // CHECK WHO WON IN FINAL AND IF HAVE TO START PENALTIES
                if (this.rounds) console.log(this.rounds[this.rounds.length-1].matches[0].whoWon());
                return false;
            };

            console.log('tu', team1, team2, nextStage);
            if (this.cupRevenge && teams.length > 2) matches.push(new Tie(new Match(team1, team2, nextStage), new Match(team2, team1, nextStage), nextStage));
            else if (this.cupRevenge && teams.length === 2) matches.push(new Match(team1, team2, nextStage));
            else if (!this.cupRevenge) matches.push(new Match(team1, team2, nextStage));
        };
        if (matches.length > 0) this.rounds.push(new Round(matches));
    }
    getRoundName() {
        if (this.rounds) return `1/${this.rounds[this.rounds.length-1].length}`;
        else return false;
    }
    getNextRoundName() {
        let lastRound = this.rounds[this.rounds.length-1];
        if (!lastRound) return `1/${this.teams.length/2}`; // zmien na ALERTS

        let numberOfMatchesInCurrentStage = this.rounds[this.rounds.length-1].matches.length;
        console.log('number of matches in current stage', numberOfMatchesInCurrentStage);
        if (numberOfMatchesInCurrentStage >= 2) return `1/${numberOfMatchesInCurrentStage/4}`;
        else if (numberOfMatchesInCurrentStage === 1) return `1/1`;
        else return false;
    }

    getNextMatch() {
        // BELOW IS ONLY A COPY FROM A LEAGUE CLASS, IT MUST BE CHANGED
        let round = this.rounds.find(r => !r.finished);

        if (round) return round.getNextMatch();
        else {
            this.generateNextRound();
            round = this.rounds.find(r => !r.finished);
            if (round) {
                let nextMatch = round.getNextMatch();
                if (nextMatch) return nextMatch;
                else return false;
            };
        };
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
        tourEmitter.listen('finishedMatch', (match) => {
            setTimeout(() => {
                this.updateAddingResultView();
            
                if (this.stages[this.stages.length-1].finished) {
                    if (this.type === 'lc') {
                        // GENERUJ FAZĘ PUCHAROWĄ
                        let teams = this.stages[this.stages.length-1].getQualifiedTeams();
                        this.stages.push(new Cup(teams, this.cupRevenge));
                        show(DOM.goToCupViewBtnJQ);
                        goToPage(DOM.cupViewPageJQ);
                    } else {
                        this.finished = true;
                        hide(DOM.addingResultJQ)
                        alert(ALERTS.TOURNAMENT_IS_FINISHED[lang]);
                    };
                };
            }, 50);
        });
        tourEmitter.listen('tableSorted', (match) => {
            // if (this.finished === true) return; // jeśli dodam tą linijkę, wtedy po ostatniej kolejce nie wykona się kod dekoratora
            this.decorateBestOnView();
        });
    }
    addTeam(newTeam) {
        if (!newTeam) return alert(ALERTS.LACK_OF_NAME[lang]);
        if (this.teams.length >= 64) return alert(ALERTS.MAX_NUMBER_OF_TEAMS);
        this.teams.push(new Team(newTeam));
        if (this.teams.length >= 2) show(DOM.readyTeamsBtnJQ);
        this.showOnlyPossibleTypes();   
    }
    removeTeam(name) {
        this.teams.splice(this.teams.findIndex(t => t.name === name), 1);
        if (this.teams.length < 2) hide(DOM.readyTeamsBtnJQ);
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
            show(DOM.goToLeagueViewBtnJQ);
        } else {
            this.stages.push(new Cup(teams, cupRevenge));
            show(DOM.goToCupViewBtnJQ);
        };

        switch(this.type) {
            case 'l': goToPage(DOM.leagueViewPageJQ); break;
            case 'c': goToPage(DOM.cupViewPageJQ); break;
            case 'lc': goToPage(DOM.leagueViewPageJQ); break;
        };
        this.updateAddingResultView();
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
        else alert(ALERTS.TOURNAMENT_IS_FINISHED[lang]);
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
}

const tourEmitter = new TourEmitter();
const tour = new Tour();


function addTeam() {
    // JEŚLI JUŻ JEST 64 DRUŻYNY, NIE MOŻNA DODAĆ WIĘCEJ NIŻ 64 DRUŻYNY
    let {newTeamJQ} = DOM;
    let newTeam = newTeamJQ.val();
    if (!newTeam) return alert(ALERTS.LACK_OF_NAME[lang]);
    tour.addTeam(newTeam);
    newTeamJQ.val('');
    newTeamJQ.focus();
};

DOM.addTeamBtnJQ.on('click', addTeam);
$(document).on('keydown', function (event) {  
    if (event.which == 13 && event.target === DOM.newTeamJQ[0]) addTeam();                
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
};

DOM.addResultBtnJQ.on('click', addResult);
$(document).on('keydown', function(event) {  
    if (event.which == 13 && (event.target === DOM.addingResultHostGoalsJQ[0] || event.target === DOM.addingResultGuestGoalsJQ[0])) addResult();                
});

DOM.goToCupViewBtnJQ.on('click', function() {  
    goToPage(DOM.cupViewPageJQ);
    show(DOM.addResultBarJQ);               
});

DOM.goToLeagueViewBtnJQ.on('click', function() {  
    goToPage(DOM.leagueViewPageJQ);
    show(DOM.addResultBarJQ);               
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