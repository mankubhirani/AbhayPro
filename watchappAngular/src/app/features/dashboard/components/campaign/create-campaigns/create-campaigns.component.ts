import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-campaigns',
  templateUrl: './create-campaigns.component.html',
  styleUrls: ['./create-campaigns.component.css']
})
export class CreateCampaignsComponent implements OnInit {

  constructor(
    private router:Router,
  ) { }

  ngOnInit(): void {

  }
  url()
  {
    this.router.navigate['/importContact']  }

}
