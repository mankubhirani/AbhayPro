import { Component, OnInit } from '@angular/core';
import { UserSettingsMainService } from '../../services/user-settings-main.service';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-profit-loss',
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.scss']
})

export class ProfitLossComponent implements OnInit {
  betsPnl: any[] = [];
  currentBet:any = null;
  userDetails:any = null;
  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending

  constructor(private _userSettingsMainService: UserSettingsMainService,
    private sharedService:SharedService,
    private _location: Location,
    private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.userDetails = this.sharedService.getUserDetails();
    console.log(this.userDetails)

    var marketId = this.route.snapshot.paramMap.get('marketId')?.toString();
    var obj = { marketId: marketId }
    this._userSettingsMainService._getBetHistoryForUserAccountStatementApi(obj).subscribe(
      (res: any) => {
        this.currentBet = res.betHistoryList;
        this.betsPnl = res.betHistoryList.bets;
      });

    //this.currentBet = this._userSettingsMainService.getPlBets();
    //this.betsPnl = this.currentBet.bets;

    console.log(this.userDetails)
  }

  goBack() {
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