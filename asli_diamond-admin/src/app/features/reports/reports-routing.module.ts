import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsMainComponent } from './components/reports-main/reports-main.component';
import { CurrentBetsComponent } from './components/current-bets/current-bets.component';
import { GeneralReportsComponent } from './components/general-reports/general-reports.component';
import { GameReportsComponent } from './components/game-reports/game-reports.component';
import { CasinoReportComponent } from '../account-statement/components/casino-report/casino-report.component';
import { ProfitLossComponent } from './components/profit-loss/profit-loss.component';
import { CasinoResultReportComponent } from './components/casino-result-report/casino-result-report.component';
import { AccountStatementsComponent } from './components/account-statements/account-statements.component';

const routes: Routes = [
  {
    path:'reports',
    component: ReportsMainComponent,
    children:[
      {path:'account-statement', component:AccountStatementsComponent},
      {path:'current-bets',component:CurrentBetsComponent},
      {path:'general-report',component:GeneralReportsComponent},
      {path:'game-report', component:GameReportsComponent},
      {path:'casino-report', component:CasinoReportComponent},
      {path:'profit-loss', component:ProfitLossComponent},
      {path:'casinoresult',component:CasinoResultReportComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
