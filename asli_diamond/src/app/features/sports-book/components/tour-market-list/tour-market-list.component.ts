import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { webSocket } from 'rxjs/webSocket';
import * as _ from "lodash";
import {Location} from '@angular/common';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-tour-market-list',
  templateUrl: './tour-market-list.component.html',
  styleUrls: ['./tour-market-list.component.scss']
})
export class TourMarketListComponent implements OnInit,OnDestroy {

  subNavList:any =[];
  inPlayMatchListBySport:any=[];
  upComingMatchListBySport:any=[];
  isPageDestroyed = false;
  realDataWebSocket:any;
  webSocketUrl:string;
  setOrUnsetWebSocketParamsObj:any = {
    upcoming:{
      centralIds:[]
    },
    inplay:{
      centralIds:[]
    }
  };
  setResponse:any= {};

  tourId:any;
  tourName:string = 'NO MATCH AVAILABLE';
  sports:string;

  isBetSlipShow:boolean = false;
  isLoggedIn:boolean = false;
  isSocketCompleted = false;
  isBetSlipActive:boolean = false;
  betSlipObj:any = {};
  booksForMarket:any;
  placeBetData:any;
  isMobileView:boolean;
  subjectSub:Subscription;
  loadingEvents = true;
  socketSub:Subscription;

  @HostListener('document:visibilitychange', ['$event'])
  onVisibilityChange(event: Event) {
    if (!document.hidden && this.isMobileView) {
        this.restartWebpage();
    }
  }

  constructor(
    private _sharedService: SharedService,
    private _route: ActivatedRoute,
    private _location: Location,
    private _cdref: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isPageDestroyed = false;
    this.isSocketCompleted = false;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Reset the variable to an empty value
        this.upComingMatchListBySport = [];
        this.inPlayMatchListBySport = [];
        this.loadingEvents = true;
        this.isPageDestroyed = false;
        this.isSocketCompleted = false;
      }
    });

    this.isMobileViewCallInit();
    this.isBetSlipShow = this.isLoggedIn = this._sharedService.isLoggedIn() && this._sharedService.isUserActive();
    this._route.params.subscribe(routeParams =>{
      this.sports = routeParams.sports;
      this.tourId = routeParams.tourId;
      // this.initConfig();
      this.getInPlayUpcomingData();
    })

    this.subjectSub = this._sharedService.getUserBalanceMarket.subscribe(res=>{
      this.placeBetData = [];
      if(this.inPlayMatchListBySport.length > 0 && this.isLoggedIn) this.getBooksForMarket(this.inPlayMatchListBySport);
    })

    this.socketSub = this._sharedService.socketUrlSubject.subscribe(res=>{
      if(res){
        this.realDataWebSocket = webSocket(res['url']);
        this._getWebSocketUrl();
      }
    })
  }

  isMobileViewCallInit(){
    this.isMobileView =  this._sharedService.isMobileViewFn();
    if(this.isMobileView) this._closeBetSlipWindowForMobile();
    this._sharedService.isMobileView.subscribe((res:any)=>{
      this.isMobileView = res;
    })
  }

  private _closeBetSlipWindowForMobile(){
    this._sharedService.isMobileViewCancel.subscribe(()=>{
      this.betSlipObj['selectionId'] = '';
    })
  }

  ngAfterContentChecked() {
    this._sharedService.marketBookCalSubject.subscribe(res=>{
      this.placeBetData = res;
    })
    this._cdref.detectChanges();
  }




  restartWebpage() {
    // console.log('get socket')
    // this._getWebSocketUrl();

    if(this.isSocketCompleted){
      console.log('restart')
      this._subscribeWebSocket()
    }
  }

  getInPlayUpcomingData(){
    this.loadingEvents = true;
    this._sharedService._postInPlayUpcomingApi({tournamentId:this.tourId}).subscribe((res:any)=>{
      if(res?.inPlayUpcomingMarket && (res['inPlayUpcomingMarket']['inPlayMarkets'].length > 0
        || res['inPlayUpcomingMarket']['upComingMarkets'].length > 0)){

         res['inPlayUpcomingMarket']['inPlayMarkets'].map(sportsObj =>{
          sportsObj['isExpand'] = true;
          if(sportsObj?.tournamentName) this.tourName =  sportsObj['tournamentName'];
          this.setOrUnsetWebSocketParamsObj['inplay']['centralIds'].push(sportsObj['market']['centralId']);
          return sportsObj['market']['runners'].map(runnerRes=>{

            if((runnerRes['batb'] == undefined) || (runnerRes['batl'] == undefined)){
              runnerRes['back0'] ='';
              runnerRes['vback0'] ='';

              runnerRes['back1'] =  '';
              runnerRes['vback1'] = '';

              runnerRes['back2'] ='';
              runnerRes['vback2'] = '';

              runnerRes['lay0'] = '';
              runnerRes['vlay0'] = '';

              runnerRes['lay1'] =  '';
              runnerRes['vlay1'] = '';

              runnerRes['lay2'] = '';
              runnerRes['vlay2'] = '';

            }else{
                runnerRes['back0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['odds']: '';
                runnerRes['vback0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['tv']:'';

                runnerRes['back1'] = runnerRes['batb'][1] !== undefined ? runnerRes['batb'][1]['odds']: '';
                runnerRes['vback1'] = runnerRes['batb'][1] !== undefined ? runnerRes['batb'][1]['tv']:'';

                runnerRes['back2'] = runnerRes['batb'][2] !== undefined ? runnerRes['batb'][2]['odds']: '';
                runnerRes['vback2'] = runnerRes['batb'][2] !== undefined ? runnerRes['batb'][2]['tv']:'';

                runnerRes['lay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['odds']: '';
                runnerRes['vlay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['tv']:'';

                runnerRes['lay1'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['odds']: '';
                runnerRes['vlay1'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['tv']:'';

                runnerRes['lay2'] = runnerRes['batl'][2] !== undefined ? runnerRes['batl'][2]['odds']: '';
                runnerRes['vlay2'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['tv']:'';
            }

                runnerRes['suspended'] = true;
                return runnerRes;
          })
        })

        res['inPlayUpcomingMarket']['upComingMarkets'].map(sportsObj =>{
          sportsObj['isExpand'] = true;
          if(sportsObj?.tournamentName) this.tourName =  sportsObj['tournamentName'];
          this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds'].push(sportsObj['market']['centralId']);
          return sportsObj['market']['runners'].map(runnerRes=>{
            if((runnerRes['batb'] == undefined) || (runnerRes['batl'] == undefined)){
              runnerRes['back0'] ='';
              runnerRes['vback0'] ='';

              runnerRes['back1'] =  '';
              runnerRes['vback1'] = '';

              runnerRes['back2'] ='';
              runnerRes['vback2'] = '';

              runnerRes['lay0'] = '';
              runnerRes['vlay0'] = '';

              runnerRes['lay1'] =  '';
              runnerRes['vlay1'] = '';

              runnerRes['lay2'] = '';
              runnerRes['vlay2'] = '';

            }else{
                runnerRes['back0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['odds']: '';
                runnerRes['vback0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['tv']:'';

                runnerRes['back1'] = runnerRes['batb'][1] !== undefined ? runnerRes['batb'][1]['odds']: '';
                runnerRes['vback1'] = runnerRes['batb'][1] !== undefined ? runnerRes['batb'][1]['tv']:'';

                runnerRes['back2'] = runnerRes['batb'][2] !== undefined ? runnerRes['batb'][2]['odds']: '';
                runnerRes['vback2'] = runnerRes['batb'][2] !== undefined ? runnerRes['batb'][2]['tv']:'';

                runnerRes['lay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['odds']: '';
                runnerRes['vlay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['tv']:'';

                runnerRes['lay1'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['odds']: '';
                runnerRes['vlay1'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['tv']:'';

                runnerRes['lay2'] = runnerRes['batl'][2] !== undefined ? runnerRes['batl'][2]['odds']: '';
                runnerRes['vlay2'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['tv']:'';
            }

                runnerRes['suspended'] = true;
                return runnerRes;
          })
        })

        //merge both centralId
        this.inPlayMatchListBySport = res['inPlayUpcomingMarket']['inPlayMarkets'];
        this.upComingMatchListBySport = res['inPlayUpcomingMarket']['upComingMarkets'];
        
   
        if(this.inPlayMatchListBySport.length > 0 && this.isLoggedIn) this.getBooksForMarket(this.inPlayMatchListBySport);
      }

      this.loadingEvents = false;
    })
    
  }

  _getWebSocketUrl(){
    console.log('tour market sub')
    this._subscribeWebSocket()
  }


  private _updateMarketData(data: any) {
    let parseData = JSON.parse(data);
    if(parseData.hasOwnProperty('data') && typeof parseData?.data !== 'string'){
      let webSocketData = parseData['data'];
      if(this.inPlayMatchListBySport.length >0){
        this.inPlayMatchListBySport.map(sportsObj =>{
            let singleWebSocketMarketData = _.find(webSocketData, ['bmi', sportsObj['market']['marketId']]);
            if(singleWebSocketMarketData != undefined){
              sportsObj['market']['appMarketStatus'] = singleWebSocketMarketData['ms'];
              // sportsObj['market']['appMarketStatus'] = singleWebSocketMarketData['ip'];

              return sportsObj['market']['runners'].map((runnerRes) => {

                runnerRes['back0'] = null;
                runnerRes['back1'] = null;
                runnerRes['back2'] = null;
                runnerRes['vback0'] = null;
                runnerRes['vback1'] = null;
                runnerRes['vback2'] = null;

                runnerRes['lay0'] = null;
                runnerRes['lay1'] = null;
                runnerRes['lay2'] = null;
                runnerRes['vlay0'] = null;
                runnerRes['vlay1'] = null;
                runnerRes['vlay2'] = null;

                let webSocketRunners = _.filter(singleWebSocketMarketData?.['rt'], ['ri', runnerRes['SelectionId']]);
                for (let singleWebsocketRunner of webSocketRunners) {
                  if (singleWebsocketRunner['ib']) {
                    //back

                    //Live Rate
                    runnerRes['back' + singleWebsocketRunner['pr']] = singleWebsocketRunner['rt'];

                    //Volume from Betfair
                    runnerRes['vback' + singleWebsocketRunner['pr']] = singleWebsocketRunner['bv'];

                  } else {
                    //lay

                    //Live Rate
                    runnerRes['lay' + singleWebsocketRunner['pr']] = singleWebsocketRunner['rt'];

                    //Volume from Betfair
                    runnerRes['vlay' + singleWebsocketRunner['pr']] = singleWebsocketRunner['bv'];

                  }
                }
                // if((runnerRes['back0'] !==0 || runnerRes['back1'] !==0 || runnerRes['back2'] !==0)
                //     || runnerRes['lay0'] !==0 || runnerRes['lay1'] !==0 || runnerRes['lay2'] !==0){
                //       runnerRes['suspended'] = false;
                // }
                return runnerRes;
              })
            }
        })
      }

      if(this.upComingMatchListBySport.length >0){
        this.upComingMatchListBySport.map(sportsObj =>{
              let singleWebSocketMarketData = _.find(webSocketData, ['bmi', sportsObj['market']['marketId']]);
              if(singleWebSocketMarketData != undefined){
                sportsObj['market']['appMarketStatus'] = singleWebSocketMarketData['ms'];

                if(singleWebSocketMarketData['ip'] == 1){
                  this.getInPlayUpcomingData();
                }
                return sportsObj['market']['runners'].map((runnerRes) => {
                  let webSocketRunners = _.filter(singleWebSocketMarketData?.['rt'], ['ri', runnerRes['SelectionId']]);
                  for (let singleWebsocketRunner of webSocketRunners) {
                    if (singleWebsocketRunner['ib']) {
                      //back

                      //Live Rate
                      runnerRes['back' + singleWebsocketRunner['pr']] = singleWebsocketRunner['rt'];

                      //Volume from Betfair
                      runnerRes['vback' + singleWebsocketRunner['pr']] = singleWebsocketRunner['bv'];

                    } else {
                      //lay

                      //Live Rate
                      runnerRes['lay' + singleWebsocketRunner['pr']] = singleWebsocketRunner['rt'];

                      //Volume from Betfair
                      runnerRes['vlay' + singleWebsocketRunner['pr']] = singleWebsocketRunner['bv'];

                    }
                  }
                  // if((runnerRes['back0'] !==0 || runnerRes['back1'] !==0 || runnerRes['back2'] !==0)
                  //     || runnerRes['lay0'] !==0 || runnerRes['lay1'] !==0 || runnerRes['lay2'] !==0){
                  //       runnerRes['suspended'] = false;
                  // }
                  return runnerRes;
                })
              }
          })
        }
    }
  }

  _subscribeWebSocket(){
    console.log('socket sucscribed')
    this.realDataWebSocket.subscribe(
      data => {
        if(typeof data == 'string') this._updateMarketData(data);
        // if(typeof data == 'string') console.log('sub',data);
      }, // Called whenever there is a message from the server.
      err => {
        console.log(err)
        console.log(this.isPageDestroyed)
        if(!this.isPageDestroyed)this._getWebSocketUrl();
      }, // Called if at any point WebSocket API signals some kind of error.
      () => {
        console.log('completed')
        console.log(this.isPageDestroyed)
        if(!this.isPageDestroyed){
          this.isSocketCompleted = true;
          this._getWebSocketUrl();
        }
      } // Called when connection is closed (for whatever reason).
    );
  }

  onClickLiveMarketRate(runnerObj:any,marketData:any,positionObj:any){

    if(this._sharedService.isUserActive() == false){
      return;
    }

    this.betSlipObj = {
        "sportId":marketData['sportId'],
        "tournamentId":marketData['tournamentId'],
        "eventId":marketData['matchId'],
        "event":marketData['matchName'],
        "marketId":marketData['market']['marketId'],
        "marketName":marketData['marketType'],
        "sportName":this.sports,
        "odds": positionObj['odds'],
        "betPosition":positionObj['index'],
        "profit":0,
        "selectionId":runnerObj['SelectionId'],
        "selectionName":runnerObj['RunnerName'],
        "stake": 0,
        "isBack": positionObj['isBack'],
        "centralId":marketData['market']['centralId'],
        "runs":null,
        "matchTime":marketData['matchTime'],
        "book":marketData['market']['runners'],
        "isBetSlipActive":positionObj['odds'] > 0 ? true: false,
        "booksForMarket":this.booksForMarket,
        "runnerObj":marketData['market']['runners'],
        "marketTypeName":marketData['market']['marketName'],
        "minBet": marketData['market'].minBet,
        "maxBet": marketData['market'].maxBet,
        "marketDelay": marketData['marketDelay']
    }
  }

  getBooksForMarket(marketList:any){
    let markets= {marketIds : marketList.map(m=>m.market.marketId)}
    this._sharedService._getBooksForMarketApi(markets).subscribe((res:any) =>{
      let booksForMarket = this.booksForMarket = res?.booksForMarket;
      this.inPlayMatchListBySport.map((sportsObj)=>{
        let horseDataByMarketId = _.find(booksForMarket,['marketId',sportsObj['market']['marketId']]);
        return sportsObj['market']['runners'].map((singleRunner)=>{
          singleRunner['hourseAmt']= _.find(horseDataByMarketId?.horses,['horse',singleRunner['SelectionId']]);
          return singleRunner;
        })
      });
    })
  }

  goBack(){
    this._location.back();
  }

  ngOnDestroy(): void {
    this.subjectSub.unsubscribe();
    this.socketSub.unsubscribe();    
    
    if(this.realDataWebSocket){
      this.isPageDestroyed = true;
      this.realDataWebSocket.complete()
    }
  }


}
