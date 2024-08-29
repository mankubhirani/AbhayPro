import { ChangeDetectorRef, Component, HostListener, Input, OnInit, SimpleChanges, ElementRef, ViewChild  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { webSocket } from 'rxjs/webSocket';
import * as _ from "lodash";
import {Location} from '@angular/common';
import { EMarketName, EMarketType } from '@shared/models/shared';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-match-market-list',
  templateUrl: './match-market-list.component.html',
  styleUrls: ['./match-market-list.component.scss']
})
export class MatchMarketListComponent implements OnInit {
  accordionExample: ElementRef;
  fancyInterval:any;
  customBookmakerMarkets: any = [];
  userDetails: any;
  pageHidden = false;

  ngAfterViewInit() {
    this.accordionExample = new ElementRef(document.getElementById('accordionExample'));
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.accordionExample && !this.accordionExample.nativeElement.contains(event.target)) {
      const accordions = this.accordionExample.nativeElement.querySelectorAll('.accordion-collapse');
      accordions.forEach(accordion => {
        accordion.classList.remove('show');
      });
    }
  }


  @HostListener('document:visibilitychange', ['$event'])
  onVisibilityChange(event: Event) {
    if (!document.hidden && this.isMobileView) {
        this.restartWebpage();
        this.pageHidden = false;
    }
    if (document.hidden && this.isMobileView) {
      this.pageHidden = true;
    }
  }

  subNavList:any =[];
  inPlayUpcomingMarket:any=[];
  bookMakerMarket:any=[];
  fancyMarket:any=[];
  customFancyMarket:any=[];
  lineMarket:any[] = [];
  fancyDelay = 0;
  lineDelay = 0;
  isPageDestroyed = false;
  matchOddRate:any = null;
  bookmakerRate:any = null;
  matchOddRunner:any = [];
  bookmakerRunner:any = null;

  realDataWebSocket:any;
  realCustomDataWebSocket:any;
  webSocketUrl:string;
  setOrUnsetWebSocketParamsObj:any = {
    match:{
      centralIds:[]
    },
    bookMaker:{
      centralIds:[]
    },
    fancy:{
      centralIds:[]
    }
  };
  setResponse:any= {};

  tourId:any;
  matchId:any;
  matchName:string = 'NO MATCH AVAILABLE';

  isBetSlipShow:boolean = false;
  isLoggedIn:boolean = false;

  isBetSlipActive:boolean = false;
  betSlipObj:any = {};
  sports:string;

  EMarketType:typeof EMarketType = EMarketType;
  marketType = EMarketType.MATCH_TYPE;
  placeBetData:any;
  booksForMarket:any;
  booksForBookMakerMarket:any;
  ladderObj:any = {};
  isTVEnable:boolean = false;
  isScoreBoardEnable:boolean = false;
  isMatchLive:number =0;
  isFancyCardShow:boolean = false;
  isLineCardShow = false;
  isMobileView:boolean;
  liveScoreBoardUrl:any;
  liveScoreBoardActaulUrl:any;
  liveScoreBoardActaulTVUrl:any;
  liveStreamingTVUrl:any;
  matchedBets :any[] = [];
  unMatchedBets :any[] = [];
  subjectSub:Subscription;


  showFancyMarkets = true;
  showBookmakerMarkets = true;
  showMatchOddMarkets = true;
  showCustomBookmakerMarkets = true;
  showCustomFancyMarkets = true;

  dataFlowCheckerInterval:any = false;

  matchOddLastUpdatedAt = new Date();
  bookmakerLastUpdatedAt = new Date();
  fancyLastUpdatedAt = new Date();
  customBookmakerLastUpdatedAt = new Date();
  customFancyLastUpdatedAt = new Date();
  socketSub:Subscription;
  isSocketCompleted = false;



  @Input() showMAtchwiseBet = ''

  constructor(
    private _sharedService: SharedService,
    private _route: ActivatedRoute,
    private _location: Location,
    private _cdref: ChangeDetectorRef,
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.isSocketCompleted = false;
    this._route.params.subscribe(routeParams =>{
      this.sports = routeParams.sports;
      this.tourId = routeParams.tourId;
      this.matchId = routeParams.matchId;
      this.isSocketCompleted = false;
      // this.initConfig();
      this.getInitialMarkets();
    });
    this._preConfig();

    this._sharedService.deletedSuspendedSubject.subscribe((res)=>{
      this._getUserOpenBet();
    });

    // this._sharedService.marketNoticeChanged.subscribe((res)=>{
    //   this.getNoticeForMarket();
    // });

    this._sharedService.markrtStatusChangedSubject.subscribe((res)=>{
      this.getBookMakerData();
      this.getInPlayUpcomingData();
      this.getFancyData(false) //fancy
      this.getCustomMarket();
      this.getCustomFancyMarket();
    });

    this._sharedService.customMarketSubjectSubject.subscribe((res)=>{
      this.getCustomMarket();
      this.getCustomFancyMarket();
    });

    this.userDetails = this._sharedService.getUserDetails();


  }

  ngAfterContentChecked() {
    this._sharedService.marketBookCalSubject.subscribe(res=>{
      this.placeBetData = res;
    })
    this._cdref.detectChanges();
  }

  private _preConfig(){

    this.socketSub = this._sharedService.socketUrlSubject.subscribe(res=>{
      if(res){
        this.realDataWebSocket = webSocket(res['url']);
        // this.realDataWebSocket = webSocket('ws://localhost:8888');
        this._getWebSocketUrl();
      }
    })
    this.realCustomDataWebSocket = webSocket(environment.oddsSocketUrl);
    // this.realDataWebSocket = webSocket('ws://localhost:8888');
    this._subscribeCustomWebSocket();



    this.isMobileViewCallInit();
    // this.checkDataTimingFlow();
    this.isBetSlipShow = this.isLoggedIn = this._sharedService.isLoggedIn() && this._sharedService.isUserActive();
    this.subjectSub = this._sharedService.getUserBalanceMarket.subscribe((res:any)=>{

      switch(res['marketType']){
        case EMarketType.MATCH_TYPE:
          this.placeBetData = [];
          if(this.inPlayUpcomingMarket  && this.isLoggedIn) this.getBooksForMarket({marketIds : [this.inPlayUpcomingMarket['marketId']]},EMarketType.MATCH_TYPE);
          break;

        case EMarketType.BOOKMAKER_TYPE:
          this.placeBetData = [];
          if(this.bookMakerMarket  && this.isLoggedIn) this.getBooksForMarket({marketIds :this.bookMakerMarket.map(singleMarket=>singleMarket.marketId)},EMarketType.BOOKMAKER_TYPE);
          if(this.customBookmakerMarkets && this.isLoggedIn) this.getBooksForMarket({marketIds :this.customBookmakerMarkets.map(singleMarket=>singleMarket.marketId)},EMarketType.BOOKMAKER_TYPE);
          break;

        case EMarketType.FANCY_TYPE:
          if(this.fancyMarket  && this.isLoggedIn) this.getBooksForMarket({marketIds :this.fancyMarket.map(singleMarket=>singleMarket.marketId)},EMarketType.FANCY_TYPE);
          if(this.customFancyMarket  && this.isLoggedIn) this.getBooksForMarket({marketIds :this.customFancyMarket.map(singleMarket=>singleMarket.marketId)},EMarketType.FANCY_TYPE);
          break;

          case EMarketType.LINE_TYPE:
            if(this.lineMarket  && this.isLoggedIn) this.getBooksForMarket({marketIds :this.lineMarket.map(singleMarket=>singleMarket.marketId)},EMarketType.LINE_TYPE);
            break;
      }
      })
      this.getStreamingUrl();
      this._cdref.detectChanges();
  }

  private _closeBetSlipWindowForMobile(){
    this._sharedService.isMobileViewCancel.subscribe(()=>{
      this.betSlipObj['selectionId'] = '';
    })
  }

  restartWebpage() {
    console.log('restart app')
    this.getInitialMarkets();
  }

  isMobileViewCallInit(){
    this.isMobileView =  this._sharedService.isMobileViewFn();
    if(this.isMobileView) this._closeBetSlipWindowForMobile();
    this._sharedService.isMobileView.subscribe((res:any)=>{
      this.isMobileView = res;
    })
  }


  getStreamingUrl(){
    this._sharedService.postLiveStreamForMarket({domain:window.location.hostname,matchId:this.matchId}).subscribe((res:any)=>{
      this.liveScoreBoardActaulUrl =res?.streamObj?.data?.scoreUrl;
      this.liveScoreBoardActaulTVUrl =res?.streamObj?.data?.streamingUrl;
      this._sharedService.liveStreamingTVUrl = this._sanitizer.bypassSecurityTrustResourceUrl(res?.streamObj?.data?.streamingUrl);
      this.liveStreamingTVUrl =  this._sanitizer.bypassSecurityTrustResourceUrl(res?.streamObj?.data?.streamingUrl);
      this.liveScoreBoardUrl = this._sharedService.liveScoreBoardUrl = this._sanitizer.bypassSecurityTrustResourceUrl(res?.streamObj?.data?.scoreUrl);
    })
  }

  getInPlayUpcomingData(){
    this.inPlayUpcomingMarket = null;
    this._sharedService._postInPlayUpcomingApi({matchId:this.matchId}).subscribe((res:any)=>{
      if(res?.inPlayUpcomingMarket && res['inPlayUpcomingMarket']?.matchName){
          this.matchName =  res['inPlayUpcomingMarket']['matchName'];
          this.isMatchLive = res['inPlayUpcomingMarket']['inPlayStatus'];
          this.setOrUnsetWebSocketParamsObj['match']['centralIds'].push(res['inPlayUpcomingMarket']['centralId']);

          if(res['inPlayUpcomingMarket']['runnerStatus']){
          for(let rnr of res['inPlayUpcomingMarket']['runners']){

            for(let rnrStatus of res['inPlayUpcomingMarket']['runnerStatus']){
              if(rnr.SelectionId == rnrStatus.SelectionId){
                rnr['isSuspended'] = rnrStatus['isSuspended']
              }
            }
          }
        }

          res['inPlayUpcomingMarket']['runners'].map(runnerRes=>{
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
        //merge both centralId
        this.inPlayUpcomingMarket = res['inPlayUpcomingMarket'];
        let setObj = {
          set:{
            deviceId:sessionStorage.getItem('deviceId'),
            centralIdList:this.setOrUnsetWebSocketParamsObj['match']['centralIds']
            }
          }

        if(this.inPlayUpcomingMarket && this.isLoggedIn) this.getBooksForMarket({marketIds : [this.inPlayUpcomingMarket['marketId']]},EMarketType.MATCH_TYPE);
      }
    })
  }


  getLineMarkets(){

    // this._sharedService._postLineApi({matchId:this.matchId}).subscribe((res:any)=>{

    //   if(res){
    //     this.lineDelay = res[0].fancyDelay
    //       res.map(sportsObj=>{
    //         return sportsObj['runners'].map(runnerRes=>{
    //           if((runnerRes['batb'] == undefined) || (runnerRes['batl'] == undefined)){
    //             runnerRes['back0'] ='';
    //             runnerRes['vback0'] ='';

    //             runnerRes['back1'] =  '';
    //             runnerRes['vback1'] = '';

    //             runnerRes['back2'] ='';
    //             runnerRes['vback2'] = '';

    //             runnerRes['lay0'] = '';
    //             runnerRes['vlay0'] = '';

    //             runnerRes['lay1'] =  '';
    //             runnerRes['vlay1'] = '';

    //             runnerRes['lay2'] = '';
    //             runnerRes['vlay2'] = '';

    //           }else{
    //               runnerRes['back0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['odds']: '';
    //               runnerRes['vback0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['tv']:'';

    //               runnerRes['back1'] = runnerRes['batb'][1] !== undefined ? runnerRes['batb'][1]['odds']: '';
    //               runnerRes['vback1'] = runnerRes['batb'][1] !== undefined ? runnerRes['batb'][1]['tv']:'';

    //               runnerRes['back2'] = runnerRes['batb'][2] !== undefined ? runnerRes['batb'][2]['odds']: '';
    //               runnerRes['vback2'] = runnerRes['batb'][2] !== undefined ? runnerRes['batb'][2]['tv']:'';

    //               runnerRes['lay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['odds']: '';
    //               runnerRes['vlay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['tv']:'';

    //               runnerRes['lay1'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['odds']: '';
    //               runnerRes['vlay1'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['tv']:'';

    //               runnerRes['lay2'] = runnerRes['batl'][2] !== undefined ? runnerRes['batl'][2]['odds']: '';
    //               runnerRes['vlay2'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['tv']:'';
    //           }

    //               runnerRes['suspended'] = true;
    //               return runnerRes;
    //         })
    //       })

    //     this.lineMarket = res;

    //     if(this.lineMarket && this.isLoggedIn) this.getBooksForMarket({marketIds : this.lineMarket.map(singleMarket=>singleMarket.marketId)},EMarketType.LINE_TYPE);
    //   }
    // })
  }

  getBookMakerData(){
    this._sharedService._postBookMakerMarketApi({matchId:this.matchId}).subscribe((res:any)=>{
      if(res.length > 0){

        res.map(sportsObj =>{
          sportsObj['updatedAt'] = new Date().getTime();
          this.setOrUnsetWebSocketParamsObj['bookMaker']['centralIds'].push(sportsObj['centralId']);

          if(sportsObj['runnerStatus']){
            for(let rnr of sportsObj['runners']){
              for(let rnrStatus of sportsObj['runnerStatus']){
                if(rnr.SelectionId == rnrStatus.SelectionId){
                  rnr['isSuspended'] = rnrStatus['isSuspended']
                }
              }
            }
          }


          return sportsObj['runners'].map(runnerRes=>{
            if((runnerRes['batb'] == undefined) || (runnerRes['batl'] == undefined)){
              runnerRes['back1'] = '';
              runnerRes['vback1'] = '';

              runnerRes['lay1'] = '';
              runnerRes['vlay1'] = '';
            }else if(runnerRes['batb']){
              if(runnerRes['batb'][0]!=undefined){
                runnerRes['back0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['odds']: '';
                runnerRes['vback0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['tv']:'';

                runnerRes['lay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['odds']: '';
                runnerRes['vlay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['tv']:'';

                if(runnerRes['back' + 0] == runnerRes['lay' + 0]){
                  runnerRes['showBookMakerSuspended'] = true;
                } else {
                  runnerRes['showBookMakerSuspended'] = false;
                }

                if((runnerRes['back' + 0]>99) || (runnerRes['lay' + 0]>99)){
                  runnerRes['showBookMakerSuspended'] = true;
                } else {
                  runnerRes['showBookMakerSuspended'] = false;
                }
              }
            }

                runnerRes['suspended'] = true;
                return runnerRes;
          })
        })

        this.bookmakerRunner = res[res.length-1]['runners'];
        this.bookmakerRate = res[res.length-1]['lastMarketRate']

        //merge both centralId
        this.bookMakerMarket = res;

        if(this.bookMakerMarket && this.isLoggedIn) this.getBooksForMarket({marketIds :this.bookMakerMarket.map(singleMarket=>singleMarket.marketId)},EMarketType.BOOKMAKER_TYPE);

        this.checkRateDiff();
      }else{
        this.bookMakerMarket = [];
      }
    })
  }






  getFancyData(calledFromTimer){

    this._sharedService._postFancyMarketApi({matchId:this.matchId}).subscribe((res:any)=>{

      if(res.length > 0){
        this.fancyDelay = res[0].fancyDelay
        res.map(sportsObj =>{
          sportsObj['updatedAt'] = new Date().getTime();
          if(sportsObj['appMarketStatus'] !=4 && sportsObj['appMarketStatus'] !=2) this.isFancyCardShow = true;
          this.setOrUnsetWebSocketParamsObj['fancy']['centralIds'].push(sportsObj['centralId']);
                if((sportsObj['batb'] == undefined) || (sportsObj['batl'] == undefined)){
                  sportsObj['back1'] = '';
                  sportsObj['vback1'] = '';

                  sportsObj['lay1'] = '';
                  sportsObj['vlay1'] = '';
                }else{
                  sportsObj['back1'] = sportsObj['batb'][0] !== undefined ? sportsObj['batb'][0]['odds']: '';
                  sportsObj['vback1'] = sportsObj['batb'][0] !== undefined ? sportsObj['batb'][0]['tv']:'';

                  sportsObj['lay1'] = sportsObj['batl'][0] !== undefined ? sportsObj['batl'][0]['odds']: '';
                  sportsObj['vlay1'] = sportsObj['batl'][0] !== undefined ? sportsObj['batl'][0]['tv']:'';
                }

                sportsObj['suspended'] = true;
        })

        if(this.fancyMarket){
          for (let i = this.fancyMarket.length - 1; i >= 0; i--) {
            let newMarket = res.findIndex(mrkt => mrkt.marketId === this.fancyMarket[i].marketId);
            if (newMarket === -1) {
              this.fancyMarket.splice(i, 1);
            }
        }

        const oldFancyMarkets = res.filter(o => this.fancyMarket.some(market => o.marketId === market.marketId));
          if(oldFancyMarkets.length>0){

            for(let market of this.fancyMarket){
              for (let oldMarket of oldFancyMarkets) {
                if(market.marketId == oldMarket.marketId){
                  market.maxBet = oldMarket.maxBet;
                  market.minBet = oldMarket.minBet;
                  market.maxMarketSize = oldMarket.maxMarketSize;
                  market.marketDelay = oldMarket.marketDelay;
                  market.isMarketSuspended = oldMarket.isMarketSuspended
                }
              }
            }
          }


          const newFancyMarkets = res.filter(o => !this.fancyMarket.some(market => o.marketId === market.marketId));
          if(newFancyMarkets.length>0){
            if(newFancyMarkets[0]['refSportName'] == 'Politics'){
              this.matchName =  newFancyMarkets[0]['refMatchName'];
            }
            this.fancyMarket.push(...newFancyMarkets);
          }
          // this.fancyMarket = res;


        }

        if(!calledFromTimer){
          if(this.fancyMarket && this.isLoggedIn) this.getBooksForMarket({marketIds :this.fancyMarket.map(singleMarket=>singleMarket.marketId)},EMarketType.FANCY_TYPE);
        }
      }else{
        this.fancyMarket = [];
      }
    })
  }

  getUpdatedFancyMarketOnInterval(){
    if(this.fancyInterval){
      clearInterval(this.fancyInterval)
    }

   this.fancyInterval =  setInterval(()=>{
      this.getFancyData(true);
    },10000)
  }



  getNoticeForMarket(){
    // this._sharedService.getNoticeForUserApi({matchId:this.matchId}).subscribe((res:any)=>{
    //   if(res.noticeList){
    //     this._updateMarketWithNotice(res.noticeList)
    //   }
    // })
  }



  _getWebSocketUrl(){
    console.log('get match market subed')
    // this.realDataWebSocket = webSocket('ws://localhost:8888');
    this._subscribeWebSocket();
  }


  getInitialMarkets(){
    this.getInPlayUpcomingData(); //in-play
    this.getCustomMarket();
    this.getCustomFancyMarket();
    if(this.sports == "Cricket" || this.sports == "Politics"){
      // this._sharedService.markrtStatusChangedSubject.next(this.getBookMakerData());
      // this.getLineMarkets();
      this.getBookMakerData() //bookmaker
      this.getFancyData(false) //fancy
      this.getUpdatedFancyMarketOnInterval(); // Update Fancy Market every 30 seconds
    }
  }

  getCustomMarket(){
    let body = {
      "matchId": this.matchId,
      "typeId": 12
    }

    this._sharedService._getCustomMarketApi(body).subscribe((res: any)=>{
      // console.log("Res",res);

      if(res.length > 0){
        res.map(sportsObj =>{
          sportsObj['updatedAt'] = new Date().getTime();
          if(sportsObj['runnerStatus']){
            for(let rnr of sportsObj['runners']){
              for(let rnrStatus of sportsObj['runnerStatus']){
                if(rnr.SelectionId == rnrStatus.SelectionId){
                  rnr['isSuspended'] = rnrStatus['isSuspended']
                }
              }
            }
          }

          return sportsObj['runners'].map(runnerRes=>{
            if((runnerRes['batb'] == undefined) || (runnerRes['batl'] == undefined)){
              runnerRes['back1'] = '';
              runnerRes['vback1'] = '';

              runnerRes['lay1'] = '';
              runnerRes['vlay1'] = '';
            }else if(runnerRes['batb']){
              if(runnerRes['batb'][0]!=undefined){
                runnerRes['back0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['odds']: '';
                runnerRes['vback0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['tv']:'';

                runnerRes['lay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['odds']: '';
                runnerRes['vlay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['tv']:'';

                if(runnerRes['back' + 0] == runnerRes['lay' + 0]){
                  runnerRes['showBookMakerSuspended'] = true;
                } else {
                  runnerRes['showBookMakerSuspended'] = false;
                }
              }
            }

                runnerRes['suspended'] = true;
                return runnerRes;
          })
        })
        //merge both centralId
        this.customBookmakerMarkets = res;

        if(this.customBookmakerMarkets && this.isLoggedIn) this.getBooksForMarket({marketIds :this.customBookmakerMarkets.map(singleMarket=>singleMarket.marketId)},EMarketType.BOOKMAKER_TYPE);
      }else{
        this.customBookmakerMarkets = [];
      }

      this.getNoticeForMarket();
    },(err)=>{
      console.log("Err",err);
    })
  }

  getCustomFancyMarket(){
    let body = {
      "matchId": this.matchId,
      "typeId": 10
    }

    this._sharedService._getCustomMarketApi(body).subscribe((res: any)=>{

      if(res.length > 0){
        this.fancyDelay = res[0].fancyDelay
        res.map(sportsObj =>{
          sportsObj['updatedAt'] = new Date().getTime();
          if(sportsObj['appMarketStatus'] !=4 && sportsObj['appMarketStatus'] !=2) this.isFancyCardShow = true;
            if((sportsObj['batb'] == undefined) || (sportsObj['batl'] == undefined)){
              sportsObj['back1'] = '';
              sportsObj['vback1'] = '';

              sportsObj['lay1'] = '';
              sportsObj['vlay1'] = '';
            }else{
              sportsObj['back1'] = sportsObj['batb'][0] !== undefined ? sportsObj['batb'][0]['odds']: '';
              sportsObj['vback1'] = sportsObj['batb'][0] !== undefined ? sportsObj['batb'][0]['tv']:'';

              sportsObj['lay1'] = sportsObj['batl'][0] !== undefined ? sportsObj['batl'][0]['odds']: '';
              sportsObj['vlay1'] = sportsObj['batl'][0] !== undefined ? sportsObj['batl'][0]['tv']:'';
            }

            sportsObj['suspended'] = true;
        })

        if(this.customFancyMarket){
          for (let i = this.customFancyMarket.length - 1; i >= 0; i--) {
            let newMarket = res.findIndex(mrkt => mrkt.marketId === this.customFancyMarket[i].marketId);
            if (newMarket === -1) {
              this.customFancyMarket.splice(i, 1);
            }
        }

        const oldFancyMarkets = res.filter(o => this.customFancyMarket.some(market => o.marketId === market.marketId));

          if(oldFancyMarkets.length>0){

            for(let market of this.customFancyMarket){
              for (let oldMarket of oldFancyMarkets) {
                if(market.marketId == oldMarket.marketId){
                  market.maxBet = oldMarket.maxBet;
                  market.minBet = oldMarket.minBet;
                  market.maxMarketSize = oldMarket.maxMarketSize;
                  market.marketDelay = oldMarket.marketDelay;
                  market.isMarketSuspended = oldMarket.isMarketSuspended
                }
              }
            }
          }

          const newFancyMarkets = res.filter(o => !this.customFancyMarket.some(market => o.marketId === market.marketId));
          if(newFancyMarkets.length>0){
            this.customFancyMarket.push(...newFancyMarkets);
          }

          this.customFancyMarket.sort((a,b)=>a.sequenceNo - b.sequenceNo);

          if(this.customFancyMarket && this.isLoggedIn) this.getBooksForMarket({marketIds :this.customFancyMarket.map(singleMarket=>singleMarket.marketId)},EMarketType.FANCY_TYPE);

        }
      }else{
        this.customFancyMarket = []
      }

      this.getNoticeForMarket();
    })
    /*
    this._sharedService._getCustomMarketApi(body).subscribe((res: any)=>{
      console.log("Res",res);

      if(res.length > 0){
        res.map(sportsObj =>{

          if(sportsObj['runnerStatus']){
            for(let rnr of sportsObj['runners']){
              for(let rnrStatus of sportsObj['runnerStatus']){
                if(rnr.SelectionId == rnrStatus.SelectionId){
                  rnr['isSuspended'] = rnrStatus['isSuspended']
                }
              }
            }
          }

          return sportsObj['runners'].map(runnerRes=>{
            if((runnerRes['batb'] == undefined) || (runnerRes['batl'] == undefined)){
              runnerRes['back1'] = '';
              runnerRes['vback1'] = '';

              runnerRes['lay1'] = '';
              runnerRes['vlay1'] = '';
            }else if(runnerRes['batb']){
              if(runnerRes['batb'][0]!=undefined){
                runnerRes['back0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['odds']: '';
                runnerRes['vback0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['tv']:'';

                runnerRes['lay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['odds']: '';
                runnerRes['vlay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['tv']:'';

                if(runnerRes['back' + 0] == runnerRes['lay' + 0]){
                  runnerRes['showBookMakerSuspended'] = true;
                } else {
                  runnerRes['showBookMakerSuspended'] = false;
                }
              }
            }

                runnerRes['suspended'] = true;
                return runnerRes;
          })
        })
        //merge both centralId
        this.customBookmakerMarkets = res;

        if(this.customBookmakerMarkets && this.isLoggedIn) this.getBooksForMarket({marketIds :this.customBookmakerMarkets.map(singleMarket=>singleMarket.marketId)},EMarketType.BOOKMAKER_TYPE);
      }



    },(err)=>{
      console.log("Err",err);
    })*/
  }




  // private checkDataTimingFlow(){
  //   this.dataFlowCheckerInterval = setInterval(()=>{

  //     const nowTime = new Date();

  //     const lastMatchOddTime = this.matchOddLastUpdatedAt.getTime();
  //     const lastbookmakerTime = this.bookmakerLastUpdatedAt.getTime();
  //     const lastFancyTime = this.fancyLastUpdatedAt.getTime();
  //     const lastCustomBookmakerTime = this.customBookmakerLastUpdatedAt.getTime();
  //     const lastCustomFancyTime = this.customFancyLastUpdatedAt.getTime();

  //     const differenceInSecondsMatchOdd = Math.abs((nowTime.getTime() - lastMatchOddTime) / 1000);
  //     const differenceInSecondsBookmaker = Math.abs((nowTime.getTime() - lastbookmakerTime) / 1000);
  //     const differenceInSecondsFancy = Math.abs((nowTime.getTime() - lastFancyTime) / 1000);
  //     const differenceInSecondsCustomFancy = Math.abs((nowTime.getTime() - lastCustomFancyTime) / 1000);
  //     const differenceInSecondsCustomBookmaker = Math.abs((nowTime.getTime() - lastCustomBookmakerTime) / 1000);

  //     // console.log('diff in match odd',differenceInSecondsMatchOdd)
  //     // console.log('diff in bookmaker',differenceInSecondsBookmaker)
  //     // console.log('diff in fancy',differenceInSecondsFancy)
  //     // console.log('diff in custom fancy',differenceInSecondsCustomFancy)
  //     // console.log('diff in custom bookmaker',differenceInSecondsCustomBookmaker)

  //     if(differenceInSecondsMatchOdd > 60){
  //       this.showMatchOddMarkets = false;
  //     }else{
  //       this.showMatchOddMarkets = true;
  //     }

  //     if(differenceInSecondsBookmaker > 60){
  //       this.showBookmakerMarkets = false;
  //     }else{
  //       this.showBookmakerMarkets = true;
  //     }

  //     if(differenceInSecondsFancy > 60){
  //       this.showFancyMarkets = false;
  //     }else{
  //       this.showFancyMarkets = true;
  //     }

  //     if(differenceInSecondsCustomFancy > 60){
  //       this.showCustomFancyMarkets = false;
  //     }else{
  //       this.showCustomFancyMarkets = true;
  //     }

  //     if(differenceInSecondsCustomBookmaker > 60){
  //       this.showCustomBookmakerMarkets = false;
  //     }else{
  //       this.showCustomBookmakerMarkets = true;
  //     }

  //   },15000)

  // }

  private _updateMarketData(data: any) {

    this.checkRateDiff();

    let parseData = JSON.parse(data);
    if(parseData.hasOwnProperty('data') && typeof parseData?.data !== 'string'){
      let webSocketData = parseData['data'];
      if(this.inPlayUpcomingMarket?.matchName){
            let singleWebSocketMarketData = _.find(webSocketData, ['bmi', this.inPlayUpcomingMarket['marketId']]);

            if(singleWebSocketMarketData != undefined){
              this.matchOddRate = singleWebSocketMarketData;
              this.matchOddRunner = this.inPlayUpcomingMarket['runners'];
              this.inPlayUpcomingMarket['appMarketStatus'] = singleWebSocketMarketData['ms'];
              this.showMatchOddMarkets = true;
              this.matchOddLastUpdatedAt = new Date();
              for(let rnr of this.inPlayUpcomingMarket['runners']){
                rnr['back0'] = null;
                rnr['back1'] = null;
                rnr['back2'] = null;
                rnr['lay0'] = null;
                rnr['lay1'] = null;
                rnr['lay2'] = null;
                rnr['vback0'] = null;
                rnr['vback1'] = null;
                rnr['vback2'] = null;
                rnr['vlay0'] = null;
                rnr['vlay1'] = null;
                rnr['vlay2'] = null;
              }

              this.inPlayUpcomingMarket['inPlayStatus'] = singleWebSocketMarketData['ip'];
              this.inPlayUpcomingMarket['runners'].map((runnerRes) => {
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
                return runnerRes;
              })
            }
      }


      if(this.lineMarket){
        this.lineMarket.map(singleLineMarket=>{
          let singleWebSocketMarketData = _.find(webSocketData, ['bmi', singleLineMarket['marketId']]);

        if(singleWebSocketMarketData != undefined){
          singleLineMarket['appMarketStatus'] = singleWebSocketMarketData['ms'];

          for(let rnr of singleLineMarket['runners']){
            rnr['back0'] = null;
            rnr['back1'] = null;
            rnr['back2'] = null;
            rnr['lay0'] = null;
            rnr['lay1'] = null;
            rnr['lay2'] = null;
            rnr['vback0'] = null;
            rnr['vback1'] = null;
            rnr['vback2'] = null;
            rnr['vlay0'] = null;
            rnr['vlay1'] = null;
            rnr['vlay2'] = null;
          }

          singleLineMarket['inPlayStatus'] = singleWebSocketMarketData['ip'];
          singleLineMarket['runners'].map((runnerRes) => {
            let webSocketRunners = _.filter(singleWebSocketMarketData?.['rt'], ['ri', runnerRes['SelectionId']]);
            for (let singleWebsocketRunner of webSocketRunners) {
              if (singleWebsocketRunner['ib']) {
                //back

                //Live Rate
                runnerRes['back' + singleWebsocketRunner['pr']] = Math.round(singleWebsocketRunner['rt']);

                //Volume from Betfair
                runnerRes['vback' + singleWebsocketRunner['pr']] = singleWebsocketRunner['bv'];

              } else {
                //lay

                //Live Rate
                runnerRes['lay' + singleWebsocketRunner['pr']] = Math.round(singleWebsocketRunner['rt']);

                //Volume from Betfair
                runnerRes['vlay' + singleWebsocketRunner['pr']] = singleWebsocketRunner['bv'];

              }
            }
            return runnerRes;
          })
        }
        })

      }

      if(this.bookMakerMarket){
        this.bookMakerMarket.map(bookMakerObj=>{
          let singleWebSocketMarketDataBook = _.find(webSocketData, ['bmi', +bookMakerObj['marketId']]);
          if(singleWebSocketMarketDataBook != undefined){

            this.bookmakerRate = singleWebSocketMarketDataBook;
            this.bookmakerRunner = bookMakerObj['runners'];

            this.showBookmakerMarkets = true;
            this.bookmakerLastUpdatedAt = new Date();

            bookMakerObj['appMarketStatus'] = singleWebSocketMarketDataBook['ms'];
            bookMakerObj['updatedAt'] = new Date().getTime();

            for(let rnr of bookMakerObj['runners']){
              rnr['back0'] = null;
              rnr['lay0'] = null;
              rnr['vback0'] = null;
              rnr['vlay0'] = null;
            }

            return bookMakerObj['runners'].map((runnerRes) => {

              runnerRes['SelectionId'] = runnerRes['SelectionId'].toString();
              let webSocketRunnersBook = _.filter(singleWebSocketMarketDataBook?.['rt'], ['ri', runnerRes['SelectionId']]);
              for (let singleWebsocketRunnerBook of webSocketRunnersBook) {
                // runnerRes['status'] = singleWebsocketRunnerBook['st'];

                if (singleWebsocketRunnerBook['ib']) {
                  //back
                  runnerRes['showBookMakerSuspended'] = false;

                  //Live Rate
                  if(singleWebsocketRunnerBook['rt']){
                    runnerRes['back' + 0] = singleWebsocketRunnerBook['rt']>1?+((singleWebsocketRunnerBook['rt']-1)*100).toFixed(2):+((1-singleWebsocketRunnerBook['rt'])*100).toFixed(2);
                  }else{
                    runnerRes['back' + 0] = null;
                  }

                  //Volume from Betfair

                  if(singleWebsocketRunnerBook['bv']){
                    runnerRes['vback' + 0] = singleWebsocketRunnerBook['bv'];
                  }else{
                    runnerRes['vback' + 0] = null;
                  }

                } else {
                  //lay
                  runnerRes['showBookMakerSuspended'] = false;
                  //Live Rate
                  if(singleWebsocketRunnerBook['rt']){
                    runnerRes['lay' + 0] = singleWebsocketRunnerBook['rt']>1?+((singleWebsocketRunnerBook['rt']-1)*100).toFixed(2):+((1-singleWebsocketRunnerBook['rt'])*100).toFixed(2);
                  }else{
                    runnerRes['lay' + 0] = null;
                  }

                  //Volume from Betfair

                  if(singleWebsocketRunnerBook['bv']){
                    runnerRes['vlay' + 0] = singleWebsocketRunnerBook['bv'];
                  }else{
                    runnerRes['vlay' + 0] = null;
                  }
                }
                // console.log('runnerRes[back0]',runnerRes['back' + 0],'---',runnerRes['lay' + 0]);
                if(runnerRes['back' + 0] == runnerRes['lay' + 0]){
                  runnerRes['showBookMakerSuspended'] = true;
                } else {
                  runnerRes['showBookMakerSuspended'] = false;
                }

                if((runnerRes['back' + 0]>99) || (runnerRes['lay' + 0]>99)){
                  runnerRes['showBookMakerSuspended'] = true;
                } else {
                  runnerRes['showBookMakerSuspended'] = false;
                }
              }
              return runnerRes;
            })
          }
        })
      }

      if(this.fancyMarket){
        this.fancyMarket.map(fancyMarketObj=>{
          let singleWebSocketMarketDataBook = _.find(webSocketData, ['bmi', +fancyMarketObj['marketId']]);
              if(singleWebSocketMarketDataBook != undefined){

                this.showFancyMarkets = true;
                this.fancyLastUpdatedAt = new Date();

                fancyMarketObj['appMarketStatus'] = singleWebSocketMarketDataBook['ms'];
                fancyMarketObj['updatedAt'] = new Date().getTime();

                if(fancyMarketObj['appMarketStatus'] !=4 && fancyMarketObj['appMarketStatus'] !=2) this.isFancyCardShow = true;
                fancyMarketObj['SelectionId'] = fancyMarketObj['SelectionId']?.toString();
                let webSocketRunnersBook = _.filter(singleWebSocketMarketDataBook?.['rt'], ['ri', fancyMarketObj['SelectionId']]);
                for (let singleWebsocketRunnerBook of webSocketRunnersBook) {
                  if (singleWebsocketRunnerBook['ib']) {
                    //back

                    //Live Rate
                    fancyMarketObj['back' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['rt'];

                    //Volume from Betfair
                    fancyMarketObj['vback' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['pt'];

                  } else {
                    //lay

                    //Live Rate
                    fancyMarketObj['lay' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['rt'];

                    //Volume from Betfair
                    fancyMarketObj['vlay' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['pt'];

                  }
                }
                return fancyMarketObj;
              }
        })
      }

      if(this.customFancyMarket){
        this.customFancyMarket.map(fancyMarketObj=>{
          let singleWebSocketMarketDataBook = _.find(webSocketData, ['bmi', fancyMarketObj['marketId']]);
              if(singleWebSocketMarketDataBook != undefined){

                this.showCustomFancyMarkets = true;
                this.customFancyLastUpdatedAt = new Date();

                fancyMarketObj['appMarketStatus'] = singleWebSocketMarketDataBook['ms'];
                fancyMarketObj['updatedAt'] = new Date().getTime();


                if(fancyMarketObj['appMarketStatus'] !=4 && fancyMarketObj['appMarketStatus'] !=2) this.isFancyCardShow = true;
                fancyMarketObj['SelectionId'] = fancyMarketObj['SelectionId']?.toString();
                let webSocketRunnersBook = _.filter(singleWebSocketMarketDataBook?.['rt'], ['ri', fancyMarketObj['SelectionId']]);
                for (let singleWebsocketRunnerBook of webSocketRunnersBook) {
                  if (singleWebsocketRunnerBook['ib']) {
                    //back

                    //Live Rate
                    fancyMarketObj['back' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['rt'];

                    //Volume from Betfair
                    fancyMarketObj['vback' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['pt'];

                  } else {
                    //lay

                    //Live Rate
                    fancyMarketObj['lay' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['rt'];

                    //Volume from Betfair
                    fancyMarketObj['vlay' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['pt'];

                  }
                }
                return fancyMarketObj;
              }
        })
      }

      if(this.customBookmakerMarkets){
        this.customBookmakerMarkets.map(bookMakerObj=>{
          let singleWebSocketMarketDataBook = _.find(webSocketData, ['bmi', bookMakerObj['marketId']]);

          if(singleWebSocketMarketDataBook != undefined){

            this.showCustomBookmakerMarkets = true;
            this.customBookmakerLastUpdatedAt = new Date();
            bookMakerObj['updatedAt'] = new Date().getTime();

            bookMakerObj['appMarketStatus'] = singleWebSocketMarketDataBook['ms'];
            bookMakerObj['inPlayStatus'] = singleWebSocketMarketDataBook['ip'];

            for(let rnr of bookMakerObj['runners']){
              rnr['back0'] = null;
              rnr['lay0'] = null;
              rnr['vback0'] = null;
              rnr['vlay0'] = null;
            }

            return bookMakerObj['runners'].map((runnerRes) => {

              runnerRes['SelectionId'] = runnerRes['SelectionId'].toString();
              let webSocketRunnersBook = _.filter(singleWebSocketMarketDataBook?.['rt'], ['ri', runnerRes['SelectionId']]);
              for (let singleWebsocketRunnerBook of webSocketRunnersBook) {
                // runnerRes['status'] = singleWebsocketRunnerBook['st'];

                if (singleWebsocketRunnerBook['ib']) {
                  //back
                  runnerRes['showBookMakerSuspended'] = false;

                  //Live Rate
                  if(singleWebsocketRunnerBook['rt']){
                    //runnerRes['back' + 0] = singleWebsocketRunnerBook['rt']>1?+((singleWebsocketRunnerBook['rt']-1)*100).toFixed(0):+((1-singleWebsocketRunnerBook['rt'])*100).toFixed(0);
                    if (singleWebsocketRunnerBook['rt'] > 1) {
                      runnerRes['back0'] = ((singleWebsocketRunnerBook['rt'] - 1) * 100).toFixed(2);
                    } else {
                      runnerRes['back0'] = ((1 - singleWebsocketRunnerBook['rt']) * 100).toFixed(2);
                    }
                    if (runnerRes['back0'] % 1 === 0 || runnerRes['back0'] % 1 === 0.0) {
                      runnerRes['back0'] = Math.floor(runnerRes['back0']);
                    }
                  }else{
                    runnerRes['back' + 0] = null;
                  }

                  //Volume from Betfair

                  if(singleWebsocketRunnerBook['bv']){
                    runnerRes['vback' + 0] = singleWebsocketRunnerBook['bv'];
                  }else{
                    runnerRes['vback' + 0] = null;
                  }

                } else {
                  //lay
                  runnerRes['showBookMakerSuspended'] = false;
                  //Live Rate
                  if(singleWebsocketRunnerBook['rt']){
                    //runnerRes['lay' + 0] = singleWebsocketRunnerBook['rt']>1?+((singleWebsocketRunnerBook['rt']-1)*100).toFixed(0):+((1-singleWebsocketRunnerBook['rt'])*100).toFixed(0);
                    if (singleWebsocketRunnerBook['rt'] > 1) {
                      runnerRes['lay0'] = ((singleWebsocketRunnerBook['rt'] - 1) * 100).toFixed(2);
                    } else {
                      runnerRes['lay0'] = ((1 - singleWebsocketRunnerBook['rt']) * 100).toFixed(2);
                    }
                    if (runnerRes['lay0'] % 1 === 0 || runnerRes['lay0'] % 1 === 0.0) {
                      runnerRes['lay0'] = Math.floor(runnerRes['lay0']);
                    }
                  }else{
                    runnerRes['lay' + 0] = null;
                  }

                  //Volume from Betfair

                  if(singleWebsocketRunnerBook['bv']){
                    runnerRes['vlay' + 0] = singleWebsocketRunnerBook['bv'];
                  }else{
                    runnerRes['vlay' + 0] = null;
                  }
                }
                // console.log('runnerRes[back0]',runnerRes['back' + 0],'---',runnerRes['lay' + 0]);
                if(runnerRes['back' + 0] == runnerRes['lay' + 0]){
                  runnerRes['showBookMakerSuspended'] = true;
                } else {
                  runnerRes['showBookMakerSuspended'] = false;
                }

              }
              return runnerRes;
            })
          }
        })
      }
    }
  }



  private _updateMarketWithNotice(noticeMessageList:any){
    if(this.customFancyMarket){
      this.customFancyMarket.map(fancyMarketObj=>{
        fancyMarketObj['marketNotice'] = noticeMessageList.filter(nm=>nm.marketId == fancyMarketObj['marketId'])[0]?.marketNotice;
        return fancyMarketObj;
      })
    }

    if(this.customBookmakerMarkets){
      this.customBookmakerMarkets.map(fancyMarketObj=>{
        fancyMarketObj['marketNotice'] = noticeMessageList.filter(nm=>nm.marketId == fancyMarketObj['marketId'])[0]?.marketNotice;
        return fancyMarketObj;
      })
    }
  }



  checkRateDiff(){

    let matchOddRateRunnerWise:any = [];
    let bookmakerRateRunnerWise:any = [];

    if(this.matchOddRate){
      if(this.matchOddRunner && this.matchOddRate.rt){
        for(let rnr of this.matchOddRunner){
            let runnerBackArray = this.matchOddRate.rt.filter(si=>si.ri == rnr.SelectionId && si.ib==true);
            let runnerLayArray = this.matchOddRate.rt.filter(si=>si.ri == rnr.SelectionId && si.ib==false);

            if(runnerBackArray[0]){
              matchOddRateRunnerWise.push({runnername:rnr.RunnerName,backRate:runnerBackArray[0].rt,selectionId:rnr.SelectionId})
            }

            if(runnerLayArray[0]){
              matchOddRateRunnerWise.push({runnername:rnr.RunnerName,layRate:runnerLayArray[0].rt,selectionId:rnr.SelectionId})
            }
      }
      }
    }


    if(this.bookmakerRate){
      if(this.bookmakerRunner && this.bookmakerRate.rt){
        for(let rnr of this.bookmakerRunner){
            let runnerBackArray = this.bookmakerRate.rt.filter(si=>si.ri == rnr.SelectionId && si.ib==true);
            let runnerLayArray = this.bookmakerRate.rt.filter(si=>si.ri == rnr.SelectionId && si.ib==false);

            if(runnerBackArray[0]){
              bookmakerRateRunnerWise.push({runnername:rnr.RunnerName,backRate:runnerBackArray[0].rt,selectionId:rnr.SelectionId})
            }

            if(runnerLayArray[0]){
              bookmakerRateRunnerWise.push({runnername:rnr.RunnerName,layRate:runnerLayArray[0].rt,selectionId:rnr.SelectionId})
            }
      }
      }
    }

    for(let mo of matchOddRateRunnerWise){
      for(let bm of bookmakerRateRunnerWise){
        if(mo.runnername.toLowerCase() == bm.runnername.toLowerCase()){
          if((Math.abs(mo.backRate - bm.backRate) >= 0.40) || (Math.abs(mo.layRate - bm.layRate) >= 0.40)){
            // console.log("difference is grt than 6");
            // console.log(Math.abs(mo.backRate - bm.backRate))

            for(let mrkt of this.bookMakerMarket){
              for(let rnr of mrkt.runners){
                if(rnr.SelectionId == bm.selectionId){
                  rnr['isSuspended'] = true;
                }
              }
            }
          }else if((Math.abs(mo.backRate - bm.backRate) <= 0.40) || (Math.abs(mo.layRate - bm.layRate) <= 0.40)){
            for(let mrkt of this.bookMakerMarket){
              for(let rnr of mrkt.runners){
                if(rnr.SelectionId == bm.selectionId){
                  rnr['isSuspended'] = false;
                }
              }
            }
          }
        }
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
        console.log('err',err)
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
      }
    );
  }


  _subscribeCustomWebSocket(){
    this.realCustomDataWebSocket.subscribe(
      data => {
        if(typeof data == 'string') this._updateMarketData(data);
        // if(typeof data == 'string') console.log('sub',data);
      }, // Called whenever there is a message from the server.
      err => {
        console.log('err',err)
        console.log(this.isPageDestroyed)
        if(!this.isPageDestroyed)this._subscribeCustomWebSocket();
      }, // Called if at any point WebSocket API signals some kind of error.
      () => {
        console.log('completed')
        console.log(this.isPageDestroyed)
        if(!this.isPageDestroyed){
          this._subscribeCustomWebSocket();
        }
      }
    );
  }

  onClickLiveMarketRate(runnerObj:any,marketData:any,positionObj:any,marketType:number){
    if(this._sharedService.isUserActive() == false){
      return;
    }

    localStorage.removeItem("tvEnableClick");

    let books = [];
    if(marketData.marketType == "BOOKMAKER"){
      books = this.booksForBookMakerMarket
    }else{
      books = this.booksForMarket
    }
    books = [];
    if(this.isLoggedIn){
      this.marketType = marketType;
      this.betSlipObj = {
          "sportId":marketData['refSportId'],
          "tournamentId":marketData['refTournamentId'],
          "eventId":marketData['matchId'],
          "event":marketData['matchName'],
          "marketId":marketData['marketId'],
          "marketName":marketData['marketType'],
          "sportName":this.sports,
          "odds": +positionObj['odds'],
          "betPosition":positionObj['index'],
          "profit":0,
          "selectionId":runnerObj ? runnerObj['SelectionId']: marketData['SelectionId'],
          "selectionName":runnerObj? runnerObj['RunnerName']: marketData['marketName'],
          "stake": 0,
          "isBack": positionObj['isBack'],
          "centralId":marketData['centralId'],
          "matchTime":marketData['matchTime'],
          "book":marketData['runners'] || [{"SelectionId":marketData['SelectionId'],"RunnerName":marketData['marketName'],"back1":marketData['back1'],"lay1":marketData['lay1']}],
          "isBetSlipActive":positionObj['odds'] > 0 ? true: false,
          "runs":positionObj['runs'],
          "booksForMarket":books,
          "runnerObj":marketData['runners'],
          "marketTypeName":marketData['marketName'],
          "minBet": marketData['minBet'],
          "maxBet": marketData['maxBet'],
          // "minBet": marketData['market']['minBet'],
          // "maxBet": marketData['market']['maxBet'],
          "marketDelay": marketData['marketDelay']
      }
      console.log('this.betSlipObj - politics', this.betSlipObj);
      if(marketData.marketType == "LINE MARKET")this.betSlipObj['book'] = [{"SelectionId":marketData['SelectionId'],"RunnerName":marketData['marketName'],"back1":marketData['back1'],"lay1":marketData['lay1']}]
      console.log("this.betSlipObj['book'] - politics", this.betSlipObj['book']);
    } else {
      this._sharedService.logout();
    }
  }

  getBooksForMarket(marketIdList:any,marketType){
    if(marketIdList?.marketIds?.length > 0 ){
      this._sharedService._getBooksForMarketApi(marketIdList).subscribe((res:any) =>{
        switch(marketType){
          case EMarketType.MATCH_TYPE:
            this.booksForMarket = res?.booksForMarket;
            let horseDataByMarketId = _.find(res?.booksForMarket,['marketId',this.inPlayUpcomingMarket['marketId']]);
            horseDataByMarketId?.horses.map((singleAmount)=>{
              singleAmount['horse'] = +singleAmount['horse'];
              return singleAmount;
            })
            this.inPlayUpcomingMarket['runners'].map((singleRunner)=>{
              singleRunner['hourseAmt']= _.find(horseDataByMarketId?.horses,['horse',+singleRunner['SelectionId']]);
              return singleRunner;
            })
          break;

          case EMarketType.BOOKMAKER_TYPE:
            this.booksForBookMakerMarket = res?.booksForMarket;
            this.bookMakerMarket.map((singleBookMaker)=>{
              let horseDataByMarketId = _.find(res?.booksForMarket,['marketId',singleBookMaker['marketId']]);
              if(horseDataByMarketId !== undefined){
                horseDataByMarketId?.horses.map((singleAmount)=>{
                  singleAmount['horse'] = +singleAmount['horse'];
                  return singleAmount;
                })
                 return singleBookMaker['runners'].map((singleRunner)=>{
                  singleRunner['hourseAmt']= _.find(horseDataByMarketId?.horses,['horse',+singleRunner['SelectionId']]);
                  return singleRunner;
                })
              }
            })

            this.customBookmakerMarkets.map((singleBookMaker)=>{
              let horseDataByMarketId = _.find(res?.booksForMarket,['marketId',singleBookMaker['marketId']]);
              if(horseDataByMarketId !== undefined){
                horseDataByMarketId?.horses.map((singleAmount)=>{
                  singleAmount['horse'] = +singleAmount['horse'];
                  return singleAmount;
                })
                 return singleBookMaker['runners'].map((singleRunner)=>{
                  singleRunner['hourseAmt']= _.find(horseDataByMarketId?.horses,['horse',+singleRunner['SelectionId']]);
                  return singleRunner;
                })
              }
            })
          break;

          case EMarketType.FANCY_TYPE:
            this.fancyMarket.map((singleFancy)=>{
              let horseDataByMarketId = _.find(res?.booksForMarket,['marketId',singleFancy['marketId']]);
              if(horseDataByMarketId !== undefined){
                horseDataByMarketId?.horses.map((singleAmount)=>{
                  singleAmount['horse'] = +singleAmount['horse'];
                  return singleAmount;
                })
                singleFancy['hourseAmt']= _.find(horseDataByMarketId?.horses,['horse',+singleFancy['SelectionId']]);
                return singleFancy;
              }
            })

            this.customFancyMarket.map((singleFancy)=>{
              let horseDataByMarketId = _.find(res?.booksForMarket,['marketId',singleFancy['marketId']]);
              if(horseDataByMarketId !== undefined){
                horseDataByMarketId?.horses.map((singleAmount)=>{
                  singleAmount['horse'] = +singleAmount['horse'];
                  return singleAmount;
                })
                singleFancy['hourseAmt']= _.find(horseDataByMarketId?.horses,['horse',+singleFancy['SelectionId']]);
                return singleFancy;
              }
            })
          break;


          case EMarketType.LINE_TYPE:

          this.lineMarket.map((singleBookMaker)=>{
            let horseDataByMarketId = _.find(res?.booksForMarket,['marketId',singleBookMaker['marketId']]);
            if(horseDataByMarketId !== undefined){
              horseDataByMarketId?.horses.map((singleAmount)=>{
                singleAmount['horse'] = +singleAmount['horse'];
                return singleAmount;
              })
               return singleBookMaker['runners'].map((singleRunner)=>{
                singleRunner['hourseAmt']= _.find(horseDataByMarketId?.horses,['horse',+singleRunner['SelectionId']]);
                return singleRunner;
              })
            }
          })
          break;
        }
      })
    }
  }

  getLadderDataByMarket(marketId:any){
    this.ladderObj = [];
    this._sharedService._postLadderDataByMarketApi({marketId:marketId}).subscribe((res:any)=>{
      this.ladderObj = res?.ladderDetails;
    })
  }

  goBack(){
    this._location.back();
  }

  ngOnDestroy(): void {
    clearInterval(this.fancyInterval);
    this.subjectSub.unsubscribe();
    this.socketSub.unsubscribe()

    if(this.realDataWebSocket){
      this.isPageDestroyed = true;
      this.realDataWebSocket.complete()
    }

    clearInterval(this.dataFlowCheckerInterval);
  }

  enableTV(){
    this.isTVEnable = !this.isTVEnable;
    localStorage.setItem('tvEnableClick', "true");


  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['isTVEnable'] && !changes['isTVEnable'].isFirstChange()){
      this.isTVEnable =  changes['isTVEnable']['currentValue'];

      if(this.isTVEnable){
        this.liveStreamingTVUrl = this._sharedService.liveStreamingTVUrl;

      }
    }
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

          case EMarketName.LINE:
            this._sharedService.getUserBalanceMarket.next({'marketType': EMarketType.LINE_TYPE});
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


  checkSuspendCondition(marketObj){
    if(marketObj.refSportName !== "Politics"){
      const timeDifferenceInSeconds = Math.abs((new Date().getTime() - marketObj['updatedAt']) / 1000);
      return timeDifferenceInSeconds > 100;
    } else {
      return false;
    }
  }

  scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
}
