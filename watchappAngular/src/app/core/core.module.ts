import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiHttpService } from './services/api-http.service';
import { HttpClientModule } from '@angular/common/http';
import { ApiEndpointsService } from './services/api-endpoints.service';



@NgModule({
  declarations: [],
  providers:[
   ApiHttpService,
   ApiEndpointsService
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ]
})
export class CoreModule { }
