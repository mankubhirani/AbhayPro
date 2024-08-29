import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/features/profile/services/profile.service';

@Component({
  selector: 'app-alarms-and-triggers',
  templateUrl: './alarms-and-triggers.component.html',
  styleUrls: ['./alarms-and-triggers.component.css']
})
export class AlarmsAndTriggersComponent implements OnInit {
  status: boolean = false;
  AlarmTriggerArr: any = [];
  userID: any;
  p:any=1;
itemsPerPage:number=8;

  constructor(private router: Router, public profileservive: ProfileService) { }

  navigateToSecond() {
    this.router.navigate(["/settings/add-alarms-triggers"]);
  }

  ngOnInit(): void {
    let userDetail = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.userID = userDetail.userId;
    this.getAlarmsAndTriggers();
  }

  columns: { name: string, visible: boolean }[] = [
    { name: 'Select All', visible: true },
    { name: 'RowNo', visible: true },
    { name: 'Description', visible: true },
    { name: 'Key', visible: true },
    { name: 'Type', visible: true },
    { name: 'App Type', visible: true },
    { name: 'Event Definition', visible: true },
    { name: 'Time Stamp', visible: true },
  ];

  showCheckboxes(): void {
    this.status = !this.status;
  }

  updateItemsPerPage(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(target.value, 10);
  }

  toggleColumns(index: number): void {
    if (index === 0) {
      const selectAllStatus = !this.columns[1].visible;
      this.columns.forEach((col, idx) => {
        if (idx !== 0) {
          col.visible = selectAllStatus;
        }
      });
    } else {
      this.columns[index].visible = !this.columns[index].visible;
    }
  }

  getAlarmsAndTriggers() {
    let body = {
      "userId": this.userID
    }
    this.profileservive.getAlarmsAndTriggers(body).subscribe((res: any) => {
      console.log("ser", res.data)
      this.AlarmTriggerArr = res.data;
    })
  }
}
