import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { Router } from '@angular/router';
import { webSocket } from 'rxjs/webSocket';
import { Observable, fromEvent, merge, of } from 'rxjs';


import { mapTo } from 'rxjs/operators';
import { SwUpdate } from '@angular/service-worker';
import { UserSettingsMainService } from './features/user-settings/services/user-settings-main.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'gamesjunglee';
  isblur: any = false;
  currentUserDetails: any;
  online$: Observable<boolean>;
  realDataWebSocket: any;
  private restarted: boolean = false;
  isMobileView = false;
  isUserActive : boolean | number = true;
  
  // private activitySubject = new Subject<boolean>();

  private inactivityDuration = 900000;    //900000; // 15 minutes (adjust as needed)
  private inactivityTimeout: any;
  inActive : boolean = false;
  isUpdate : boolean = false;

  @ViewChild('openModal') openModal:ElementRef;


  //updateRequired = false;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (window.innerWidth <= 767) {
      this._sharedService.isMobileView.next(true);
      this.isMobileView = true;
    } else {
      this.isMobileView = false;
      this._sharedService.isMobileView.next(false);
    }
  }


  constructor(
    private _sharedService: SharedService,
    private _router: Router,
    private swUpdate: SwUpdate,
    private _userSettingsService: UserSettingsMainService,
  ) {
    // this.setupVisibilityChange();

    this.online$ = merge(

      of(navigator.onLine),

      fromEvent(window, 'online').pipe(mapTo(true)),

      fromEvent(window, 'offline').pipe(mapTo(false))

    );
  }

  ngOnInit(): void {
    const isLoggedIn = this._sharedService.getJWTToken();
      if(isLoggedIn){
        this.getUserConfig();
      } else {
        this._sharedService.logout();
      }
    this.getWebSocketUrl();

    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        // if(confirm("You're using an old version of the control panel. Want to update?")) {
        //   window.location.reload();
        // }
        console.log("this.swUpdate.isEnabled",this.swUpdate.isEnabled);
        this.isUpdate = true;
      });
    }



    this.onResize(null);

    this._sharedService.sharedSubject.subscribe((res: any) => {
      this.isblur = res['isShowRightSideBar'];
    });

    this.startInactivityTimer();

    // Add event listeners for multiple events
    this.addUserActivityListeners(['mousemove', 'mousedown', 'keydown','mouseup','keyup','keypress','click','dblclick',
    'contextmenu','focus','blur','input','change','submit','resize','scroll','touchstart','touchmove','touchend','visibilitychange',
  'online','offline']);

    this.getUserAdminPubsub();

    this._sharedService.getIPApiv2();
  }

  private addUserActivityListeners(events: string[]): void {
    for (const event of events) {
      document.addEventListener(event, () => this.handleUserActivity());
    }
  }

  private handleUserActivity(): void {
    this.isUserActive = true;
    this.resetInactivityTimer();
  }

  isLoginPage(): boolean {
    return this._router.url.includes('login');
  }

  private startInactivityTimer(): void {
    this.inactivityTimeout = setTimeout(() => {
      this.isUserActive = false;
      // User is inactive, you can handle inactivity here
      
      if(this._router.url == '/login') {
        this.inActive = false;
      }
      else {
        this.inActive = true;
      }
      // this.openModal.nativeElement.click();
    }, this.inactivityDuration);
  }

  private resetInactivityTimer(): void {
    clearTimeout(this.inactivityTimeout);
    this.startInactivityTimer();
  }



  private getUserAdminPubsub(){
      this._sharedService.getUserAdminPubSubApi().subscribe( (resObj: any) => {
        this.getUserRealTimeEvent(resObj)
      } // Called whenever there is a message from the server.
      );
  }

  getUserRealTimeEvent(params: any) {

    if (params) {
      this.realDataWebSocket = webSocket(params['url']);
      this.realDataWebSocket.subscribe(
        data => {
          let currentUserDetails = this._sharedService.getUserDetails();
          if (currentUserDetails.userId == data.userId) {
            switch (data.message) {
              case "STATUS_CHANGED":
                if (data.status == 'Closed' || data.status == 'Inactive') {
                  this._sharedService.logout(); return;
                }
                currentUserDetails.isActive = data.status;
                localStorage.setItem('userDetails', JSON.stringify(currentUserDetails));
                window.location.reload();
                break;
              case "PASSWORD_CHANGED":
                this._sharedService.logout();
                break;
              case "BET_MATCHED":
                this._sharedService.unMatchSubjectListSubject.next(true);
                this._sharedService.getToastPopup('Successfully Bet Matched', 'Bet Matched', 'success');
                break;
              case "WINNINGS_ADJUSTED":
                this._sharedService.getUserBalance.next();
                break;
              case "EDIT_USER":
                this._sharedService.getUserBalance.next();
                break;
              case "BET_DELETED_BY_ADMIN":
                this._sharedService.unMatchSubjectListSubject.next(true);
                this._sharedService.getUserBalance.next();
                break;
              case "RESULT_OUT":
                this._sharedService.unMatchSubjectListSubject.next(true);
                this._sharedService.getUserBalance.next();
                break;
              case "LOGOUT_USER":
                this._sharedService.logout();
                break;
            }
          }
          switch (data.message) {
            case "LOGOUT_USER":
              if (localStorage.getItem('jwtToken') == data.userToken) {
                this._sharedService.logout();
              } else {
                // console.log('token not matched');
              }
              break;
            case "MATCH_MARKET_STATUS_CHANGED":
              // setTimeout(() => {
              //   window.location.reload();
              // }, 500);
              // if(data.clientId == ){

              // }

              if(currentUserDetails.refClientid == data.clientId){
                this._sharedService.markrtStatusChangedSubject.next(true);
              }
              break;
              case "CUSTOM_MARKET_STATUS_CHANGED" :
                this._sharedService.customMarketSubjectSubject.next(true);
                break;
              case "SOCKET_STATUS_CHANGED" :
                window.location.reload();
                break;
            case "BET_DELETED_SUSPENDED":
              setTimeout(() => {
                this._sharedService.deletedSuspendedSubject.next(true);
              }, 500);
              break;
          }
        },(err)=>{
          this.getUserAdminPubsub();
        },()=>{
          this.getUserAdminPubsub();

        })
    }
  }


  getUserConfig() {
    this._userSettingsService._getUserConfigApi().subscribe(
      (res) => {
        this._userSettingsService.userConfigSubject.next(res)
      });
  }


  getWebSocketUrl(){
    this._sharedService.getWebSocketURLApi().subscribe(url=>{
      this._sharedService.socketUrlSubject.next(url)
    })
  }


  ngOnDestroy(): void {
    this.realDataWebSocket.unsubscribe();
  }

  reloadPage() {
    window.location.reload();
    this.inActive = false;
  }

  logout() {
    this._sharedService.logout();
    this.inActive = false;
  }

  refreshScreen(){
    window.location.reload();
    this.isUpdate = false;
  }

}

