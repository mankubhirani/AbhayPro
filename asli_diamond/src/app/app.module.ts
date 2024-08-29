import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { FormattednumberPipe } from '@shared/pipes/formattednumber.pipe';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Constants } from './config/constant';
import { CoreModule } from './core/core.module';
import { HttpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { JwtTokenInterceptor } from './core/interceptors/jwt-token.interceptor';
// import { SubscriptionTokenInterceptor } from './core/interceptors/subscription-token.interceptor';
import { LoaderModule } from './shared/loader/loader.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IndexComponent } from './components/index/index.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { LeftNavigationComponent } from '@shared/components/left-navigation/left-navigation.component';
import { SharedModule } from '@shared/shared.module';
import { AccountStatementComponent } from './components/account-statement/account-statement.component';
import { ProfitAndLossComponent } from './components/profit-and-loss/profit-and-loss.component';
import { BetHistoryComponent } from './components/bet-history/bet-history.component';
import { UnsetteledBetComponent } from './components/unsetteled-bet/unsetteled-bet.component';
import { CasinoReportHistoryComponent } from './components/casino-report-history/casino-report-history.component';
import { SetButtonValueComponent } from './components/set-button-value/set-button-value.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { GameListComponent } from './components/game-list/game-list.component';
import { MatchMarketListComponent } from './components/match-market-list/match-market-list.component';
@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    AccountStatementComponent,
    ProfitAndLossComponent,
    BetHistoryComponent,
    UnsetteledBetComponent,
    CasinoReportHistoryComponent,
    SetButtonValueComponent,
    ChangePasswordComponent,
    GameListComponent,
    MatchMarketListComponent,
    FormattednumberPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    LoaderModule,
    NgxUiLoaderRouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: false })
  ],
  providers: [
    Constants,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: SubscriptionTokenInterceptor,
    //   multi: true
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtTokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

