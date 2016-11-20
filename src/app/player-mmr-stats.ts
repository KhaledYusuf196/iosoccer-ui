export class PlayerMmrStats {
    mmr: number
    matches: number
    wins: number
    draws: number
    losses: number
    goals: number
    cleanSheets: number

    constructor(mmr: number, matches: number, wins: number, draws: number, losses: number, goals: number, cleanSheets: number) {
        this.mmr = mmr;
        this.matches = matches;
        this.wins = wins;
        this.draws = draws;
        this.losses = losses;
        this.goals = goals;
        this.cleanSheets = cleanSheets;
    }
}