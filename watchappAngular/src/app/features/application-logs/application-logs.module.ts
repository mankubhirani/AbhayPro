import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationLogsRoutingModule } from './application-logs-routing.module';
import { ApplicationLogsMainComponent } from './components/application-logs-main/application-logs-main.component';
import { AutoClearLogDetailsComponent } from './components/auto-clear-log-details/auto-clear-log-details.component';
import { AddAutoClearLogDetailsComponent } from './components/add-auto-clear-log-details/add-auto-clear-log-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ApplicationLogsMainComponent,
    AutoClearLogDetailsComponent,
    AddAutoClearLogDetailsComponent
  ],
  imports: [
    CommonModule,
    ApplicationLogsRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule,
    NgxPaginationModule,
    HttpClientModule,
    FormsModule

  ]
})
export class ApplicationLogsModule { }
