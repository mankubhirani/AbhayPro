import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../profile/services/profile.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-application-wise-logs',
  templateUrl: './application-wise-logs.component.html',
  styleUrls: ['./application-wise-logs.component.css']
})
export class ApplicationWiseLogsComponent implements OnInit {

  wiseLogData: any[] = []; 
  pagedItems: any[] = []; 
  userID: any;
  columnVisibility: any = {
    'RowNo': true,
    'App ID': true,
    'App Name': true,
    'App Icon': true,
    'Valid From': true,
    'Valid To': true,
    'Channels': true,
    'Access': true,
    'Status': true,
    'Action': true
  };
  selectAllChecked: boolean = false;
  isDropdownOpen: boolean = false;
  isActionDropdownOpen: boolean = false;
  selectedItem: any = null;

  itemsPerPageOptions = [5, 10, 25, 50, 100];
  itemsPerPage: any = this.itemsPerPageOptions[0];

  constructor(public profileService: ProfileService , public router: Router,) { }

  ngOnInit(): void {
    let userDetail = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.userID = userDetail.userId;
    this.getWiseLogs();
  }

  getWiseLogs() {
    let body = {
      "user_id": this.userID
    };
    this.profileService.getWiseLogs(body).subscribe((res: any) => {
      this.wiseLogData = res['data'];
      // Example of how to paginate data
      this.pagedItems = this.wiseLogData.slice(0, this.itemsPerPage);
    });
  }

  toggleColumnVisibility(column: string) {
    this.columnVisibility[column] = !this.columnVisibility[column];
  }
  newApp(){
    this.router.navigate(['/new-App']);
  }
  toggleSelectAll() {
    this.selectAllChecked = !this.selectAllChecked;
    for (let column in this.columnVisibility) {
      this.columnVisibility[column] = this.selectAllChecked;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleActionDropdown() {
    this.isActionDropdownOpen = !this.isActionDropdownOpen;
  }

  selectItem(item: any) {
    this.selectedItem = item;
  }

  editItem(item: any) {
    console.log('Edit item:', item);
    // Add your edit logic here
  }

  deleteItem(item: any) {
    console.log('Delete item:', item);
    // Add your delete logic here
  }

  pageChanged(event: any) {
    const startIndex = (event.page - 1) * this.itemsPerPage;
    this.pagedItems = this.wiseLogData.slice(startIndex, startIndex + this.itemsPerPage);
  }
}
