import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { UserSettingsMainService } from '../../services/user-settings-main.service';
import {Location} from '@angular/common';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  userConfig:any=[];
  oneClickBetting:boolean=true;
  accountBtn = "Edit";
  editBetting:FormArray;
  editBettingEditStake:FormArray;
  isEditMode = false;
  isEditMode1 = false;
  isLoading = false;
  editOneClickStakeActiveBtn : any;
  userBalance:any;
  creditLimit:any;
  isOneclickBet  : boolean = false;

  constructor(
    private _userSettingsService: UserSettingsMainService,
    private _formBuilder: FormBuilder,
    private _sharedService: SharedService,
    private _location: Location,

    ) { }

    onActivateAll(){
      this.oneClickBetting =! this.oneClickBetting;
    }


  ngOnInit(): void {
    //this.getUserConfig();
    this.isLoading = true;
    this._userSettingsService._getUserConfigApi().subscribe(
      (res:any) => {
        if(res?.userConfig){
          this.userConfig = res;
          this.editBetting=new FormArray(res['userConfig']['editOneClickStakeBtn'].map(_singleValue=>new FormControl(_singleValue)));
          this.editBettingEditStake=new FormArray(res['userConfig']['EditStakesBtn'].map(_singleValue1=>new FormControl(_singleValue1)));
          this.isLoading = false;
          this.editOneClickStakeActiveBtn = res.userConfig.editOneClickStakeActiveBtn;
          this.isOneclickBet = this.userConfig?.userConfig.onClickBettingStatus;

          this._sharedService.isOneclickBetOn = this.userConfig?.userConfig.onClickBettingStatus;

          localStorage.setItem("isOneClickBetOn",this.userConfig?.userConfig.onClickBettingStatus);

        }
      });
      this.getUserBalance()
  }

  getControl(index){
    return this.editBetting.at(index) as FormControl
  }

  getControl1(index){
    return this.editBettingEditStake.at(index) as FormControl
  }

  getUserConfig() {
    this._userSettingsService._getUserConfigApi().subscribe(
      (res:any) => {
        this.userConfig = res  ;
        this._userSettingsService.userConfigSubject.next(res)
        this.editOneClickStakeActiveBtn = res.userConfig.editOneClickStakeActiveBtn;
        this._sharedService.isOneclickBetOn = this.userConfig?.userConfig.onClickBettingStatus;

        localStorage.setItem("isOneClickBetOn",this.userConfig?.userConfig.onClickBettingStatus);

        this._sharedService.betStakeSubject.next({ betStake : this.editOneClickStakeActiveBtn , oneClickBetting: res.userConfig.onClickBettingStatus });

      });
  }

  setOneclickBet(evt){
    this.isOneclickBet = evt.target.checked;

    let saveUser = {
      userConfig:{
        EditStakesBtn:[...this.editBettingEditStake.value],
        onClickBettingStatus: this.isOneclickBet,
        editOneClickStakeBtn:[...this.editBetting.value],
        editOneClickStakeActiveBtn:this.editOneClickStakeActiveBtn
      }
    }
    this._userSettingsService._getSaveUserConfigApi(saveUser).subscribe(
      (res) => {
        this.userConfig = res  ;
        this.getUserConfig();
        this.isEditMode = false;
      });
      // console.log("Settings setOneclickBet save 2",this._sharedService.isOneclickBetOn);
      this._sharedService.getToastPopup("User Settings saved sucessfully",'Settings','success');
  }


  onSubmitSave(){
    let saveUser = {
      userConfig:{
        EditStakesBtn:[...this.editBettingEditStake.value],
        onClickBettingStatus:this.isOneclickBet,
        editOneClickStakeBtn:[...this.editBetting.value],
        editOneClickStakeActiveBtn:this.editOneClickStakeActiveBtn
      }
    }
    this._userSettingsService._getSaveUserConfigApi(saveUser).subscribe(
      (res) => {
        this.userConfig = res  ;
        this.getUserConfig();
        this.isEditMode = false;
      });
      this._sharedService.getToastPopup("User Settings saved sucessfully",'Settings','success');

    }

    goBack(){
      this._location.back();
    }

    getUserBalance(){
      this._sharedService._getBalanceInfoApi().subscribe((res:any)=>{
        this.userBalance = res;
        this._sharedService.userBalance = res.availableCredit;
        this.creditLimit = res.creditLimit
      })
    }

    setOneClickActiveBtn(activeBtn){
      if(this.creditLimit >= activeBtn){
        this.editOneClickStakeActiveBtn = activeBtn;
        this.onSubmitSave();
      }
      // else{
      //   if(!this.isEditMode){
      //   this._sharedService.getToastPopup("Stake is greater than balance available",'Settings','error');
      //   }
      // }
    }
}
