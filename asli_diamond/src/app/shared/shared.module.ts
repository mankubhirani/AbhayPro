import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { FavouriteComponent } from './components/favourite/favourite.component';
import { LeftNavigationComponent } from './components/left-navigation/left-navigation.component';
import { BetSlipComponent } from './components/bet-slip/bet-slip.component';
import { MarketRateFormaterPipe } from './pipes/market-rate-formater.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { BoxHighlightDirective } from './directives/box-highlight.directive';
import { MatchTimePipe } from './pipes/match-time.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { LeftCarousalComponent } from './components/left-carousal/left-carousal.component';


@NgModule({
  declarations: [
    HeaderComponent,
    RightSidebarComponent,
    FavouriteComponent,
    LeftNavigationComponent,
    BetSlipComponent,
    MarketRateFormaterPipe,
    ClickOutsideDirective,
    BoxHighlightDirective,
    MatchTimePipe,
    SortPipe,
    LeftCarousalComponent,

  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    HeaderComponent,
    FavouriteComponent,
    LeftNavigationComponent,
    BetSlipComponent,
    MarketRateFormaterPipe,
    BoxHighlightDirective,
    MatchTimePipe,
    SortPipe,
    LeftCarousalComponent,
  ]
})
export class SharedModule { }
