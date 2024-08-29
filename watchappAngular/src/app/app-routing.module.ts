import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/profile/component/login/login.component';

const routes: Routes = [
  {path:'login',component:LoginComponent},

  {
    path: '',
    loadChildren: () => import('./features/profile/profile.module').then((m) => m.ProfileModule)
  },

  {
    path: '',
    loadChildren: () => import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule)
    
  },

  {
    path: '',
    loadChildren: () => import('./features/company/company.module').then((m) => m.CompanyModule)  
  },

  {
    path: '',
    loadChildren: () => import('./features/profile-user/profile-user.module').then((m) => m.ProfileUserModule)  
  },

  {
    path: '',
    loadChildren: () => import('./features/task-scheduler/task-scheduler.module').then((m) => m.TaskSchedulerModule)  
  },

  { 
    path: '',
    loadChildren: () => import('./features/application-logs/application-logs.module').then((m) => m.ApplicationLogsModule)  
  },
  {
    path: '',
    loadChildren: () => import('./features/reports/reports.module').then((m) => m.ReportsModule)  
  },
  {
    path: '',
    loadChildren: () => import('./features/settings/settings.module').then((m) => m.SettingsModule)  
  },
  {
    path: '',
    loadChildren: () => import('./features/application-check-up/application-check-up.module').then((m) => m.ApplicationCheckUpModule)  
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
