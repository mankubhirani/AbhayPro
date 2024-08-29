import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';
import { SettingsMainComponent } from './components/settings-main/settings-main.component';
import { BalanceComponent } from './components/balance/balance.component';
import { BetSettingsComponent } from './components/bet-settings/bet-settings.component';
import { MatchSettingsComponent } from './components/match-settings/match-settings.component';
import { MarketSettingsComponent } from './components/market-settings/market-settings.component';
import { AppSettingsComponent } from './components/app-settings/app-settings.component';
import { GamesSettingsComponent } from './components/games-settings/games-settings.component';
import { MarketAnalysisComponent } from './components/market-analysis/market-analysis.component';

const routes: Routes = [{
  path:'admin',
  component:SettingsMainComponent,
  canActivate: [AuthGuard],
  children:[
    {path:'market-analysis', component:MarketAnalysisComponent},
    // {path:'bet-settings', component:BetSettingsComponent},
    // {path:'match-settings', component: MatchSettingsComponent},
    // {path:'market-settings', component: MarketSettingsComponent},
    // {path:'app-settings', component: AppSettingsComponent},
    // {path:'games-settings', component: GamesSettingsComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
