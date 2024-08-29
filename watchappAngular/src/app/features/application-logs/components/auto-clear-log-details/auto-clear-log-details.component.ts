import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/features/profile/services/profile.service';
 
@Component({
  selector: 'app-auto-clear-log-details',
  templateUrl: './auto-clear-log-details.component.html',
  styleUrls: ['./auto-clear-log-details.component.css']
})
export class AutoClearLogDetailsComponent implements OnInit {
  p: any;
  selectedOption: string = 'Show';
  user_ID:any;
  isDropdownOpen1 = false;
  getErrorLogsArr: any[] = [];
  getApplications: any[]=[];
  getAutoClearArr: any
  dropdownVisible = false;
  allColumnsSelected = false;



  columnVisibility = {
    logCode: true,
    logDetails: true,
    applicationName: true,
    AppName:true,
    TimeSpanArray:true,
    occurTime: true,
    pageFunction: true,
    getTimeSpanArray:true
  };
 
  constructor(private router: Router, private profileService: ProfileService) {}
 
  ngOnInit(): void {
    const userDetail = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.user_ID = userDetail.userId;
    
    this.getErrorLogs();
    this.getAutoclear()
  }
  
  toggleDropdown(): void {
    this.dropdownVisible = !this.dropdownVisible;
  }
 
  toggleDropdown1(): void {
    this.isDropdownOpen1 = !this.isDropdownOpen1;
  }

  
 
  onAdd(): void {
    this.router.navigate(['add-auto-clear-log']);
  }
 
  edit(): void {
    // Implement edit functionality
  }
 
  delete(): void {
    // Implement delete functionality
  }
 
  getErrorLogs(): void {
    const userDetail = JSON.parse(localStorage.getItem('userDetails') || '{}');
    const body = {
      user_id: userDetail.userId || 1  // Use a default value or handle missing userId
    };
 
    this.profileService.getErrorLogs(body).subscribe(
      (res: any) => {
        this.getErrorLogsArr = res.data || [];
        console.log(this.getErrorLogsArr, 'getErrorLogsArr');
      },
      (error) => {
        console.error('Error fetching logs', error);
      }
    );
  }

  getAutoclear(): void {
    const body = { userId: this.user_ID };
    this.profileService.getAutoClearLog(body).subscribe((res: any) => {
      this. getAutoClearArr = res.data;
    });
  }
 
  toggleColumnVisibility(column: string): void {
    this.columnVisibility[column] = !this.columnVisibility[column];
    this.checkAllColumnsSelected();
  }
 
  selectAllColumns(event: any): void {
    const isSelected = event.target.checked;
    this.allColumnsSelected = isSelected;
 
    for (const column in this.columnVisibility) {
      if (this.columnVisibility.hasOwnProperty(column)) {
        this.columnVisibility[column] = !isSelected;
      }
    }
  }
 
  checkAllColumnsSelected(): void {
    this.allColumnsSelected = Object.values(this.columnVisibility).every(value => !value);
  }
  onSelectionChange(): void {
    // Handle selection change logic
  }
}
 