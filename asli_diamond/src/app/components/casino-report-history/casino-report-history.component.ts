import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-casino-report-history',
  templateUrl: './casino-report-history.component.html',
  styleUrls: ['./casino-report-history.component.scss']
})
export class CasinoReportHistoryComponent implements OnInit {

  constructor(    private _location: Location,
  ) { }

  ngOnInit(): void {
  }
  goBack(){
    this._location.back();
  }

}
