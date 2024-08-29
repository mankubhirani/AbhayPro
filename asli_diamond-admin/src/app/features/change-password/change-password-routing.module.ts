import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { ChnagePasswordMainComponent } from './components/chnage-password-main/chnage-password-main.component';

const routes: Routes = [
  // {path:'change-password',component:ChangePasswordComponent}
  {
    path: 'admin', component: ChnagePasswordMainComponent,
    children: [
      {path:'change-password',component:ChangePasswordComponent},
    ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChangePasswordRoutingModule { }
