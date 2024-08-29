import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-un-subscribe-contacts',
  templateUrl: './un-subscribe-contacts.component.html',
  styleUrls: ['./un-subscribe-contacts.component.css']
})
export class UnSubscribeContactsComponent implements OnInit {

  constructor(
    private _router : Router
  ) { }

  ngOnInit(): void {
  }
  url(){
    this._router.navigate(['/allContact'])
  }

}
