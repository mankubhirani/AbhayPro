import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationPoolRoutingModule } from './application-pool-routing.module';

import { ApplicationPoolMainComponent } from './components/application-pool-main/application-pool-main/application-pool-main.component';


@NgModule({
  declarations: [

    ApplicationPoolMainComponent
  ],
  imports: [
    CommonModule,
    ApplicationPoolRoutingModule
  ]
})
export class ApplicationPoolModule { }
