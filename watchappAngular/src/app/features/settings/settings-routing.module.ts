import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { SettingsMainComponent } from './components/settings-main/settings-main.component';
import { AlarmsAndTriggersComponent } from './components/alarms-and-triggers/alarms-and-triggers/AlarmsAndTriggersComponent';
import { AddAlarmsTriggersComponent } from './components/alarms-and-triggers/add-alarms-triggers/add-alarms-triggers.component';
import { EditAlarmsTriggersComponent } from './components/alarms-and-triggers/edit-alarms-triggers/edit-alarms-triggers.component';
import { ApplicationMasterComponent } from './components/app-masters/application-master/application-master.component';
import { AddApplicationMasterComponent } from './components/app-masters/add-application-master/add-application-master.component';
import { EditApplicationMasterComponent } from './components/app-masters/edit-application-master/edit-application-master.component';
import { CompanyDetailsComponent } from './components/company-information/company-details/company-details.component';
import { AddMapServerComponent } from './components/map-server/add-map-server/add-map-server.component';
import { MapServerComponent } from './components/map-server/map-server/map-server.component';
import { EditMapServerComponent } from './components/map-server/edit-map-server/edit-map-server.component';
import { UserProfileComponent } from './components/profile/user-profile/user-profile.component';
import { TaskSchedulerComponent } from './components/task-scheduler/task-scheduler/task-scheduler.component';
import { AddTaskSchedulerComponent } from './components/task-scheduler/add-task-scheduler/add-task-scheduler.component';
import { EditTaskSchedulerComponent } from './components/task-scheduler/edit-task-scheduler/edit-task-scheduler.component';
import { UserManagementComponent } from './components/user-management/user-management/user-management.component';
import { AddUserComponent } from './components/user-management/add-user/add-user.component';
import { EditUserComponent } from './components/user-management/edit-user/edit-user.component';
import { SettingsIndexComponent } from './components/settings-index/settings-index.component';
import { ProfileComponent } from '../profile-user/components/profile/profile.component';
import { ApplicationPoolComponent } from '../application-pool/components/application-pool/application-pool/application-pool.component';
import { IisServerStatusComponent } from '../iis-server-status/components/iis-server-status/iis-server-status.component';
import { DatabaseHealthStatusComponent } from '../database-health-status/components/database-health-status/database-health-status.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsMainComponent,
    canActivate: [AuthGuard],

    children: [
      {path: 'settings', component: SettingsIndexComponent},
      { path: 'settings/alarm-triggers', component: AlarmsAndTriggersComponent },
      { path: 'settings/add-alarms-triggers' , component: AddAlarmsTriggersComponent},
      { path: 'settings/edit-alarms-triggers' , component: EditAlarmsTriggersComponent},
      { path: 'settings/application-masters', component: ApplicationMasterComponent },
      { path: 'settings/add-application-masters', component: AddApplicationMasterComponent },
      { path: 'settings/edit-application-masters', component: EditApplicationMasterComponent },
      { path: 'settings/company-information', component: CompanyDetailsComponent },
      { path: 'settings/map-server', component: MapServerComponent},
      { path: 'settings/add-map-server', component: AddMapServerComponent },
      { path: 'settings/edit-map-server', component: EditMapServerComponent },
      { path: 'settings/profile', component: ProfileComponent },
      { path: 'settings/task-scheduler', component: TaskSchedulerComponent  },
      { path: 'settings/add-task-scheduler', component: AddTaskSchedulerComponent },
      { path: 'settings/edit-task-scheduler', component: EditTaskSchedulerComponent },
      { path: 'settings/user-management', component: UserManagementComponent },
      { path: 'settings/add-user', component: AddUserComponent },
      { path: 'settings/edit-user', component: EditUserComponent },
      { path :'settings/Cancel',component:AddAlarmsTriggersComponent},
      {path : 'setting/add', component:AlarmsAndTriggersComponent},
      { path: 'settings/task-scheduler', component: TaskSchedulerComponent  },
      { path: 'settings/add-task-scheduler/:Id', component: AddTaskSchedulerComponent },
      {path : 'settings/Cancel', component:UserManagementComponent},
      {path : 'settings/Save and New', component:UserManagementComponent},
      {path : 'settings/Add', component:UserManagementComponent},
      { path: 'settings/Add', redirectTo: 'settings/user-management/add-user' },

      { path: 'application-pool', component: ApplicationPoolComponent },
      { path: 'iis-server-status', component: IisServerStatusComponent },
      { path: 'database-health-status', component: DatabaseHealthStatusComponent },

      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
