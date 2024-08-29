import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Constants } from './config/constant';
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileModule } from './features/profile/profile.module';
import { ToastrModule } from 'ngx-toastr';
// import { LoaderModule } from './shared/loader/loader.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SharedModule } from './shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServerInterceptor } from './core/interceptors/server.interceptor';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ReportsMainComponent } from './features/reports/reports-main/reports-main.component';
import { ReportsModule } from './features/reports/reports.module';
//  import { ApplicationCheckUpComponent } from './features/application-check-up/application-check-up.component';
//  import { ServiceComponent } from './features/application-check-up/service/service.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ImportContactsComponent } from './features/dashboard/components/All_Contacts/import-contacts/import-contacts.component';
import {AddApplicationMasterComponent} from '../app/features/settings/components/app-masters/add-application-master/add-application-master.component';
import { IisServerStatusComponent } from './features/iis-server-status/components/iis-server-status/iis-server-status.component';
import { IisServerStatusMainComponent } from './features/iis-server-status/components/iis-server-status-main/iis-server-status-main.component';
import { IisServerStatusRoutingModule } from './features/iis-server-status/iis-server-status-routing.module';
import { DatabaseHealthStatusComponent } from './features/database-health-status/components/database-health-status/database-health-status.component';
import { DatabaseHealthStatusMainComponent } from './features/database-health-status/components/database-health-status-main/database-health-status-main.component';
import { DatabaseHealthStatusRoutingModule } from './features/database-health-status/database-health-status-routing.module';
import { DatabaseHealthStatusModule } from './features/database-health-status/database-health-status.module'
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    AppComponent,
    ReportsMainComponent,
    ReportsMainComponent,
    
    IisServerStatusComponent,
         DatabaseHealthStatusComponent,
         DatabaseHealthStatusMainComponent,
    
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    // LoaderModule,
    NgxPaginationModule,
    NgxUiLoaderModule,
    ReactiveFormsModule,
    ProfileModule,
    SharedModule,
    MatIconModule,
    CoreModule,
    NgMultiSelectDropDownModule.forRoot(),
     AngularEditorModule,
     FormsModule,
     HttpClientModule,
     IisServerStatusRoutingModule,
     DatabaseHealthStatusRoutingModule,
     DatabaseHealthStatusModule
  ],
  providers: [Constants, DatePipe,
    {
      provide: HTTP_INTERCEPTORS, useClass: ServerInterceptor, multi: true,
    },
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],

 
  bootstrap: [AppComponent]
})
export class AppModule { }
