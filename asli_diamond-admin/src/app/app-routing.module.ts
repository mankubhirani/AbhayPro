import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/guards/auth.guard';

const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule)
  },

  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/members/members.module').then((m) => m.MembersModule)
  },

  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/book-management/book-management.module').then((m) => m.BookManagementModule)
  },

  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/account-statement/account-statement.module').then((m) => m.AccountStatementModule)
  },

  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/bank/bank.module').then((m) => m.BankModule)
  },

  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/all-logs/all-logs.module').then((m) => m.AllLogsModule)
  },
  {
    path:'',
    canActivate: [AuthGuard],
    loadChildren:()=>import('./features/surveillance/surveillance.module').then((m)=>m.SurveillanceModule)
  },
  {
    path:'',
    canActivate: [AuthGuard],
    loadChildren:()=>import('./features/settings/settings.module').then((m)=>m.SettingsModule)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/change-password/change-password.module').then((m) => m.ChangePasswordModule)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/google-authentication/google-authentication.module').then((m) => m.GoogleAuthenticationModule)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/reports/reports.module').then((m) => m.ReportsModule)
  },

  // { path: '**', redirectTo: '/admin/active-users', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      preloadingStrategy: PreloadAllModules
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
