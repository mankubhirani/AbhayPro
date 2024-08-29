import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationCheckUpMainComponent } from './components/application-check-up-main/application-check-up-main.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ApplicationCheckUpComponent } from './components/application-check-up/application-check-up.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationCheckUpMainComponent,
    canActivate: [AuthGuard],

    children: [
      { path: 'application-check-up', component: ApplicationCheckUpComponent },
  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationCheckUpRoutingModule { }


