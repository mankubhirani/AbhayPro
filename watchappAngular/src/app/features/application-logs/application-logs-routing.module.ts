import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationLogsMainComponent } from './components/application-logs-main/application-logs-main.component';
import { AutoClearLogDetailsComponent } from './components/auto-clear-log-details/auto-clear-log-details.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { AddAutoClearLogDetailsComponent } from './components/add-auto-clear-log-details/add-auto-clear-log-details.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationLogsMainComponent,
    canActivate: [AuthGuard],

    children: [
      { path: 'auto-clear-log-details', component: AutoClearLogDetailsComponent },
      { path: 'add-auto-clear-log' , component: AddAutoClearLogDetailsComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationLogsRoutingModule { }
