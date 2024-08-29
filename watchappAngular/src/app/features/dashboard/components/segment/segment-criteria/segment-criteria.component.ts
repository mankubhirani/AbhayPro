import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-segment-criteria',
  templateUrl: './segment-criteria.component.html',
  styleUrls: ['./segment-criteria.component.css']
})
export class SegmentCriteriaComponent implements OnInit {

  constructor(
    private router: Router,

  ) { }

  ngOnInit(): void {
  }
  url(){
    this.router.navigateByUrl('/segment')
  }
}
