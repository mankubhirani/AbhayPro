import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from '../../../../shared/services/shared.service';
import { AccountStatementService } from '../../services/account-statement.service';
import * as moment from 'moment';
import { MembersService } from 'src/app/features/members/services/members.service';
@Component({
  selector: 'app-transfer-statement',
  templateUrl: './transfer-statement.component.html',
  styleUrls: ['./transfer-statement.component.scss']
})
export class TransferStatementComponent implements OnInit {

  isLoading = false;
  transferStatements:any = [];
  fromDate = new Date().toString();
  toDate = new Date().toString();
  currentDate = new Date().toString();
  transferStmtForm : FormGroup
  dateFormat = "yyyy-MM-dd";
  language = "en";
  allMembers: any;
  // currentPage: number = 1;
  // totalPages: number = 0;
  // pageSize:number = 10;
  // limit:number = 50;

  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending

  fileName= 'TransferStatement'+'_'+new Date()+'.xlsx';
  totalAmount: any;

  constructor(
    private _memberService: MembersService,
    private _accountsService:AccountStatementService,
    private _sharedService:SharedService,
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig(){
    this._initForm();
    this.getTransferStatement()
    this._getAllMembers();
  }

  resetForm(){
    this.transferStmtForm.reset();
  }

  _initForm(){
    this.transferStmtForm = new FormGroup({
      fromDate:new FormControl(this.formatFormDate(new Date())),
      toDate:new FormControl(this.formatFormDate(new Date())),
      userId:new FormControl(null)
    })
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }


  getTransferStatement(){
    this.isLoading = true;

    let fromDate = new Date(this.transferStmtForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.transferStmtForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    let payload = {
      fromDate : fromDate,
      toDate : toDate,
      userId:this.transferStmtForm.value.userId
      // pageNo: this.currentPage,
      // limit: this.limit,
    }

    this._accountsService._getTransferStatementApi(payload).subscribe((res:any)=>{
      this.isLoading = false;
      this.transferStatements = res.transferStatement;
      // this.totalPages = Math.ceil(this.transferStatements.length / this.pageSize);

      this.totalAmount = this.transferStatements.reduce((acc, crnt) => acc + crnt.amount, 0);


    });
  }

  // next(): void {
  //   this.currentPage++;
  //   this.getTransferStatement();
  // }

  // prev(): void {
  //   this.currentPage--;
  //   this.getTransferStatement();
  // }

  _getAllMembers() {
    this._memberService._getAllMembers().subscribe((data: any) => {
      if (data.memberData) {
        this.allMembers = data.memberData;
      }
    });
  }
  exportExcel(){
    let transfetStatemnt : any = []
    this.transferStatements.forEach(element => {

      transfetStatemnt.push({
        Date :  moment(element.createdDate).format("MMM D, YYYY, h:mm:ss a"),
        FromUser: element.fromUsername,
        Touser:element.toUsername,
        Amount : element.amount,
        TransactionType:element.isGiven === true? 'Given':'Taken',
        Narration : element.description
      })
    });
    this._sharedService.exportExcel(transfetStatemnt,this.fileName);
    // this._sharedService.exportExcel(this.transferStatements,this.fileName);
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
