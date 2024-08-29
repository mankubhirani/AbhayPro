import { Component, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ProfileService } from 'src/app/features/profile/services/profile.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-task-scheduler',
  templateUrl: './task-scheduler.component.html',
  styleUrls: ['./task-scheduler.component.css']
})
export class TaskSchedulerComponent implements OnInit {
  columnVisibility = {
    taskSchedulerName: true,
    validFrom: true,
    validTo: true,
    server: true,
    application: true,
    status: true,
    action: true
  };

  p: any =1;
  selectedOption: string = 'Show';
  taskGetSchedulerArr: any = [];
  userID: any;
  deleteTaskScheduled: any[] = [];
  status: boolean = false;
  selectAllChecked: boolean = true; // Initialize select all checkbox state

  @ViewChildren('checkbox') checkboxes!: QueryList<any>;
itemsPerPage:number=7;

  constructor(
    private profileService: ProfileService,
    private sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const userDetail = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.userID = userDetail.userId;
    this.taskGetScheduler();
  }

  toggleDropdown(): void {
    this.status = !this.status;
  }

  toggleAllCheckboxes(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checkboxes.forEach(checkbox => checkbox.nativeElement.checked = isChecked);
  }

  taskGetScheduler(): void {
    const body = { userId: this.userID };
    this.profileService.getTaskScheduled(body).subscribe((res: any) => {
      this.taskGetSchedulerArr = res.data;
    });
  }

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(target.value, 10);
  }

  onActionChange(action: string, id: any): void {
    switch (action) {
      case 'Edit':
        this.editItem(id);
        break;
      case 'Delete':
        this.deleteItem(id);
        break;
      // Add other cases as needed
      default:
        console.log(`Action ${action} is not implemented.`);
    }
  }

  editItem(id: string): void {
    // Implement edit logic here
  }

  deleteItem(id: string): void {
    const ida = { tsd_id: id };
    this.profileService.deleteTaskScheduled(ida).subscribe((res: any) => {
      // Handle delete response
      console.log(res);
    });
  }

  onSelectionChange(): void {
    // Handle selection change logic
  }

  toggleColumn(column: string): void {
    this.columnVisibility[column] = !this.columnVisibility[column];
    this.updateSelectAllCheckboxState();
  }

  toggleAllColumns(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.checkboxes.forEach(checkbox => checkbox.nativeElement.checked = isChecked);
    this.updateColumnVisibility(isChecked);
  }

  updateColumnVisibility(isChecked: boolean): void {
    for (const key in this.columnVisibility) {
      if (Object.prototype.hasOwnProperty.call(this.columnVisibility, key)) {
        this.columnVisibility[key] = isChecked;
      }
    }
  }

  updateSelectAllCheckboxState(): void {
    const allChecked = this.checkboxes.toArray().every(checkbox => checkbox.nativeElement.checked);
    this.selectAllChecked = allChecked;
  }
}
