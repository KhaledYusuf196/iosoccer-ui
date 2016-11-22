const fs = require('fs');
const path = require('path');

const MIN_MATCH_MINUTES = 60;

const START_MMR = 1200;

const MMR_DIFF_POINTS = [
    {threshold: -150,   win: 21,    draw: 8,    loss: -9,   cleanSheet: 5,  twoGoalAdv: 3,  twoGoalDef: -1, abandon: -10},
    {threshold: -100,   win: 19,    draw: 6,    loss: -11,  cleanSheet: 5,  twoGoalAdv: 3,  twoGoalDef: -1, abandon: -10},
    {threshold: -50,    win: 17,    draw: 4,    loss: -13,  cleanSheet: 3,  twoGoalAdv: 2,  twoGoalDef: -2, abandon: -10},
    {threshold: 49,     win: 15,    draw: 2,    loss: -15,  cleanSheet: 3,  twoGoalAdv: 2,  twoGoalDef: -2, abandon: -10},
    {threshold: 99,     win: 13,    draw: 0,    loss: -17,  cleanSheet: 3,  twoGoalAdv: 2,  twoGoalDef: -2, abandon: -10},
    {threshold: 149,    win: 11,    draw: -4,   loss: -19,  cleanSheet: 1,  twoGoalAdv: 1,  twoGoalDef: -3, abandon: -10},
    {threshold: 999,    win: 9,     draw: -6,   loss: -21,  cleanSheet: 1,  twoGoalAdv: 1,  twoGoalDef: -3, abandon: -10}
];

const STATS = [
    'goals'
];

const MATCH_FILES_FOLDER = 'match-files';

const MatchResult = {
    WIN: Symbol(),
    DRAW: Symbol(),
    LOSS: Symbol()
};

const Team = {
    HOME: 'home',
    AWAY: 'away'
};

let matchDataList = [];

let playerData = {};

let matchFiles = fs.readdirSync(MATCH_FILES_FOLDER).filter(fileName => {
    return (fileName.endsWith('.json') && !fs.statSync(path.join(MATCH_FILES_FOLDER, fileName)).isDirectory());
}).sort();

matchFiles.forEach(fileName => {

    console.log('Parsing', fileName);

    let rawMatchData = JSON.parse(fs.readFileSync(path.join(MATCH_FILES_FOLDER, fileName), 'utf8')).matchData;

    let indices = {};

    STATS.forEach(stat => indices[stat] = rawMatchData.statisticTypes.findIndex(type => type == stat));

    let matchData = {teams: {}};

    rawMatchData.teams.forEach(team => {
        matchData.teams[team.matchTotal.side] = {
            players: [],
            goals: team.matchTotal.statistics[indices.goals]
        };
    });

    if (matchData.teams[Team.HOME].goals > matchData.teams[Team.AWAY].goals) {

        matchData.teams[Team.HOME].result = MatchResult.WIN;
        matchData.teams[Team.AWAY].result = MatchResult.LOSS;

    } else if (matchData.teams[Team.AWAY].goals > matchData.teams[Team.HOME].goals) {

        matchData.teams[Team.AWAY].result = MatchResult.WIN;
        matchData.teams[Team.HOME].result = MatchResult.LOSS;

    } else {

        matchData.teams[Team.HOME].result = MatchResult.DRAW;
        matchData.teams[Team.AWAY].result = MatchResult.DRAW;
    }

    let matchEndSecond = 90 * 60 + rawMatchData.teams[0].matchPeriods.find(period => period.period == 2).actualInjuryTimeSeconds;

    matchData.startTime = rawMatchData.matchInfo.startTime * 1000;
    matchData.endTime = rawMatchData.matchInfo.endTime * 1000;

    matchDataList.unshift(matchData);

    rawMatchData.players.forEach(player => {

        let steamId = player.info.steamId;

        // Return if player is spectator
        if (player.matchPeriodData.length == 0) return;

        let team = player.matchPeriodData[0].info.team;
        let opponent = team == 'home' ? 'away' : 'home';

        // Return if player has changed team during match
        if (!player.matchPeriodData.every(data => data.info.team == team)) return;

        // Return if player hasn't played through most of the match
        if (player.matchPeriodData.reduce((seconds, data) => seconds + (data.info.endSecond - data.info.startSecond), 0) < MIN_MATCH_MINUTES * 60) return;

        if (!playerData[steamId]) {

            playerData[steamId] = {
                steamId: steamId,
                mmr: START_MMR,
                matches: 0,
                wins: 0,
                draws: 0,
                losses: 0
            };
        }

        let totalData = playerData[steamId];

        let data = {
            steamId: steamId,
            abandon: !player.matchPeriodData.find(data => data.info.endSecond == matchEndSecond),
        }

        totalData.name = player.info.name;
        totalData.matches += 1;

        if (matchData.teams[team].result == MatchResult.WIN)
            totalData.wins += 1
        else if (matchData.teams[team].result == MatchResult.LOSS)
            totalData.losses += 1
        else
            totalData.draws += 1;

        totalData.cleanSheets = (totalData.cleanSheets || 0);

        if (matchData.teams[opponent].goals == 0)
             totalData.cleanSheets += 1;

        ['goals'].forEach(stat => {
            data[stat] = player.matchPeriodData.reduce((statSum, periodData) => statSum + periodData.statistics[indices[stat]], 0);
        });

        totalData['goals'] = (totalData['goals'] || 0) + matchData.teams[team].goals;

        matchData.teams[team].players.push(data);
    });

    let getAvgMmr = team => matchData.teams[team].players.reduce((totalMmr, player) => totalMmr + playerData[player.steamId].mmr, 0) / matchData.teams[team].players.length;

    matchData.teams[Team.HOME].mmrDiff = getAvgMmr(Team.HOME) - getAvgMmr(Team.AWAY);
    matchData.teams[Team.AWAY].mmrDiff = matchData.teams[Team.HOME].mmrDiff * -1;

    [Team.HOME, Team.AWAY].forEach(team => {

        let opponent = team == 'home' ? 'away' : 'home';
        let mmrDiff = matchData.teams[team].mmrDiff;
        let result = matchData.teams[team].result;
        let points = MMR_DIFF_POINTS.find(points => points.threshold >= mmrDiff);

        matchData.teams[team].players.forEach(player => {

            let totalData = playerData[player.steamId];

            // Result points
            totalData.mmr += (() => {
                switch (result) {
                    case MatchResult.WIN: return points.win;
                    case MatchResult.LOSS: return points.loss;
                    default: return points.draw;
                }
            })();

            player.mmr = totalData.mmr;

            // Clean sheet points
            if (matchData.teams[opponent].goals == 0)
                totalData.mmr += points.cleanSheet;

            let goalDiff = matchData.teams[team].goals - matchData.teams[opponent].goals;

            // Two goal advantage points
            if (goalDiff >= 2)
                totalData.mmr += Math.trunc(goalDiff / 2) * points.twoGoalAdv;

            // Two goal deficit points
            if (matchData.teams[team].goals - matchData.teams[opponent].goals <= -2)
                totalData.mmr += Math.abs(Math.trunc(goalDiff / 2)) * points.twoGoalDef;

            // Abandon points
            if (player.abandon)
                totalData.mmr += points.abandon;
        });
    });
});

let playerDataList = Object.keys(playerData).map(steamId => playerData[steamId]).sort((a, b) => b.mmr - a.mmr);

let content = `
import { Player } from './player';

export const STATISTICS = {
    "players": ${JSON.stringify(playerDataList)},    
    "matches": ${JSON.stringify(matchDataList)}
}
`;

fs.writeFile('./src/app/statistics.ts', content, err => {
    if (err) console.log(err);
    else console.log('Statistics file created');
});