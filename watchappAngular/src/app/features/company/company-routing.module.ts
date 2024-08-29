import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

import { AddCompanyComponent } from './components/add-company/add-company.component';
import { CompanyMainComponent } from './components/company-main/company-main.component';
import { EditCompanyComponent } from './components/edit-company/edit-company.component';
// import { AuthgaurdGuard } from 'src/app/auth/auth/authgaurd.guard';

const routes: Routes = [
 
  {
    path: '',
    canActivate: [AuthGuard],
    component: CompanyMainComponent,
    children: [
      { path: 'addcompany', component: AddCompanyComponent },
      { path: 'editcompany', component: EditCompanyComponent },
   
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
