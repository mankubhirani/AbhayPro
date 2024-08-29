import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserSettingsMainService } from '../../services/user-settings-main.service';
import * as moment from 'moment';
import {Location} from '@angular/common';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-transfer-statement',
  templateUrl: './transfer-statement.component.html',
  styleUrls: ['./transfer-statement.component.scss']
})
export class TransferStatementComponent implements OnInit {
  tranState: any;
  isLoading = false;
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

  fileName= 'TransferStatement.xlsx';

  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending

  constructor(
    private _userSettingsService: UserSettingsMainService,
    private cdr: ChangeDetectorRef,
    private _location: Location,
    private _sharedService: SharedService,
  ) { }

  ngAfterViewInit(){
    this.dateRangePicker['range'] = this.preDefineDateRange  //"13 Apr 2023 - 17 Apr 2023"
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    this.getTransferStatement(this.fromDate,this.toDate);
  }

  getTransferStatement(fromDate,toDate) {
    this.isLoading = true;
    let transStateObj = {
      fromDate:moment(fromDate).format("YYYY-MM-DD HH:mm:ss"),
      toDate:moment(toDate).set({hour:23,minute:59,second:59}).format("YYYY-MM-DD HH:mm:ss"),
    };
    this._userSettingsService._getTransferStatementApi(transStateObj).subscribe(
      (res) => {
        this.tranState = res;
        var i = 0;
        this.tranState.forEach(x => {
          this.tranState[i].createdDate = moment(x.createdDate).format("YYYY-MM-DD HH:mm:ss"),
          i++;
        });
        this.isLoading = false;
      }
    )
  }

  rangeSelected(event){
    this.fromDate = event.start._d
    this.toDate = event.end._d
  }

  getTransferStatment(){
    this.getTransferStatement(this.fromDate,this.toDate);
  }

  goBack(){
    this._location.back();
  }

  exportExcel(){
    this._sharedService.exportExcel(this.tranState,this.fileName);
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
