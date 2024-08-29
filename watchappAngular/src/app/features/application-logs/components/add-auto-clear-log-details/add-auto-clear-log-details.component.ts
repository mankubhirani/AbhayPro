import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/features/profile/services/profile.service';

@Component({
  selector: 'app-add-auto-clear-log-details',
  templateUrl: './add-auto-clear-log-details.component.html',
  styleUrls: ['./add-auto-clear-log-details.component.css']
})
export class AddAutoClearLogDetailsComponent {

  getApplications:any=[];   
  userID:any;
  public settings = {};
  public TimeSpan = {};
  public selectedItems = [];
  getTimeSpanArray:any=[];
  addAutoClearLogArr:any=[];
//------
  constructor(private router:Router,
    public _profileService:ProfileService,
  ){}
  //--------------

  onset(){
    this.router.navigate(['auto-clear-log-details'])
  }

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  //--------------------

  ngOnInit(): void {
    this.settings = {
      singleSelection: false,
      idField: 'applicationId',
      textField: 'applicationName',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Tìm kiếm',
      noDataAvailablePlaceholderText: 'No data Available',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.TimeSpan = {
      singleSelection: false,
      idField: 'TimespanId',
      textField: 'TimeSpanName',
      enableCheckAll: true,
      limitSelection: -1,
      maxHeight: 197,
      itemsShowLimit: 3,
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

//Json Call --Api in local storage
    let userDetail = JSON.parse(localStorage.getItem('userDetails')|| '{}');
    this.userID=userDetail.userId

    this.getErrorLogs();
    this.getTimespan();


  }
//--getErrorLogbody
  getErrorLogs(){

    let body = {
      "user_id":  this.userID
  }
    this._profileService.getApplications(body).subscribe((res: any) => {
      console.log("ser",res.data)
      this.getApplications = res.data;
      })
  }
  //---TimeSpan-----
  getTimespan(){

    let body = {
      
  }

    this._profileService.getTimespan(body).subscribe((res: any) => {
      console.log("ser",res.data)
      this. getTimeSpanArray = res.data;
      })
  }
  //---addAutoClearLog
  addAutoClearLog(){
    let body = {
      "userId": 1,
      "applicationId": 1000000000000001,
      "scheduleOn": 1
    }
  
      this._profileService.addAutoClearLog(body).subscribe((res: any) => {
        console.log("ser",res.data)
        this.addAutoClearLogArr = res.data;
        })
  }

  //---MultidropDown
  public onFilterChange(item: any) {
    console.log(item);
  }
  public onDropDownClose(item: any) {
    console.log(item);
  }
  
  public onItemSelect(item: any) {
    console.log(item);
  }
  public onDeSelect(item: any) {
    console.log(item);
  }
  
  public onSelectAll(items: any) {
    console.log(items);
  }
  public onDeSelectAll(items: any) {
    console.log(items);
  }
  
  
}
