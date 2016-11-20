export class PlayerMatchStats {
    mmr: number
    goals: number

    constructor(mmr: number, goals: number) {
        this.mmr = mmr;
        this.goals = goals;
    }
}