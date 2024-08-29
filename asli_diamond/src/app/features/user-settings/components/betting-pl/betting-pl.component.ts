import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserSettingsMainService } from '../../services/user-settings-main.service';
import * as moment from 'moment';
import {Location} from '@angular/common';
import { SharedService } from '@shared/services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-betting-pl',
  templateUrl: './betting-pl.component.html',
  styleUrls: ['./betting-pl.component.scss']
})
export class BettingPlComponent implements OnInit, AfterViewInit {
  profitLoss : any[] = [];
  isLoading = false;
  allSports: any;
  bettingPnLForm:FormGroup;


  options:any = {
    autoApply:false,
    clickOutsideAllowed:false,
    // displayFormat?: string;
    disabled:true,
    // disableInputDisplay:true;
    format: 'DD MMM YYYY',
    // icons?: 'default' | 'material' | 'font-awesome';
    // minDate: new Date().toJSON().slice(0,10).replace(/-/g,'/')
    // maxDate:;
    // position?: 'left' | 'right';
    // preDefinedRanges?: IDefinedDateRange[];
    // showResetButton?: boolean;
    // singleCalendar : true
    // validators?: ValidatorFn | ValidatorFn[];
    // modal?: boolean;
  };
  fromDate = moment().subtract(1, 'months').format("YYYY-MM-DD");
  toDate = moment().format("YYYY-MM-DD");

  toDateInit = moment().format("DD MMM YYYY")
  fromDateInit = moment(this.toDateInit).subtract(1, 'months').format("DD MMM YYYY")
  @ViewChild('dateRangePicker') dateRangePicker:ElementRef;
  preDefineDateRange = this.fromDateInit +' - '+ this.toDateInit;

  fileName= 'BettingPL.xlsx';

  constructor(
    private _sharedService: SharedService,
    private _userSettingsService: UserSettingsMainService,
    private _location: Location,
    private cdr: ChangeDetectorRef,
    private _fb: FormBuilder,
  ) { }

  ngAfterViewInit(){
    this.dateRangePicker['range'] = this.preDefineDateRange  //"13 Apr 2023 - 17 Apr 2023"
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.getSports();
    this.createBettingPnLForm();
    this.getProfitLoss(this.fromDate,this.toDate);
  }

  createBettingPnLForm() {
    this.bettingPnLForm = this._fb.group({
      sportId: [4, [Validators.required]],
      search:''
    })
  }

  exportExcel(){
     this._sharedService.exportExcel(this.profitLoss,this.fileName);
  }

  getProfitLoss(fromDate,toDate){
    this.isLoading = true;
    let profitLossObj = {
      fromDate:moment(fromDate).format("YYYY-MM-DD HH:mm:ss"),
      toDate:moment(toDate).set({hour:23,minute:59,second:59}).format("YYYY-MM-DD HH:mm:ss"),
      sportId: parseInt(this.bettingPnLForm.value.sportId)
    };
    this._userSettingsService._getProfitLossApi(profitLossObj).subscribe(
      (res:any) => {
       this.profitLoss = res.profitLoss;
       var i = 0;
       this.profitLoss.forEach(x => {
         this.profitLoss[i].settledDate= moment(x.settledDate).format("YYYY-MM-DD HH:mm:ss"),
         i++;
       });
       this.isLoading = false;
      }
    );
  }

  rangeSelected(event){
    this.fromDate = event.start._d
    this.toDate = event.end._d
  }

  setPlBet(bets){
    this._userSettingsService.setPlBets(bets)
  }

  getProfitAndLoss(){
    this.getProfitLoss(this.fromDate,this.toDate);
  }

  goBack(){
    this._location.back();
  }

  getSports() {
    this._sharedService._getSportsListApi().subscribe((res: any) => {
      this.allSports = res;
    });
  } 

}
