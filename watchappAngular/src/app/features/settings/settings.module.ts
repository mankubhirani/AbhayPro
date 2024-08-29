import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsMainComponent } from './components/settings-main/settings-main.component';
import { UserProfileComponent } from './components/profile/user-profile/user-profile.component';
import { ApplicationMasterComponent } from './components/app-masters/application-master/application-master.component';
import { AddApplicationMasterComponent } from './components/app-masters/add-application-master/add-application-master.component';
import { UserManagementComponent } from './components/user-management/user-management/user-management.component';
import { AddUserComponent } from './components/user-management/add-user/add-user.component';
import { EditUserComponent } from './components/user-management/edit-user/edit-user.component';
import { MapServerComponent } from './components/map-server/map-server/map-server.component';
import { AddMapServerComponent } from './components/map-server/add-map-server/add-map-server.component';
import { EditMapServerComponent } from './components/map-server/edit-map-server/edit-map-server.component';
import { EditApplicationMasterComponent } from './components/app-masters/edit-application-master/edit-application-master.component';
import { AlarmsAndTriggersComponent } from './components/alarms-and-triggers/alarms-and-triggers/AlarmsAndTriggersComponent';
import { AddAlarmsTriggersComponent } from './components/alarms-and-triggers/add-alarms-triggers/add-alarms-triggers.component';
import { EditAlarmsTriggersComponent } from './components/alarms-and-triggers/edit-alarms-triggers/edit-alarms-triggers.component';
import { TaskSchedulerComponent } from './components/task-scheduler/task-scheduler/task-scheduler.component';
import { AddTaskSchedulerComponent } from './components/task-scheduler/add-task-scheduler/add-task-scheduler.component';
import { EditTaskSchedulerComponent } from './components/task-scheduler/edit-task-scheduler/edit-task-scheduler.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SettingsIndexComponent } from './components/settings-index/settings-index.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CompanyDetailsComponent } from './components/company-information/company-details/company-details.component';
import { ApplicationPoolComponent } from '../application-pool/components/application-pool/application-pool/application-pool.component';


@NgModule({
  declarations: [
    SettingsMainComponent,
    UserProfileComponent,
    ApplicationMasterComponent,
    AddApplicationMasterComponent,
    UserManagementComponent,
    AddUserComponent,
    EditUserComponent,
    MapServerComponent,
    AddMapServerComponent,
    EditMapServerComponent,
    EditApplicationMasterComponent,
    AlarmsAndTriggersComponent,
    AddAlarmsTriggersComponent,
    EditAlarmsTriggersComponent,
    TaskSchedulerComponent,
    AddTaskSchedulerComponent,
    EditTaskSchedulerComponent,
    SettingsIndexComponent,
    CompanyDetailsComponent,
    ApplicationPoolComponent
    
  
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularEditorModule,
    SettingsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    FormsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule
  ]
})
export class SettingsModule { }
