import { NgModule }                 from '@angular/core';
import { RouterModule, Routes }     from '@angular/router';
import { LeaderboardsComponent }    from './leaderboards/leaderboards.component';
import { MatchesComponent }         from './matches/matches.component';
import { BlogComponent }            from './blog/blog.component';

const routes: Routes = [
  { path: '', redirectTo: '/leaderboards', pathMatch: 'full' },
  { path: 'leaderboards',  component: LeaderboardsComponent },
  { path: 'matches', component: MatchesComponent },
  { path: 'blog', component: BlogComponent },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}