import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import * as _ from "lodash";
import { webSocket } from 'rxjs/webSocket';
import { CasinoService } from '../../services/casino.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-casino-list',
  templateUrl: './casino-list.component.html',
  styleUrls: ['./casino-list.component.scss']
})
export class CasinoListComponent implements OnInit {

  isLoggedIn:boolean = false;
  isMobileView:boolean;
  casinoProvider: any = null;
  casinoCategory: any = null;
  casinoGameList: any ;
  displayCasinoList:any = [];
  currentValue: any;
  isLoading:boolean = false;
  searchText = ""
  showNotice = true;

  constructor(private _sharedService: SharedService,private _casinoService: CasinoService,private _router: Router) {

   }

  ngOnInit(): void {
    this.isLoggedIn = this._sharedService.isLoggedIn();

    this.getCasinoGameList();
    this.isMobileViewCallInit();
    this._sharedService.casinoSubject.subscribe((res:any)=>{
      this.searchText = "";
      if(res.provider == "null"){
        res.provider = null;
      }
      if(res.category == "OTHER" || res.category == "ALL") {
        res.category = null;
      }

      let body = {
        "providerCode": res.provider,
        "casinoGameName": res.category
      }
      this.isLoading = true;
      this._casinoService._postCasinoGamesListApi(body).subscribe(res2=>{
        this.casinoGameList = res2['casinoList'];
        this.displayCasinoList = res2['casinoList'];
        this.isLoading = false;
      });
    })

    const userDetails = this._sharedService.getUserDetails();

    if(userDetails.casinoCurrency == "HKD"){
      this.showNotice = true;
    }else{
      this.showNotice = false;
    }
  }



  getCasinoGameList(){
    let body = {
      "providerCode": null,
      "casinoGameName": null
    }
    this.isLoading = true;
    this._casinoService._postCasinoGamesListApi(body).subscribe(res=>{
      this.isLoading = false;
      this.casinoGameList = res['casinoList'];
      this.displayCasinoList = res['casinoList'];

    });


  }

  postCasinoUrlIframe(value){

    let body = {
      "gameCode": value.casinoGameCode,
      "providerCode": value.providerCode,
      "url": window.location.hostname
    }
    console.log(body)
    localStorage.setItem('casinoBody',JSON.stringify(body));

    this.isLoading = true;
    this._casinoService._postCasinoURLApi(body).subscribe(res=>{
      this._sharedService.launchURL = res['casinoObj'].launchURL;
      localStorage.setItem('iframeUrl',res['casinoObj'].launchURL);
      this._router.navigate(['/casino-play']);
      this.isLoading = false;
    },error=>{
      this.isLoading = false;
    })
  }


  onSearchCasinoGames(){
    this.displayCasinoList = this.casinoGameList.filter(obj=>{
      for (let key in obj) {
        if (obj[key].toString().toLowerCase().includes(this.searchText.toLocaleLowerCase())) {
          return true;
        }
      }
      return false;
    })
  }


  isMobileViewCallInit() {
    this.isMobileView = this._sharedService.isMobileViewFn();
    this._sharedService.isMobileView.subscribe((res: any) => {
      this.isMobileView = res;
    })
  }


  manageNotice(proceed){
    if(proceed){
      this.showNotice = false;
    }else{
      this._router.navigate(['/in-play'])
    }
  }
}
