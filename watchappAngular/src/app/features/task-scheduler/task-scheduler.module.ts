import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskSchedulerRoutingModule } from './task-scheduler-routing.module';
import { TaskSchedulerDetailsComponent } from './components/task-scheduler-details/task-scheduler-details.component';
import { TaskSchedulerMainComponent } from './components/task-scheduler-main/task-scheduler-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    TaskSchedulerDetailsComponent,
    TaskSchedulerMainComponent
  ],
  imports: [
    CommonModule,
    TaskSchedulerRoutingModule,
    SharedModule,
    NgxPaginationModule,
    FormsModule
    
    

  ]
})
export class TaskSchedulerModule { }
