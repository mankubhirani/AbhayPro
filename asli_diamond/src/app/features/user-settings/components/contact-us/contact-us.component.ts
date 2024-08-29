import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  constructor(private _sharedService:SharedService) { }

  settingsObj:any = null;

  mobileNo = [];

  ngOnInit(): void {

    this._sharedService.getWebAppSettingsApi().subscribe((settings:any)=>{
      this.settingsObj = JSON.parse(settings['webAppSetting'][0].propertyValue);
    })

  }




}
