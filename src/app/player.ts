import { PlayerMmrStats } from './player-mmr-stats';
import { PlayerMatchStats } from './player-match-stats';

export class Player {
    steamId: string
    name: string
    mmrStats: PlayerMmrStats
    matchStats: PlayerMatchStats

    constructor(steamId: string, name: string, mmrStats: PlayerMmrStats) {
        this.steamId = steamId;
        this.name = name;
        this.mmrStats = mmrStats;
    }
}