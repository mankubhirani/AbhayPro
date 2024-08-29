import { Component, OnInit } from '@angular/core';
import { CasinoService } from '../../services/casino.service';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-casino-right-menu',
  templateUrl: './casino-right-menu.component.html',
  styleUrls: ['./casino-right-menu.component.scss']
})
export class CasinoRightMenuComponent implements OnInit {

  constructor(private _casinoService: CasinoService, private _sharedService: SharedService,) { }

  currentValue:any = "ALL";
  casinoMenuList:any = [];
  isMobileView = false;
  isLoggedIn = false;
  provider:any;
  selectedMenu:any = null;

  ngOnInit(): void {
    this.getCasinoCategoryList();
    this.isMobileViewCallInit();
    this._sharedService.casinoSubject.subscribe((res:any)=>{
      if(res.resetCategory){
        this.currentValue = "ALL"
        this.selectedMenu = null;
      }
    })
    this.provider = this._sharedService.casinoProvider;

  }

  getCasinoCategoryList() {
    this._casinoService._getCasinoCategoryApi().subscribe((res) => {
      this.casinoMenuList = [];
      this.casinoMenuList = res['casinoCategory'];
      this.casinoMenuList.unshift({providerCode:this._sharedService.casinoProvider,categoryName:"ALL"})
    });
  }


  onCategorySelected(category){
    this.currentValue = category.categoryName;
    this._sharedService.casinoCategory = category.categoryName;
    this._sharedService.casinoSubject.next({ category: this.currentValue, provider: this._sharedService.casinoProvider });
  }


  isMobileViewCallInit() {
    this.isMobileView = this._sharedService.isMobileViewFn();
    this._sharedService.isMobileView.subscribe((res: any) => {
      this.isMobileView = res;
    })

  }

}
