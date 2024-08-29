import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-all-contacts',
  templateUrl: './all-contacts.component.html',
  styleUrls: ['./all-contacts.component.css']
})
export class AllContactsComponent implements OnInit {
getAllContact:any;
length:any
  constructor(
    private _shared: SharedService,
    private _dashboard: DashboardService
  ) { }

  ngOnInit(): void {

    this._dashboard._getAllContactApi().subscribe((res) => {
      // console.log(" GET Data ", res);
      this.getAllContact=res;

    })
  }

}
