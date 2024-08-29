import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ApplicationCheckUpRoutingModule } from './application-check-up-routing.module';
import { ApplicationCheckUpComponent } from './components/application-check-up/application-check-up.component';
import { ApplicationCheckUpMainComponent } from './components/application-check-up-main/application-check-up-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ApplicationCheckUpComponent,
    ApplicationCheckUpMainComponent
  ],
  imports: [
    CommonModule,
    ApplicationCheckUpRoutingModule,
    SharedModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class ApplicationCheckUpModule { }
