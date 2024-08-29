import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MembersListComponent } from './components/members-list/members-list.component';
import { MembersMainComponent } from './components/members-main/members-main.component';
import { CreateMemberComponent } from './components/create-member/create-member.component';
import { MemberDetailsComponent } from './components/member-details/member-details.component';
import { ActivityComponent } from './components/activity/activity.component';
import { BalanceComponent } from './components/balance/balance.component';
import { BetListComponent } from './components/bet-list/bet-list.component';
import { AccountStatementComponent } from './components/account-statement/account-statement.component';
import { TransferStatementsComponent } from './components/transfer-statements/transfer-statements.component';
import { LoginHistoryComponent } from './components/login-history/login-history.component';
import { CommissionComponent } from './components/commission/commission.component';
import { NetExposureComponent } from './components/net-exposure/net-exposure.component';
import { UserAccessComponent } from './components/user-access/user-access.component';
import { AuthGuard } from '@core/guards/auth.guard';
import { WorkstationComponent } from './components/workstation/workstation.component';
import { SearchMemberComponent } from './components/search-member/search-member.component';
import { DownlineListComponent } from './components/downline-list/downline-list.component';

const routes: Routes = [{
  path: 'admin',
  component: MembersMainComponent,
  canActivate: [AuthGuard],
  children: [
    { path: 'active-users', component: MembersListComponent },
    { path: 'downline-list/:id', component: DownlineListComponent },
    { path: 'search-member', component: SearchMemberComponent },
    { path: 'add-account', component: CreateMemberComponent },
    { path: 'edit-member/:id', component: CreateMemberComponent },
    { path: 'user-access', component: UserAccessComponent },
    { path: 'workstation/:type/:id/:userId', component: WorkstationComponent },
    {
      path: 'member-details/Player/:username/:createdDate/:userId',
      component: MemberDetailsComponent,
      children: [
        { path: 'activity/:id', component: ActivityComponent },
        { path: 'balance/:id', component: BalanceComponent },
        { path: 'bet-list/:id', component: BetListComponent },
        { path: 'accountStatement/:id', component: AccountStatementComponent },
        { path: 'transfer-statement/:id', component: TransferStatementsComponent },
        { path: 'login-history/:id', component: LoginHistoryComponent },
        { path: 'commission/:id', component: CommissionComponent },
        { path: 'net-exposure/:id', component: NetExposureComponent },
      ]
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }
