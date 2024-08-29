import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/features/profile/services/profile.service';
 
@Component({
  selector: 'app-application-master',
  templateUrl: './application-master.component.html',
  styleUrls: ['./application-master.component.css']
})
export class ApplicationMasterComponent implements OnInit {
  isColumnViewVisible = false;
  columnsVisibility = [true, true, true, true, true, true, true, true]; // Tracks visibility of each column
  taskGetApplicationArr: any = [];
  userID: any;
  selectedOption: string = 'Show';
  p: any =1;
  itemsPerPage: number=7;
 
  constructor( private profileService: ProfileService,) { }
 
  ngOnInit(): void {
    // Check if all columns are visible initially
    const userDetail = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.userID = userDetail.userId;
    this. GetApplicationset();
    this.updateSelectAllCheckbox();
  }
 
  toggleColumnView(): void {
    this.isColumnViewVisible = !this.isColumnViewVisible;
  }
 
  toggleColumn(index: number): void {
    if (index === 0) {
      // Handle 'Select All' checkbox separately if needed
      for (let i = 1; i < this.columnsVisibility.length; i++) {
        this.columnsVisibility[i] = !this.columnsVisibility[0];
      }
    } else {
      this.columnsVisibility[index] = !this.columnsVisibility[index];
      // Update 'Select All' checkbox based on current visibility state
      this.updateSelectAllCheckbox();
    }
  }
  onSelectionChange(): void {
    // Handle selection change logic
  }
  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(target.value, 10);
  }
 
  toggleAllColumns(event: any): void {
    const isChecked = event.target.checked;
    for (let i = 1; i < this.columnsVisibility.length; i++) {
      this.columnsVisibility[i] = isChecked;
    }
    // Update 'Select All' checkbox state
    this.updateSelectAllCheckbox();
  }
 
  private updateSelectAllCheckbox(): void {
    // Check if all columns are visible
    const allVisible = this.columnsVisibility.slice(1).every(visible => visible);
    // Update 'Select All' checkbox
    this.columnsVisibility[0] = allVisible;
  }

  GetApplicationset(): void {
    const body = { user_Id: this.userID };
    this.profileService.getApplications(body).subscribe((res: any) => {
      this.taskGetApplicationArr= res.data;
    });
  }
}
 
