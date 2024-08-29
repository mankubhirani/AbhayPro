import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { AccountStatementsComponent } from './components/account-statements/account-statements.component';
import { CurrentBetsComponent } from './components/current-bets/current-bets.component';
import { GeneralReportsComponent } from './components/general-reports/general-reports.component';
import { GameReportsComponent } from './components/game-reports/game-reports.component';
import { CasinoReportsComponent } from './components/casino-reports/casino-reports.component';
import { ProfitLossComponent } from './components/profit-loss/profit-loss.component';
import { CasinoResultReportComponent } from './components/casino-result-report/casino-result-report.component';
import { ReportsMainComponent } from './components/reports-main/reports-main.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    AccountStatementsComponent,
    CurrentBetsComponent,
    GeneralReportsComponent,
    GameReportsComponent,
    CasinoReportsComponent,
    ProfitLossComponent,
    CasinoResultReportComponent,
    ReportsMainComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
  ]
})
export class ReportsModule { }
