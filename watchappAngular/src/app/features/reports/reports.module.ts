import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileSummaryReportComponent } from './file-summary-report/file-summary-report.component';
import { ApplicationWiseLogsComponent } from './application-wise-logs/application-wise-logs.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddApplicationWiseLogsComponent } from './add-application-wise-logs/add-application-wise-logs.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AngularEditorModule } from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    FileSummaryReportComponent,
    ApplicationWiseLogsComponent,
    AddApplicationWiseLogsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    NgxPaginationModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    AngularEditorModule,
    ReactiveFormsModule
    
    
  ]
})
export class ReportsModule { }
