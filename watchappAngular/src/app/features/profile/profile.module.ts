import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { LoginComponent } from './component/login/login.component';
import { RegistrationComponent } from './component/registration/registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileMainComponent } from './component/profile-main/profile-main.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ForgetpasswordComponent } from './component/forgetpassword/forgetpassword.component';
import { OtpFillComponent } from './otp-fill/otp-fill.component';
import { TermsAndConditionsComponent } from './component/terms-and-conditions/terms-and-conditions.component';


// import { CountrySelectorComponent } from './country-selector/country-selector.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    ProfileMainComponent,
    ForgetpasswordComponent,
    OtpFillComponent,
    TermsAndConditionsComponent
  ],
  imports: [
    MatCheckboxModule,
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ToastrModule.forRoot(),
    

  ]
})
export class ProfileModule { }
