import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/features/profile/services/profile.service';  // Adjust path as per your file structure
 
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  UserDetailListArr : any = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  itemsPerPage: number = 5; 
  currentPage: number = 1;
  Admin_ID: any;
  dropdownVisible: boolean = false;
  isDropdownOpen1: boolean = false;
 
  columns: any[] = [
    { field: 'userName', label: 'User Name', visible: true },
    { field: 'mobileNo', label: 'Mobile No', visible: true },
    { field: 'roleType', label: 'Role Type', visible: true },
    { field: 'access', label: 'Access', visible: true },
    { field: 'email', label: 'Email ID', visible: true },
    { field: 'addTarget', label: 'Add Targets', visible: true },
    { field: 'reportingManager', label: 'Reporting Manager', visible: true },
    { field: 'action', label: 'Action', visible: true }
  ];
 
  columnsVisible: { [key: string]: boolean } = {};
  p: number = 1;
 
  constructor(private profileService: ProfileService) {}
 
  ngOnInit() {
    this.loadUsers();
    this.columns.forEach(column => {
      this.columnsVisible[column.field] = column.visible;
    });
  }
 
  loadUsers() {
    const userDetail = JSON.parse(localStorage.getItem('userDetails') || '{}');
    let body = {
      "Admin_id": userDetail.Admin_ID || 1  // Use a default value or handle missing userId
    };
 
    this.profileService.getUserList(body).subscribe(
      (res: any) => {
        this.UserDetailListArr= res.data;
        this.users = res.data || [];
        this.filteredUsers = [...this.users];
        console.log(this.users, 'users');
      },
      (error) => {
        console.error('Error fetching user list', error);
      }
    );
  }
 
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
 
  toggleDropdown1() {
    this.isDropdownOpen1 = !this.isDropdownOpen1;
  }
 
  toggleColumn(columnField: string) {
    this.columns.forEach(column => {
      if (column.field === columnField) {
        column.visible = !column.visible;
        this.columnsVisible[column.field] = column.visible;
      }
    });
  }
 
  hideColumnViewDropdown() {
    this.dropdownVisible = false;
  }
 
  onSearchChange(searchTerm: string) {
    this.searchTerm = searchTerm.trim().toLowerCase();
    this.filterUsers();
  }
 
  filterUsers() {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
    } else {
      this.filteredUsers = this.users.filter(user =>
        Object.values(user).some(val =>
          String(val).toLowerCase().includes(this.searchTerm)
        )
      );
    }
  }
 
  selectAllColumns(event: any) {
    const checked = event.target.checked;
    this.columns.forEach(column => {
      column.visible = checked;
      this.columnsVisible[column.field] = checked;
    });
  }
 
  onItemsPerPageChange(event: any) {
    this.itemsPerPage = event;
    this.currentPage = 1;  // Reset to the first page
    this.filterUsers();
  }
 
  onPageChange(event: any) {
    this.currentPage = event;
    this.filterUsers();
  }
 
  edit() {
    // Implement edit functionality
  }
 
  delete() {
    // Implement delete functionality
  }
}