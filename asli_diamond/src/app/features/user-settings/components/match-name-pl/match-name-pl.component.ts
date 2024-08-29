import { Component, OnInit } from '@angular/core';
import { UserSettingsMainService } from '../../services/user-settings-main.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-match-name-pl',
  templateUrl: './match-name-pl.component.html',
  styleUrls: ['./match-name-pl.component.scss']
})
export class MatchNamePlComponent implements OnInit {

  betsPnl :any[] = [];
  currentBet:any = null;
  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending

  constructor(private _userSettingsMainService:UserSettingsMainService,
              private _location: Location) { }

  ngOnInit(): void {
    this.currentBet = this._userSettingsMainService.getPlBets();
    this.betsPnl = this.currentBet.bets;
  }

  goBack(){
    this._location.back();
  }

 toggleSort(columnName: string) {
  if (this.sortColumn === columnName) {
    this.sortAscending = !this.sortAscending;
  } else {
    this.sortColumn = columnName;
    this.sortAscending = true;
  }
}

}
