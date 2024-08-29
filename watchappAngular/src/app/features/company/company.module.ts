import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyRoutingModule } from './company-routing.module';
import { AddCompanyComponent } from './components/add-company/add-company.component';
import { CompanyMainComponent } from './components/company-main/company-main.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardRoutingModule } from '../dashboard/dashboard-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { EditCompanyComponent } from './components/edit-company/edit-company.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AddCompanyComponent,
    CompanyMainComponent,
    EditCompanyComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
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
export class CompanyModule { }
