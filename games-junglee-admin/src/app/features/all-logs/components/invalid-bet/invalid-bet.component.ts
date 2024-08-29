import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { MembersService } from 'src/app/features/members/services/members.service';
import * as moment from 'moment';
@Component({
  selector: 'app-invalid-bet',
  templateUrl: './invalid-bet.component.html',
  styleUrls: ['./invalid-bet.component.scss']
})
export class InvalidBetComponent implements OnInit {

  invalidBetForm: FormGroup;
  dateFormat = "yyyy-MM-dd";
  language = "en";
  allMembers: any;
  logList: any;
  allBets: any = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 0;
  isLoading = false;
  limit:number = 50;

  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending

  fileName= 'InvalidBet.xlsx';

  constructor(
    private _memberService: MembersService,
    private _sharedService:SharedService,
  ) { }

  ngOnInit(): void {
    this._initForm();
    this._getAllMembers();
    this.getLogs();
  }


  _initForm() {
    this.invalidBetForm = new FormGroup({
      memberName: new FormControl(null),
      invalidBet: new FormControl(0),
      fromDate: new FormControl(this.formatFormDate(new Date())),
      toDate: new FormControl(this.formatFormDate(new Date())),
    })
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat, this.language);
  }

  _getAllMembers() {
    this._memberService._getAllMembers().subscribe((data: any) => {
      if (data.memberData) {
        this.allMembers = data.memberData;
      }
    });
  }

  getLogs() {

    let fromDate = new Date(this.invalidBetForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.invalidBetForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    if(this.invalidBetForm.value.memberName == 'null'){
      this.invalidBetForm.patchValue( {'memberName':null} );
    }
    let body = {
      fromDate : fromDate,
      toDate : toDate,
      userId :this.invalidBetForm.value.memberName,
      limit:this.limit,
      pageNo:this.currentPage,
    }
    this.isLoading = true;
    this._memberService._getInvalidBetsApi(body)
      .subscribe((res: any) => {
        if (res) {
          // this.logList = res.data.betList;
          this.isLoading = false;
          this.allBets = res.invalidBetList.finalResult;
          this.totalPages = Math.ceil(res.invalidBetList.totalNoOfRecords / this.pageSize);
        }
      })
  }

  next(): void {
    this.currentPage++;
    this.getLogs();
  }

  prev(): void {
    this.currentPage--;
    this.getLogs();
  }
  clearFilters() {
    // window.location.reload();
    this._initForm();
    // this.invalidBetForm.value.memberName = null;
    // this.invalidBetForm.value.invalidBet = 0;
    // this.invalidBetForm.value.fromDate = this.formatFormDate(new Date());
    // this.invalidBetForm.value.toDate = this.formatFormDate(new Date();
  }

  exportExcel(){
    let allBet : any = []
    this.allBets.forEach(element => {
      allBet.push({
        Member:element.member,
        PlacedDateTime : moment(element.placedTime).format("MMM D, YYYY, h:mm:ss a"),
        Events: element.event,
        Market:element.market,
        Selection : element.selection,
        OrderPlace:element.oddsPlaced,
        Matched:element.isMatched == true? element.stake:'-',
        Unmatched:element.isMatched == false? element.stake:'-',
        Profit_Liability:element.profitLiability,
        Remark:element.remarks
      })
    });
    this._sharedService.exportExcel(allBet,this.fileName);
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
