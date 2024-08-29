import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskSchedulerMainComponent } from './components/task-scheduler-main/task-scheduler-main.component';
import { TaskSchedulerDetailsComponent } from './components/task-scheduler-details/task-scheduler-details.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: TaskSchedulerMainComponent,
    canActivate: [AuthGuard],

    children: [
      { path: 'task-scheduler', component: TaskSchedulerDetailsComponent },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskSchedulerRoutingModule { }
