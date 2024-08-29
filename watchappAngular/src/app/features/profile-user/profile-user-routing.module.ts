import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileMainComponent } from './components/profile-main/profile-main.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: ProfileMainComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
   
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileUserRoutingModule { }
