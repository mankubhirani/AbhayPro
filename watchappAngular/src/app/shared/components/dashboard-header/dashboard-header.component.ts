import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css']
})
export class DashboardHeaderComponent implements OnInit {
  showRightSidebar: boolean = true;
  isLoggedIn:boolean = false;
  isShowRightSideBar:boolean = false;
  isExpanded = true;
  
  constructor() { }

  ngOnInit(): void {
    
  }
 
  onClickPanel() {
    this.isExpanded = !this.isExpanded;
  }

  getRightSidebarEvent(eventObj){
    this.isShowRightSideBar = !eventObj['isClose'];
  }

 
}
