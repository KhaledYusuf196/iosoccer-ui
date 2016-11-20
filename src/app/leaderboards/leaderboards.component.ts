import { Component, OnInit } from '@angular/core';
import { Player } from '../player';
import { StatsService } from '../stats.service';
import { MmrBracket } from '../mmr-bracket';
import { MMR_BRACKETS } from '../mmr-brackets';

class PlayerGrouping {
  mmrBracket: MmrBracket
  players: Player[]

  constructor(mmrBracket: MmrBracket, players: Player[]) {
    this.mmrBracket = mmrBracket;
    this.players = players;
  }
}

@Component({
  selector: 'ios-leaderboards',
  templateUrl: './leaderboards.component.html',
  styleUrls: ['./leaderboards.component.scss'],
  providers: [StatsService]
})
export class LeaderboardsComponent implements OnInit {

  playerGroupings: PlayerGrouping[]

  constructor(private statsService: StatsService) {

  }

  ngOnInit() {

    this.playerGroupings = MMR_BRACKETS.map(mmrBracket => {
      return new PlayerGrouping(mmrBracket, []);
    });

    this.statsService.getPlayerStats().forEach(player => {
      let grouping = this.playerGroupings.find(playerGrouping => playerGrouping.mmrBracket.threshold >= player.mmrStats.mmr);
      grouping.players.push(player);     
    });

    this.playerGroupings.reverse();
  }

  getStars(index: number) {
    return Array(this.playerGroupings.length - index).fill(1);
  }

}
