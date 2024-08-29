import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject, Observable,of } from 'rxjs';
import { ApiEndpointsService } from 'src/app/core/services/api-endpoint.service';
import { ApiHttpService } from 'src/app/core/services/api-http.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { HttpContext } from '@angular/common/http';
import { IGNORED_STATUSES } from '@core/interceptors/http-error.interceptor';
import * as XLSX from 'xlsx';
import { webSocket } from 'rxjs/webSocket';
import { retry, catchError, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';

const secretKey = environment.cryptoKey;

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  sharedSubject = new Subject();
  marketBookCalSubject = new Subject();
  private previousUrl: string = '';
  private currentUrl: string = '';
  getUserBalance = new Subject();
  getUserBalanceMarket = new Subject();
  isMobileView = new Subject();
  isMobileViewCancel = new Subject();
  unmatchedBetsList: any = [];
  userIp: any = '127.0.0.1';
  unMatchSubjectListSubject = new Subject();
  markrtStatusChangedSubject = new Subject();
  
  userBalance: any;
  ifBetSlipOpened = new BehaviorSubject(false);

  casinoSubject = new Subject();
  deletedSuspendedSubject = new Subject();

  isisExpandedNavSideBar = new BehaviorSubject(true);
  isMaintenanceActive = new BehaviorSubject<boolean>(false);
  router: any;
  liveStreamingTVUrl: any;
  liveScoreBoardUrl: any;
  realDataWebSocket: any;
  casinoProvider: any = null;
  casinoCategory: any = null;
  launchURL: any;

  betStakeSubject = new Subject();
  private myMenu$: Observable<any> | null = null;
  private webAppSettings$: Observable<any>;
  customMarketSubjectSubject =  new Subject();
  socketUrlSubject = new BehaviorSubject<any>(null);

  isOneclickBetOn : any;

  ipAddress:any;

  constructor(
    private _toastr: ToastrService,
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,
    private _router: Router,
    private _location: Location
  ) {
    // this.currentUrl = this._route.url;
    // _route.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     this.previousUrl = this.currentUrl;
    //     this.currentUrl = event.url;
    //   };
    // });

    // this._location.back();
  }


  public exportExcel(fileData, fileName) {
    /* pass here the table id */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(fileData);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);
  }

  public getPreviousUrl() {
    return this._location.back();
  }

  _getUserDetailsApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getUserDetailEndpoint());
  }

  _getSportsListApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getSportsEndpoint());
  }

  _getSportsToursListApi(id: string) {
    return this._apiHttpService
      .get(this._apiEndpointsService.getSportsToursByIdEndpoint(id));
  }

  _getToursMatchesListApi(id: string) {
    return this._apiHttpService
      .get(this._apiEndpointsService.getToursMatchesByIdEndpoint(id));
  }


  getToastPopup(errorMsg: string, errorModule: string, errorType: string) {
    switch (errorType) {
      case 'error':
        this._toastr.error('',errorMsg, {
          progressBar: true,
          timeOut:2000
        });
        break;
      case 'info':
        this._toastr.info('',errorMsg, {
          progressBar: true,
          timeOut:2000
        });
        break;
      case 'success':
        this._toastr.success('',errorMsg, {
          progressBar: true,
          timeOut:2000
        });
        break;
    }
  }

  isLoggedIn() {
    return localStorage.getItem('jwtToken') ? true : false;
  }

  isUserActive() {
    return this.getUserDetails()['isActive'] == 'Active' ? true : false;
  }

  getJWTToken() {
    return localStorage.getItem('jwtToken');
  }

  setJWTToken(jwtToken: string) {
    localStorage.setItem('jwtToken', jwtToken);
  }

  removeJWTToken() {
    localStorage.removeItem('jwtToken');
  }

  rtnSingleObjFromArrObj(arrObjParams: any, obj: any) {
    let key = Object.keys(obj)[0];
    return arrObjParams.filter(arrObjParam => arrObjParam[key] == obj[key])[0];
  }

  _replaceArrayObject(arr1, arr2, objKey) {
    return arr1.map(obj => arr2.find(o => o[objKey] === obj[objKey]) || obj);
  }

  _removeObjectFromArray(arr1, data) {
    return arr1.filter(obj => obj.key != data.key);
  }
  removeToken() {
    localStorage.removeItem('jwtToken');
  }

  getUserDetails() {
    return JSON.parse(localStorage.getItem('userDetails') || '{}');
  }

  setUserDetails(userDetails) {
    localStorage.setItem('userDetails', JSON.stringify(userDetails['user']));
  }

  removeUserDetails() {
    localStorage.removeItem('userDetails');
  }

  _getBalanceInfoApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getBalanceInfoEndpoint());
  }

  _getAllNavListApi(): Observable<any> {
    if(!this.myMenu$){
      this.myMenu$ = this._apiHttpService
        .get(this._apiEndpointsService.getAllNavEndPoint()).pipe(
          catchError((error) => {
            console.error('API error:', error);
            return of(null);
          }),
          shareReplay(1)
        );
    }
    return this.myMenu$;
  }

  _getLeftMenuList(): Observable<any> {
    return this._apiHttpService
      .get(this._apiEndpointsService.getLeftMenuEndPoint());
  }

  getWebSocketURLApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getWebSocketURLEndpoint()).pipe(retry(3));
  }

  _postInPlayUpcomingApi(inPlayUpcomingBody: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getInPlayUpcomingEndPoint(), inPlayUpcomingBody);
  }


  _postLineApi(lineBody: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getLineEndPoint(), lineBody);
  }



  postSetOrUnsetWebSocketDataApi(isSet: boolean, objParams: object) {
    if (isSet) {
      return this._apiHttpService
        .post(this._apiEndpointsService.getWebSocketDataBySetORUnsetEndpoint('set'), objParams);
    } else {
      return this._apiHttpService
        .post(this._apiEndpointsService.getWebSocketDataBySetORUnsetEndpoint('unset'), objParams);
    }
  }

  _postTourListApi(tourParams: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getSportsToursEndpoint(), tourParams);
  }

  _postSearchListApi(searchParams: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getSearchEventEndPoint(), searchParams);
  }


  _postPlaceBetApi(placeBetObjParams: object) {
    const payload = this.encryptPayload(placeBetObjParams);

    return this._apiHttpService
      .post(this._apiEndpointsService.getPlaceBetEndpoint(), {betParam:payload}, {
        context: new HttpContext().set(IGNORED_STATUSES, [600]),
      });
  }


  encryptPayload(payload: any): string {
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(payload), secretKey).toString();
    return ciphertext;
  }
  
  _getUserOpenBetsApi() {

    return this._apiHttpService
      .get(this._apiEndpointsService.getUserOpenBets());
  }

  _getBooksForMarketApi(marketIdListBody: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getBooksForMarket(), marketIdListBody);
  }

  getIPApi() {
    return this._apiHttpService.get('https://api.ipify.org?format=json');
  }

  getIPV2Api(ip: any) {
    return this._apiHttpService.get('https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_O9SDuoswBQEZ23Act1whK9doGxRSQ&ipAddress=',ip);
  }

  postCancelBetForMarket(betIdListBody: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getCancelBetForMarket(), betIdListBody);
  }

  postLiveStreamForMarket(liveStreamMatchObj: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getLiveStreamMatch(), liveStreamMatchObj);
  }

  _getUniqueDeviceKeyApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getUniqueDeviceKey());
  }


  _getDemoLoginApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getDemoLoginEndPoint());
  }

  _getWebSocketURLByDeviceApi(liveStreamMatchObj: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getWebSocketURLByDevice(), liveStreamMatchObj);
  }

  getUserAdminPubSubApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getUserAdminPubSubEndPoint()).pipe(retry(3));
  }


  getWebAppSettingsApi():Observable<any> {
    if(!this.webAppSettings$){
      this.webAppSettings$ = this._apiHttpService
      .get(this._apiEndpointsService.getWebAppSettingsEndPoint())
      .pipe(
        retry(3),
        shareReplay(1) // Cache the response and share it among subscribers.
      );
    }
    return this.webAppSettings$;
  }



  isMobileViewFn() {
    if (window.innerWidth <= 767) {
      return true;
    } else {
      return false;
    }
  }

  logout() {
    this.removeJWTToken();
    this.removeUserDetails();
    this.myMenu$ = null;
    this._router.navigate(['/login']);
  }

  async checkImageExists(imageUrl: string): Promise<boolean> {
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error checking image:', error);
      return false; // Return false in case of an error
    }
  }

  getIPData() {
    return sessionStorage.getItem(('ipdata'));
  }


  getIPApiv2() {
     this._apiHttpService.get('https://api.ipgeolocation.io/getip').subscribe(res=>{
      this.ipAddress = res['ip'];
     })
  }

  getIpAddress(){
    return this.ipAddress || '127.0.0.1';
  }


  _postBookMakerMarketApi(inPlayUpcomingBody: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getBookMakerEndPoint(), inPlayUpcomingBody);
  }

  _postFancyMarketApi(inPlayUpcomingBody: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getFancyMarketEndPoint(), inPlayUpcomingBody);
  }

  _postLadderDataByMarketApi(ladderBody: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getLadderDataByMarket(), ladderBody);
  }

  _getCustomMarketApi(body){
    return this._apiHttpService
    .post(this._apiEndpointsService.getCustomMarketEndPoint(), body);
    
  }

}

