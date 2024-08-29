import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ChnagePasswordMainComponent } from './components/chnage-password-main/chnage-password-main.component';


@NgModule({
  declarations: [
    ChangePasswordComponent,
    ChnagePasswordMainComponent
  ],
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ChangePasswordModule { }
