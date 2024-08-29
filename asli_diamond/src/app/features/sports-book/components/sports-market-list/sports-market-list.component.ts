import { ChangeDetectorRef, Component, HostListener, Input, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { webSocket } from 'rxjs/webSocket';
import * as _ from "lodash";
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { EMarketName, EMarketType } from '@shared/models/shared';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-sports-market-list',
  templateUrl: './sports-market-list.component.html',
  styleUrls: ['./sports-market-list.component.scss']
})
export class SportsMarketListComponent implements OnInit,OnDestroy {
  @ViewChild('accordionExample') accordionExample: ElementRef; // Get reference to the accordion element

  // Close the accordion when clicked outside of it
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.accordionExample.nativeElement.contains(event.target)) {
      const accordions = this.accordionExample.nativeElement.querySelectorAll('.accordion-collapse');
      accordions.forEach(accordion => {
        accordion.classList.remove('show');
      });
    }
  }
  subNavList:any =[];
  inPlayMatchListBySport:any=[];
  upComingMatchListBySport:any=[];
  loadUpcomingMarkets = false;
  loadingEvents = true;
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

  sports:string;
  isBetSlipShow:boolean = false;
  isLoggedIn:boolean = false;
  isBetSlipActive:boolean = false;
  betSlipObj:any = {};
  booksForMarket:any;
  placeBetData:any;
  isMobileView:boolean;
  subjectSub:Subscription;
  socketSub:Subscription;
  isSocketCompleted = false;
  matchedBets :any[] = [];
  unMatchedBets :any[] = [];
  EMarketType:typeof EMarketType = EMarketType;
  @Input() showMAtchwiseBet = ''

  allTabState:any={
    liveUpcoming: true,
    leagues: false,
    results: false,
  };

  @HostListener('document:visibilitychange', ['$event'])
  onVisibilityChange(event: Event) {
    if (!document.hidden && this.isMobileView) {
        this.restartWebpage();
    }
  }

  constructor(
    private _sharedService: SharedService,
    private _route: ActivatedRoute,
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
        this.isSocketCompleted = false;
      }
    });

    this.isMobileViewCallInit();
    this.isBetSlipShow = this.isLoggedIn = this._sharedService.isLoggedIn() && this._sharedService.isUserActive();
    this._route.params.subscribe(routeParams =>{
      this.allTabState={
        liveUpcoming: true,
        leagues: false,
        results: false,
      };
      this.sports = routeParams.sports;
      this.getSubNavBySportsList();
      // this.initConfig();
      this.getInPlayUpcomingData();
    })

    this.socketSub = this._sharedService.socketUrlSubject.subscribe(res=>{
      if(res){
        this.realDataWebSocket = webSocket(res['url']);
        this._getWebSocketUrl();
      }
    })

    this.subjectSub = this._sharedService.getUserBalanceMarket.subscribe(res=>{
      this.placeBetData = [];
      if(this.inPlayMatchListBySport.length > 0 && this.isLoggedIn) this.getBooksForMarket(this.inPlayMatchListBySport);
    })
  }

  ngAfterContentChecked() {
    this._sharedService.marketBookCalSubject.subscribe(res=>{
      this.placeBetData = res;
    })
    this._cdref.detectChanges();
  }

  isMobileViewCallInit(){
    this.isMobileView =  this._sharedService.isMobileViewFn();
    if(this.isMobileView) this._closeBetSlipWindowForMobile();
    this._sharedService.isMobileView.subscribe((res:any)=>{
      this.isMobileView = res;
    })
  }


  restartWebpage() {
    // console.log('get socket')
    // this._getWebSocketUrl();
    if(this.isSocketCompleted){
      console.log('restart')
      this._subscribeWebSocket()
    }
  }

  private _closeBetSlipWindowForMobile(){
    this._sharedService.isMobileViewCancel.subscribe(()=>{
      this.betSlipObj['selectionId'] = '';
    })
  }



  onClickTab(activeTab){
    switch(activeTab){
      case 'liveUpcoming':
        this.allTabState={
          liveUpcoming: true,
          leagues: false,
          results: false,
        };
      break;

      case 'leagues':
        this.allTabState={
          liveUpcoming: false,
          leagues: true,
          results: false,
        };
      break;

      case 'results':
        this.allTabState={
          liveUpcoming: false,
          leagues: false,
          results: true,
        };
      break;
    }
  }

  getSubNavBySportsList(){
    // this._sharedService._postTourListApi({name:this.sports}).subscribe((tourListRes:any)=>{
    //   if(tourListRes?.length >0){
    //     let updatedTourList = tourListRes.map((singleObj:any)=>(
    //       {
    //         'id':singleObj['tournamentId'],
    //         'name':singleObj['tournamentName']
    //       }
    //     ));
    //     this.subNavList = updatedTourList;
    //   }
    // });
  }

  getInPlayUpcomingData(){

    this.loadUpcomingMarkets = true;
    this.loadingEvents = true;
    this._sharedService._postInPlayUpcomingApi({sportName:this.sports}).subscribe((res:any)=>{
     
      if(res?.inPlayUpcomingMarket && (res['inPlayUpcomingMarket']['inPlayMarkets'].length > 0
        || res['inPlayUpcomingMarket']['upComingMarkets'].length > 0)){

         res['inPlayUpcomingMarket']['inPlayMarkets'].map(sportsObj =>{
          sportsObj['isExpand'] = true;
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

        this.inPlayMatchListBySport = res['inPlayUpcomingMarket']['inPlayMarkets'];

        this.upComingMatchListBySport = res['inPlayUpcomingMarket']['upComingMarkets'];

        let setObj = {
          set:{
            deviceId:sessionStorage.getItem('deviceId'),
            centralIdList:_.concat(this.setOrUnsetWebSocketParamsObj['inplay']['centralIds'],this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds'])
            }
          }
        
        if(this.inPlayMatchListBySport.length > 0 && this.isLoggedIn) this.getBooksForMarket(this.inPlayMatchListBySport);
      }
        this.loadUpcomingMarkets = false;
        this.loadingEvents = false;
    })
  }

  _getWebSocketUrl(){
    console.log('sub called')
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
                // sportsObj['market']['appMarketStatus'] = singleWebSocketMarketData['ip'];
                if(singleWebSocketMarketData['ip'] == 1){
                  this.getInPlayUpcomingData();
                }

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
        if(!this.isPageDestroyed)this._subscribeWebSocket();
      }, // Called if at any point WebSocket API signals some kind of error.
      () => {
        console.log('complete')
        if(!this.isPageDestroyed){
          this._subscribeWebSocket();
          this.isSocketCompleted = true;
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
        "minBet": marketData['market']['minBet'],
        "maxBet": marketData['market']['maxBet'],
        "marketDelay": marketData['marketDelay']
    }
  }

  ngOnDestroy(): void {
    this.subjectSub.unsubscribe();
    if(this.realDataWebSocket){
      this.isPageDestroyed = true;
      this.realDataWebSocket.complete()
    }

    this.socketSub.unsubscribe();
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



  cancelBet(betListObj:any,marketType:string,cancelBetLevel:any){
    let betList:any = [];
    switch(cancelBetLevel){
      case 1:
        if(betListObj.length >0 && betListObj[0]['markets'].length >0){
          betListObj[0]['markets'].map((singleMarket)=>{
            singleMarket.runners.map((singleRunner) =>{
              singleRunner.bets.map((singleBet) =>{
                betList.push(singleBet['betId']);
              })
            })
          })
        }
      break;

      case 2:
        if(betListObj['runners'].length >0){
          betListObj.runners.map((singleRunner) =>{
            singleRunner.bets.map((singleBet) =>{
              betList.push(singleBet['betId']);
            })
          })
        }
      break;

      case 3:
        if(betListObj?.betId) betList.push(betListObj.betId);
      break;

    }


    let betIdObj = {
      betIdList: betList
    }
    this._sharedService.postCancelBetForMarket(betIdObj).subscribe((res)=>{
      this._sharedService.getToastPopup('Successfully Bet Cancelled','Bet Cancelled','success');
      marketType = marketType.toUpperCase();
      this._sharedService.getUserBalance.next();
        switch(marketType){
          case EMarketName.MATCH_ODDS_UNDERSCORE:
          case EMarketName.MATCH_ODDS_SPACE:
            this._sharedService.getUserBalanceMarket.next({'marketType': EMarketType.MATCH_TYPE});
          break;

          case EMarketName.BOOKMAKER:
            this._sharedService.getUserBalanceMarket.next({'marketType': EMarketType.BOOKMAKER_TYPE});
          break;

          case EMarketName.FANCY:
            this._sharedService.getUserBalanceMarket.next({'marketType': EMarketType.FANCY_TYPE});
          break;

          case 'ALL':
            this._sharedService.getUserBalanceMarket.next({'marketType': EMarketType.MATCH_TYPE});
            this._sharedService.getUserBalanceMarket.next({'marketType': EMarketType.BOOKMAKER_TYPE});
            this._sharedService.getUserBalanceMarket.next({'marketType': EMarketType.FANCY_TYPE});
          break;
        }

        this._getUserOpenBet();
    })
  }

  _getUserOpenBet(){
    this._sharedService._getUserOpenBetsApi().subscribe(
      (res:any) => {
        res.userBets.forEach(bet=>{
          if(this.showMAtchwiseBet) bet.bets = bet.bets.filter(b => b.matchName == this.showMAtchwiseBet)
          if(bet.status == "EXECUTION_COMPLETE"){
            this.matchedBets = bet.bets
          }else{
            this.unMatchedBets = bet.bets
            this._sharedService.unmatchedBetsList = bet.bets;
          }
        })
      })
   }


}
