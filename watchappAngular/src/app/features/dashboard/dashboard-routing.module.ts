import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthgaurdGuard } from 'src/app/auth/auth/authgaurd.guard';
// import { AddCompanyComponent } from './components/add-company/add-company.component';
// import { AddSubscriberComponent } from './components/All_Contacts/add-subscriber/add-subscriber.component';
// import { AllContactsComponent } from './components/All_Contacts/all-contacts/all-contacts.component';
// import { ImportContactsComponent } from './components/All_Contacts/import-contacts/import-contacts.component';
// import { ReviewImportComponent } from './components/All_Contacts/review-import/review-import.component';
// import { UnSubscribeContactsComponent } from './components/All_Contacts/un-subscribe-contacts/un-subscribe-contacts.component';
// import { UploadContactComponent } from './components/All_Contacts/upload-contact/upload-contact.component';
// import { ViewContactsComponent } from './components/All_Contacts/view-contacts/view-contacts.component';
// import { AllMailComponent } from './components/campaign/all-mail/all-mail.component';
// import { CampaignsComponent } from './components/campaign/campaigns/campaigns.component';
// import { CompleteMailComponent } from './components/campaign/complete-mail/complete-mail.component';
// import { CreateCampaignsComponent } from './components/campaign/create-campaigns/create-campaigns.component';
// import { DraftMailComponent } from './components/campaign/draft-mail/draft-mail.component';
// import { OngoingMailComponent } from './components/campaign/ongoing-mail/ongoing-mail.component';
// import { ScheduleComponent } from './components/campaign/schedule/schedule.component';

import { DashboardMainComponent } from './components/dashboard-main/dashboard-main.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
// import { EmailTemplateComponent } from './components/email-template/email-template.component';
// import { ProfileComponent } from './components/profile/profile.component';
// import { CreateSegmentComponent } from './components/segment/create-segment/create-segment.component';
// import { SegmentCriteriaComponent } from './components/segment/segment-criteria/segment-criteria.component';
// import { SegmentComponent } from './components/segment/segment/segment.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardMainComponent,
    canActivate: [AuthGuard],

    children: [
      { path: 'dashboard', component: DashboardComponent },
      // { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
      // { path: 'addcompany', component: AddCompanyComponent },
      // {
      //   path: 'campaigns', component: CampaignsComponent,
      //   children: [
      //     { path: '', component: AllMailComponent },
      //     // { path: '**', redirectTo: '/campaigns/all', pathMatch: 'full' },
      //     { path: 'ongoing', component: OngoingMailComponent },
      //     { path: 'draft', component: DraftMailComponent },
      //     { path: 'complete', component: CompleteMailComponent },
      //   ]
      // },
      // { path: 'view', component: ReviewImportComponent },
      // { path: 'campaigns/schedule', component: ScheduleComponent },
      // { path: 'campaigns/create-campaigns', component: CreateCampaignsComponent },
      // { path: 'email-template', component: EmailTemplateComponent },
      // { path: 'segment', component: SegmentComponent },
      // { path: 'segment/createSegment', component: CreateSegmentComponent },
      // { path: 'segmentcriteria', component: SegmentCriteriaComponent },
      // { path: '**', redirectTo: '/segment', pathMatch: 'full' },
      // { path: 'allContact', component: AllContactsComponent },
      // { path: 'campaigns/create-campaigns/importContact', component: ImportContactsComponent },
      // { path: 'allContact/viewContact', component: ViewContactsComponent },
      // { path: 'allContact/unsucscribeContacts', component: UnSubscribeContactsComponent },
      // { path: 'allContact/addSubscribers', component: AddSubscriberComponent },
      // { path: 'allContact/importContact', component: ImportContactsComponent },
      // { path: 'allContact/addSubscribers/importContact', component: ImportContactsComponent },
      // { path: 'allContact/addSubscribers/viewContact', component: ViewContactsComponent },
      // { path: 'allContact/addSubscribers/unsucscribeContacts', component: UnSubscribeContactsComponent },
      // {path:'allContact/addSubscribers/addSubscribers',component: UnSubscribeContactsComponent},
      // { path: 'allContact/unsucscribeContacts/importContact', component: ImportContactsComponent },
      // { path: 'allContact/unsucscribeContacts/viewContact', component: ViewContactsComponent },
      // { path: 'allContact/unsucscribeContacts/addSubscribers', component: UnSubscribeContactsComponent },
      // {path:'allContact/unsucscribeContacts/unsucscribeContacts',component: UnSubscribeContactsComponent},
      // { path: 'allContact/viewContact/importContact', component: ImportContactsComponent },
      // { path: 'allContact/viewContact/unsucscribeContacts', component: ViewContactsComponent },
      // { path: 'allContact/viewContact/addSubscribers', component: UnSubscribeContactsComponent },
      // { path: 'allContact/addSubscribers/importContact/upload', component: UploadContactComponent },
      // { path: 'allContact/importContact/upload', component: UploadContactComponent },
      // { path: 'profile', component: ProfileComponent },

      // { path: 'campaigns', component: CampaignsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
