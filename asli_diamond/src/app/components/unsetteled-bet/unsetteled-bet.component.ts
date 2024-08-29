import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';


@Component({
  selector: 'app-unsetteled-bet',
  templateUrl: './unsetteled-bet.component.html',
  styleUrls: ['./unsetteled-bet.component.scss']
})
export class UnsetteledBetComponent implements OnInit {

  constructor(    private _location: Location,
  ) { }

  ngOnInit(): void {
  }
  goBack(){
    this._location.back();
  }

}
