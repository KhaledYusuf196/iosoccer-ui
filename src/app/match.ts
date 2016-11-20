import { Team } from './team';

export class Match {
    homeTeam: Team
    awayTeam: Team
    startTime: Date
    endTime: Date

    constructor(homeTeam: Team, awayTeam: Team, startTime: number, endTime: number) {
        this.homeTeam = homeTeam;
        this.awayTeam = awayTeam;
        this.startTime = new Date(startTime);
        this.endTime = new Date(endTime);
    }
}
