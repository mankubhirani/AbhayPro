import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './component/registration/registration.component';
import { LoginComponent } from './component/login/login.component';
import { ProfileMainComponent } from './component/profile-main/profile-main.component';
import { NonAuthguardGuard } from 'src/app/auth/auth/non-authguard.guard';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ForgetpasswordComponent } from './component/forgetpassword/forgetpassword.component';
import { OtpFillComponent } from './otp-fill/otp-fill.component';
import { TermsAndConditionsComponent } from './component/terms-and-conditions/terms-and-conditions.component';
const routes: Routes = [{
  path:'',
    component:ProfileMainComponent,
    canActivate: [AuthGuard],
  children:[

    { path: 'login', component: LoginComponent },
    { path: 'signUp', component: RegistrationComponent },
    { path: 'otp', component: OtpFillComponent },
    { path: 'forget', component: ForgetpasswordComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 't&c', component: TermsAndConditionsComponent },
    
  ]

}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
