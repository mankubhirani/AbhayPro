import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.css']
})
export class SegmentComponent implements OnInit {
  segment: any
  constructor(
    private _dashboard: DashboardService,
    private _shared: SharedService,
    private router:Router,
  ) { }


  deleteSegment(Item) {
    let Id = Item.segment_Id
    // console.log(Item.segment_Id)

    this._dashboard._deleteSegmentApi(Id).subscribe((res) => {
      // console.log(JSON.stringify(res));

      this._shared.ToastPopup('deleted Successfully', 'Segment', 'success');
      this._dashboard._getSegmentApi().subscribe((res) => {
        this.segment = res;
        // console.log('segment', this.segment);

      })
      // this.router.navigateByUrl("/reload")

    })
  }

  ngOnInit(): void {

    this._dashboard._getSegmentApi().subscribe((res) => {
      this.segment = res;
      // console.log('segment', this.segment);

    })
  }
}
