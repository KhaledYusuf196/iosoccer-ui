import { NgModule }                 from '@angular/core';
import { RouterModule, Routes }     from '@angular/router';
import { LeaderboardsComponent }    from './leaderboards/leaderboards.component';
import { MatchesComponent }         from './matches/matches.component';

const routes: Routes = [
  { path: '', redirectTo: '/leaderboards', pathMatch: 'full' },
  { path: 'leaderboards',  component: LeaderboardsComponent },
  { path: 'matches', component: MatchesComponent },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}