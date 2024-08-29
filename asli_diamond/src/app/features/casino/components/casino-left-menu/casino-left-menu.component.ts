import { Component, Input, OnInit } from '@angular/core';
import { CasinoService } from '../../services/casino.service';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-casino-left-menu',
  templateUrl: './casino-left-menu.component.html',
  styleUrls: ['./casino-left-menu.component.scss']
})
export class CasinoLeftMenuComponent implements OnInit {

  casinoMenu: any;
  casinoMenuList: any;
  casinoProvider: any;
  casinoCategory: any;
  isMobileView: boolean = false;
  backgroundColor = "";
  selectedCasino = null;

  userDetails: any;
  mainMenu: any = [];
  viewMoreNavList: any = [];

  isLoggedIn: boolean = false;
  currentValue: string;
  currentProvider:string;
  color = false;
  searchList: any = [];

  constructor(private _casinoService: CasinoService, private _sharedService: SharedService,) {
  }

  ngOnInit(): void {
    this.isMobileViewCallInit();
    this.getCasinoProviderList();
    // this.getCasinoCategoryList();

    this.isLoggedIn = this._sharedService.isLoggedIn();
    this.userDetails = this._sharedService.getUserDetails();
  }

  getCasinoProviderList() {
    this.casinoMenu = [];
    this._casinoService._getCasinoProvider2Api().subscribe((res) => {
      // this.mainMenu = res;
      this.casinoMenu = res['providerList'];
      this.casinoMenu.unshift({providerCode:null,categoryName:null,providerName:"ALL"})
    });
  }

  getCasinoCategoryList() {
    this._casinoService._getCasinoCategoryApi().subscribe((res) => {
      this.casinoMenuList = [];
      this.casinoMenuList = res['casinoCategory'];
      this.casinoMenuList.unshift({providerCode:this.currentProvider,categoryName:"ALL"})
    });
  }

  selectProvider(evt) {
    this.currentProvider = evt.providerCode;
    this._sharedService.casinoProvider = evt.providerCode;
    this.currentValue = "ALL";
    this._sharedService.casinoCategory = "ALL";
    this._sharedService.casinoSubject.next({ category: this._sharedService.casinoCategory, provider: this._sharedService.casinoProvider,resetCategory:true });
  }

  getCategory(value) {
    this.currentValue = value.categoryName;
    this._sharedService.casinoCategory = value.categoryName;
    this._sharedService.casinoSubject.next({ category: this._sharedService.casinoCategory, provider: this._sharedService.casinoProvider });
  }


  isMobileViewCallInit() {
    this.isMobileView = this._sharedService.isMobileViewFn();
    this._sharedService.isMobileView.subscribe((res: any) => {
      this.isMobileView = res;
    })
  }
}
