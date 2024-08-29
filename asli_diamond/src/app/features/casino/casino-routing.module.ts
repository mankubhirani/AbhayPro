import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CasinoMainComponent } from './components/casino-main/casino-main.component';
import { CasinoListComponent } from './components/casino-list/casino-list.component';
import { CasinoPlayComponent } from './components/casino-play/casino-play.component';

const routes: Routes = [
  {
    path:'',
    component: CasinoMainComponent,
    children:[
      {path:'casino', component:CasinoListComponent},
      {path:'casino-play', component:CasinoPlayComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CasinoRoutingModule {

  

 }
