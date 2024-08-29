import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DashboardNavComponent } from './components/dashboard-nav/dashboard-nav.component';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { LeftPanelComponent } from './components/left-panel/left-panel.component';
import { HeaderNavComponent } from './components/header-nav/header-nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {MatToolbarModule} from '@angular/material/toolbar';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  declarations: [
    DashboardHeaderComponent,
    DashboardNavComponent,
    LeftPanelComponent,
    HeaderNavComponent,
    FooterComponent,
    
  ],
  imports: [
    CommonModule,
    // MaterialModule,
    MatToolbarModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    DashboardHeaderComponent,
    DashboardNavComponent,
    HeaderNavComponent,
    LeftPanelComponent,
    FooterComponent,
  ]
})
export class SharedModule { }
