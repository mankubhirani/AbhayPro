import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsMainComponent } from './reports-main/reports-main.component';
import { ReportsIndexComponent } from './reports-index/reports-index.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { FileSummaryReportComponent } from './file-summary-report/file-summary-report.component';
import { ApplicationWiseLogsComponent } from './application-wise-logs/application-wise-logs.component';
import { AddApplicationWiseLogsComponent } from './add-application-wise-logs/add-application-wise-logs.component';

const routes: Routes = [{
  path: '',
  component: ReportsMainComponent,
  canActivate: [AuthGuard],

  children: [
    { path: 'reports', component: ReportsIndexComponent },
    { path: 'file-summary-report', component: FileSummaryReportComponent },
    { path: 'application-wise-logs', component: ApplicationWiseLogsComponent },
    {path:'new-App', component:AddApplicationWiseLogsComponent},
    {path:'cancel', component:ApplicationWiseLogsComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
