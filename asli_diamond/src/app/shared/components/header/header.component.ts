import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatePipe, Location } from '@angular/common';
import { CasinoService } from 'src/app/features/casino/services/casino.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn: boolean = false;
  isShowRightSideBar: boolean = false;
  searchList: any = [];
  userBalance: any;
  isMobileView: boolean;
  isShowLeftSideBar: boolean = false;
  searchText = '';
  menuList: any = [];
  date: any;
  isCasinoEnabled: boolean = false;
  isUserActive: boolean = true;
  private destroy = new Subject();
  settingsObj: any = null;
  inActive:boolean = false;
  currentTime: string;
  marqueeDuration = '10s';
  isSearchVisible: boolean = false;

  constructor(
    private _sharedService: SharedService,
    private router: Router,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private _casinoService: CasinoService
  ) { }

  ngOnInit(): void {

    // this.startTimer();

    window.addEventListener('popstate', () => {
      this.closeModal();
    });
    this.isMobileViewCallInit();
    this.getSubNavList()
    this.isLoggedIn = this._sharedService.isLoggedIn();
    if (this.isLoggedIn) {
      this.getUserBalance();
      this._sharedService.getUserBalance.pipe(
        takeUntil(this.destroy)     // import takeUntil from rxjs/operators.
      ).subscribe(res => {
        this.getUserBalance();
      })
        ;

      // this.updateTime(); // Initialize the time when the component is first loaded
      // setInterval(() => {
      //   this.updateTime(); // Update the time every second
      // }, 1000); // 1000 milliseconds = 1 second
    }

    this.isUserActive = this._sharedService.isUserActive();
    this.getWebAppSettingData();

  }

  getWebAppSettingData() {
    this._sharedService.getWebAppSettingsApi().subscribe((settings: any) => {
      this.settingsObj = JSON.parse(settings['webAppSetting'][0].propertyValue);
      if (this.settingsObj.is_maintenance) {
        this._sharedService.isMaintenanceActive.next(true);
      }
    });

  }

  redirectToAviatorCasino() {

    if (!this.isUserActive) {
      return;
    }
    let body = {
      "gameCode": "SPB-aviator",
      "providerCode": "QT",
      "url": window.location.hostname
    }
    localStorage.setItem('casinoBody', JSON.stringify(body));
    this._casinoService._postCasinoURLApi(body).subscribe(res => {
      this._sharedService.launchURL = res['casinoObj'].launchURL;
      localStorage.setItem('iframeUrl', res['casinoObj'].launchURL);
      this.router.navigate(['/casino-play']);
    })
  }

  // startTimer(){
  //   setInterval(() => {
  //     this.date = new Date()
  //   }, 1000)
  // }


  // getCurrentTime(): string {
  //   const currentTime = new Date();
  //   return currentTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
  // }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  closeModal() {
    const backdropElement = document.querySelector('.modal-backdrop');
    if (backdropElement) {
      backdropElement.classList.remove('show'); // Remove 'show' class to hide the backdrop
      //backdropElement.style.display = 'none'; // Set 'display' property to none
    }
    document.body.classList.remove('modal-open');
  }

  redirectToCasino(gameCode, providerCode){
    let body = {
      "gameCode": gameCode,
      "providerCode": providerCode,
      "url": window.location.hostname
    }
    localStorage.setItem('casinoBody',JSON.stringify(body));

    this._casinoService._postCasinoURLApi(body).subscribe(res=>{
      this._sharedService.launchURL = res['casinoObj'].launchURL;
      localStorage.setItem('iframeUrl',res['casinoObj'].launchURL);
      this.router.navigate(['/casino-play']);
    },error=>{
    })
  }

  getSubNavList() {
    this._sharedService._getAllNavListApi().subscribe((res) => {
      this.menuList = res['menuList'];
      if (this.menuList.some(function (el) { return el.gameId === 4 })) {
        this.isCasinoEnabled = true;
      }
    });
  }

  isMobileViewCallInit() {
    this.isMobileView = this._sharedService.isMobileViewFn();
    this._sharedService.isMobileView.subscribe((res: any) => {
      this.isMobileView = res;
    })
  }

  getRightSidebarEvent(eventObj) {
    this.isShowRightSideBar = !eventObj['isClose'];
  }

  getLeftSidebarEvent(eventObj) {
    this.isShowLeftSideBar = !eventObj['isClose'];
  }


  onClickAvailableCredit() {
    this.isShowRightSideBar = !this.isShowRightSideBar;
    this._sharedService.sharedSubject.next({
      'isShowRightSideBar': this.isShowRightSideBar
    });

  }

  onLeftClick() {
    this.isShowLeftSideBar = !this.isShowLeftSideBar;
    this._sharedService.sharedSubject.next({
      'isShowLeftSideBar': this.isShowLeftSideBar
    });

  }

  getUserBalance() {
    this._sharedService._getBalanceInfoApi().subscribe((res) => {
      this.userBalance = res;
      this._sharedService.userBalance = res;
    })
  }

  postSearchList(searchText: any) {
    this._sharedService._postSearchListApi({ "searchText": searchText })
      .subscribe((res) => {
        this.searchList = res;
        if (!this.searchText) {
          this.searchList = [];
        }
      })
  }


  logout() {
    this._sharedService.logout();
    this.inActive = false;
  }

  emptySearchList() {
    this.searchList = [];
    // event.target.value = ""
    this.searchText = ""
  }

  // Refresh

  refreshPage() {
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    window.removeEventListener('popstate', () => {
      // Remove event listener
    });
  }

  navigateToMatch(singleObj) {
    // "/sportsbook/{{
    //   singleObj['sportType']['sportName'] | titlecase
    // }}/{{ singleObj['tournament']['tournamentId'] }}/{{
    //   singleObj['matchId']
    // }}"
    this.router.navigate(['sportsbook/' + singleObj['sportType']['sportName'] + '/' + singleObj['tournament']['tournamentId'] + '/' + singleObj['matchId']])
    this.emptySearchList()
  }
  toggleSearch(): void {
    this.isSearchVisible = !this.isSearchVisible;
  }
}