import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardMainComponent } from './components/dashboard-main/dashboard-main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { MatSidenavModule } from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CampaignsComponent } from './components/campaign/campaigns/campaigns.component';
import {MatTabsModule} from '@angular/material/tabs';
import { SegmentComponent } from './components/segment/segment/segment.component';
import { CreateSegmentComponent } from './components/segment/create-segment/create-segment.component';
import { AllContactsComponent } from './components/All_Contacts/all-contacts/all-contacts.component';
// import {MatMenuModule} from '@angular/material/menu';
import { AddSubscriberComponent } from './components/All_Contacts/add-subscriber/add-subscriber.component';
import { ImportContactsComponent } from './components/All_Contacts/import-contacts/import-contacts.component';
import { ViewContactsComponent } from './components/All_Contacts/view-contacts/view-contacts.component';
import { UnSubscribeContactsComponent } from './components/All_Contacts/un-subscribe-contacts/un-subscribe-contacts.component';
import { UploadContactComponent } from './components/All_Contacts/upload-contact/upload-contact.component';
import { SegmentCriteriaComponent } from './components/segment/segment-criteria/segment-criteria.component';
import { CreateCampaignsComponent } from './components/campaign/create-campaigns/create-campaigns.component';
// import { ProfileComponent } from './components/profile/profile.component';
// import { EmailTemplateComponent } from './components/email-template/email-template.component';
import { AllMailComponent } from './components/campaign/all-mail/all-mail.component';
import { OngoingMailComponent } from './components/campaign/ongoing-mail/ongoing-mail.component';
import { DraftMailComponent } from './components/campaign/draft-mail/draft-mail.component';
import { CompleteMailComponent } from './components/campaign/complete-mail/complete-mail.component';
import { ScheduleComponent } from './components/campaign/schedule/schedule.component';
import { ReviewImportComponent } from './components/All_Contacts/review-import/review-import.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    DashboardMainComponent,
    DashboardComponent,
 
    CampaignsComponent,
    SegmentComponent,
    CreateSegmentComponent,
    AllContactsComponent,
    AddSubscriberComponent,
    ImportContactsComponent,
    ViewContactsComponent,
    UnSubscribeContactsComponent,
    UploadContactComponent,
    SegmentCriteriaComponent,
    CreateCampaignsComponent,
    // ProfileComponent,
    // EmailTemplateComponent,
    AllMailComponent,
    OngoingMailComponent,
    DraftMailComponent,
    CompleteMailComponent,
    ScheduleComponent,
    ReviewImportComponent,

  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatIconModule,
    FormsModule, 
    ReactiveFormsModule,
    NgxPaginationModule,
  ]
})
export class DashboardModule { }
