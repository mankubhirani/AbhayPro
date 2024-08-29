import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileUserRoutingModule } from './profile-user-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileMainComponent } from './components/profile-main/profile-main.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardRoutingModule } from '../dashboard/dashboard-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ProfileComponent,
    ProfileMainComponent
  ],
  imports: [
    CommonModule,
    ProfileUserRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatIconModule,
    NgxPaginationModule,
  ]
})
export class ProfileUserModule { }
