import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-casino-play',
  templateUrl: './casino-play.component.html',
  styleUrls: ['./casino-play.component.scss']
})
export class CasinoPlayComponent implements OnInit {
  launchUrl: any;
  iframeURL: any;
  showNotice = false;
  casinoBody:any = null;

  constructor(private _router: Router,public sanitizer: DomSanitizer,private _sharedService:SharedService) { }

  ngOnInit(): void {


    this.iframeURL =   localStorage.getItem('iframeUrl');
    this.casinoBody =   localStorage.getItem('casinoBody');
    this.launchUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeURL);

    const userDetails = this._sharedService.getUserDetails();

    if(this.casinoBody){
      let casinoObj = JSON.parse(this.casinoBody);

      if(casinoObj.gameCode == "SPB-aviator" && userDetails.casinoCurrency == "HKD"){
        this.showNotice = true;
      }
    }

    // this.posttCasinoUrlIframe();
  }


  manageNotice(proceed){
    if(proceed){
      this.showNotice = false;
    }else{
      this._router.navigate(['/in-play'])
    }
  }



}
