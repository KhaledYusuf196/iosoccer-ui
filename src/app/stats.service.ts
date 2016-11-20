import { Injectable } from '@angular/core';
import { Player } from './player';
import { Team } from './team';
import { Match } from './match';
import { PlayerMmrStats } from './player-mmr-stats';
import { PlayerMatchStats } from './player-match-stats';
import { KNOWN_PLAYERS } from './known-players';
import { STATISTICS } from './statistics';
import { MmrBracket } from './mmr-bracket';

@Injectable()
export class StatsService {

  players: Player[]
  matches: Match[]

  constructor() {

    this.players = STATISTICS.players.map(data => {

      let knownPlayer = KNOWN_PLAYERS.find(x => x.steamId == data.steamId);
      let name = knownPlayer && knownPlayer.name || data.name;
      let stats = new PlayerMmrStats(data.mmr, data.goals, data.wins, data.draws, data.losses, data.goals, data.cleanSheets);

      return new Player(data.steamId, name, stats);
    });

    this.matches = STATISTICS.matches.map(match => {

      let teams = ['home', 'away'].map(teamName => {

        let players = match.teams[teamName].players.map(teamPlayer => {
          let player = this.players.find(x => x.steamId == teamPlayer.steamId);
          player.matchStats = new PlayerMatchStats(teamPlayer.mmr, teamPlayer.goals);
          return player;
        });

        return new Team('Mix', match.teams[teamName].goals, players);
      })

      return new Match(teams[0], teams[1], match.startTime, match.endTime);
    });
  }

  getPlayerStats(): Player[] {
      return this.players;
  }

  getMatchStats(): Match[] {
    return this.matches;
  }
}
