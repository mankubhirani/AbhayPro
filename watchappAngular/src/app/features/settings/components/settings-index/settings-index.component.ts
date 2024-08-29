import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-settings-index',
  templateUrl: './settings-index.component.html',
  styleUrls: ['./settings-index.component.css']
})
export class SettingsIndexComponent implements OnInit {

  constructor(private router:Router){}

  navigateToFirst() {
    
    this.router.navigate(["/settings/alarm-triggers"]);
  }

  ngOnInit(): void {
  }

}
