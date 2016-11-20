import { Player } from './player';

export class Team {
    name: string
    goals: number
    players: Player[]

    constructor(name: string, goals: number, players: Player[]) {
        this.name = name;
        this.goals = goals;
        this.players = players;
    }
}
