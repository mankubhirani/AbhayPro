import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { filter } from 'rxjs/operators';
import { UserSettingsMainService } from '../../services/user-settings-main.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-rules-regulations',
  templateUrl: './rules-regulations.component.html',
  styleUrls: ['./rules-regulations.component.scss']
})
export class RulesRegulationsComponent implements OnInit {

  termCond:any;
  previousUrl: string;

  constructor(
    private _userSettingsService: UserSettingsMainService,
    private _sharedservice: SharedService,
    private _location: Location,
  ) {}

  ngOnInit(): void {
    this.getTermCond();
    // this.goToPrevious();
  }

  getTermCond(){
    this._userSettingsService._getTermCondApi().subscribe(
      (res)=>{
        this.termCond = res['termsAndCondition'];
      }
    );
  }

  public goToPrevious()  {
    return this._sharedservice.getPreviousUrl();

    // if(previous != undefined)
    //   this._sharedservice.router.navigateByUrl(previous);

  }

  goBack(){
    this._location.back();
  }

}
