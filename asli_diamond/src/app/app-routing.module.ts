import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { AccountStatementComponent } from './components/account-statement/account-statement.component';
import { ProfitAndLossComponent } from './components/profit-and-loss/profit-and-loss.component';
import { BetHistoryComponent } from './components/bet-history/bet-history.component';
import { UnsetteledBetComponent } from './components/unsetteled-bet/unsetteled-bet.component';
import { CasinoReportHistoryComponent } from './components/casino-report-history/casino-report-history.component';
import { SetButtonValueComponent } from './components/set-button-value/set-button-value.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { GameListComponent } from './components/game-list/game-list.component';
import { MatchMarketListComponent } from './components/match-market-list/match-market-list.component'

const routes: Routes = [
  {
    path: "",
    component: IndexComponent,
  },
  // {
  //   path: "account-statement",
  //   component: AccountStatementComponent,
  // },
  // {
  //   path: "profit-loss",
  //   component: ProfitAndLossComponent,
  // },
  // {
  //   path: "bet-history",
  //   component: BetHistoryComponent,
  // },
  {
    path: "unsetteled-bet",
    component: UnsetteledBetComponent,
  },
  {
    path: "casino-report-history",
    component: CasinoReportHistoryComponent,
  },
  {
    path: "set-button-value",
    component: SetButtonValueComponent,
  },
  // {
  //   path: "change-password",
  //   component: ChangePasswordComponent,
  // },
  {
    path: "game-list/:sports",
    component: GameListComponent,
  },
  {path:'sportsbook/:sports/:tourId/:matchId',component:MatchMarketListComponent},
  // {
  //   path: '',
  //   loadChildren: () => import('./features/in-play/in-play.module').then((m) => m.InPlayModule)
  // },

  {
    path: '',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule)
  },

  // {
  //   path: '',
  //   loadChildren: () => import('./features/sports-book/sports-book.module').then((m) => m.SportsBookModule)
  // },

  {
    path: '',
    loadChildren: () => import('./features/user-settings/user-settings.module').then((m) => m.UserSettingsModule)
  },

  {
    path: '',
    loadChildren: () => import('./features/casino/casino.module').then((m) => m.CasinoModule)
  },

  { path: "**", redirectTo: "/login", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
