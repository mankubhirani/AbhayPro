import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IisServerStatusMainComponent } from './components/iis-server-status-main/iis-server-status-main.component';
import { IisServerStatusRoutingModule } from './iis-server-status-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [IisServerStatusMainComponent,
  ],
  imports: [
    CommonModule,
    IisServerStatusRoutingModule,
    SharedModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class IisServerStatusModule { }
