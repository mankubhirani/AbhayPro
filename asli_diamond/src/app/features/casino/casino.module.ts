import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CasinoRoutingModule } from './casino-routing.module';
import { CasinoMainComponent } from './components/casino-main/casino-main.component';
import { CasinoListComponent } from './components/casino-list/casino-list.component';
import { CasinoPlayComponent } from './components/casino-play/casino-play.component';
import { SharedModule } from '@shared/shared.module';
import { CasinoLeftMenuComponent } from './components/casino-left-menu/casino-left-menu.component';
import { CasinoRightMenuComponent } from './components/casino-right-menu/casino-right-menu.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CasinoMainComponent,
    CasinoListComponent,
    CasinoPlayComponent,
    CasinoLeftMenuComponent,
    CasinoRightMenuComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    CasinoRoutingModule
  ]
})
export class CasinoModule { }
