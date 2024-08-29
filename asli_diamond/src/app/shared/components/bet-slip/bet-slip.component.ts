import { Component, Input, OnChanges, OnInit, SimpleChanges, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { UserSettingsMainService } from 'src/app/features/user-settings/services/user-settings-main.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EMarketName, EMarketType } from '@shared/models/shared';
import * as _ from "lodash";
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bet-slip',
  templateUrl: './bet-slip.component.html',
  styleUrls: ['./bet-slip.component.scss']
})
export class BetSlipComponent implements OnInit, OnChanges, AfterViewInit,OnDestroy {

  @Input() isBetSlipActive: any;
  @Input() betSlipParams: any;
  @Input() showMAtchwiseBet = ''
  @Input() marketType: any = EMarketType.MATCH_TYPE;
  @Input() isTVEnable: boolean;
  @ViewChild("bet_odds", {
  }) bet_odds: ElementRef;
  @ViewChild("bet_stakes", {
  }) bet_stakes: ElementRef;

  EMarketType: typeof EMarketType = EMarketType;
  odds: number;
  stake: number;
  matchedBets: any[] = [];
  unMatchedBets: any[] = [];
  userConfig: any = [];
  betSlipForm: FormGroup;
  isBetSlipPlaceCall: boolean = false
  isLoaderStart: boolean = false;
  // count:number;
  isBack: boolean;
  userBalance: any;
  isSticky: boolean = false;
  matchId: number;
  liveStreamingTVUrl: any;
  exposure: number = 0;
  isMobileView: boolean;
  timeoutId: any;
  bettingStatus: any;
  public dotCount:number=0;
  checkNumberOnly:any;
  checkString:any;
  subjectSubscription:Subscription;
  userSettingServiceSub:Subscription;

  constructor(
    private _sharedService: SharedService,
    private _userSettingsService: UserSettingsMainService,
    private _fb: FormBuilder,
    private _route: ActivatedRoute
  ) { }


  ngOnDestroy(): void {
    this.subjectSubscription.unsubscribe();
    this.userSettingServiceSub.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.isMobileView) {
      this.timeoutId = setTimeout(() => {
        this.bet_stakes.nativeElement.focus();
      }, 100);
    } else {
      this.timeoutId = setTimeout(() => {
        this.bet_odds.nativeElement.focus();
      }, 100);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['betSlipParams'] && !changes['betSlipParams'].isFirstChange() && changes['betSlipParams'].currentValue) {
      this.betSlipParams = changes['betSlipParams']['currentValue'];
      this.isBack = changes['betSlipParams']['currentValue']['isBack'];
      this.isBetSlipActive = changes['betSlipParams']['currentValue']['isBetSlipActive'];

      if (!this.isBetSlipActive) {
        this.betSlipForm.patchValue({
          odds: 0,
          runs: 0,
          stake: 0
        })
        this.stakeVal(0);
      } else {
        if (this.isMobileView) {
          this.timeoutId = setTimeout(() => {
            if(this.bet_stakes){
              this.bet_stakes.nativeElement.focus();
            }

          }, 100);
        } else {
          this.timeoutId = setTimeout(() => {
            if(this.bet_odds){
              this.bet_odds.nativeElement.focus();
            }

          }, 100);
        }
      }

      this.betSlipForm.patchValue({
        odds: this.betSlipParams['odds'],
        runs: this.betSlipParams['runs'],
      })
      changes['betSlipParams']['currentValue']['marketName'] == EMarketType.MATCH_TYPE;
      this.setStackMinMaxValidator();
      this.stakeVal(this.betSlipForm.controls['stake'].value);

    }
    if (changes['marketType'] && !changes['marketType']?.isFirstChange() && changes['marketType']?.currentValue) {
      this.marketType = changes['marketType']['currentValue'];
      if (this.marketType == EMarketType.BOOKMAKER_TYPE) {
        this.betSlipForm.controls['odds'].disable();
      } else {
        this.betSlipForm.controls['odds'].enable();
      }
      this.stakeVal(this.betSlipForm.controls['stake'].value);
    }

    if (changes['isTVEnable'] && !changes['isTVEnable'].isFirstChange()) {
      this.isTVEnable = changes['isTVEnable']['currentValue'];
      if (this.isTVEnable) {
        this.liveStreamingTVUrl = this._sharedService.liveStreamingTVUrl;
      }
    }

    let isOneclickBet = localStorage.getItem('isOneClickBetOn');

    let tvClick = localStorage.getItem("tvEnableClick") ;

    if(isOneclickBet && !tvClick) {
      this.placeBetIfActivated();
    }
  }




  ngOnInit(): void {

    this.isMobileViewCallInit();
    this._route.params.subscribe(routeParams => {
      this.matchId = routeParams.matchId;
    });

    this._sharedService.deletedSuspendedSubject.subscribe((res)=>{
      this._getUserOpenBet();
    });

    this.subjectSubscription = this._sharedService.unMatchSubjectListSubject.subscribe(() => {
      this._getUserOpenBet();
      this._sharedService.getUserBalance.next();
      this._sharedService.getUserBalanceMarket.next({ 'marketType': EMarketType.MATCH_TYPE });
    })

    this.isBack = this.betSlipParams?.isBack;
    this._createBetSlipForm();
    this._getUserOpenBet();
    this._setUserIp();

    if (this.isMobileView) this.callForMobile();
    this.placeBetIfActivated();


    this.userSettingServiceSub = this._userSettingsService.userConfigSubject.subscribe((res)=>{
      if(res){
        this.userConfig = res;
        this.bettingStatus = this.userConfig.onClickBettingStatus;
      }
    })
  }

  placeBetIfActivated(){
    this.bettingStatus = this.userConfig?.userConfig?.onClickBettingStatus;

    if(this.bettingStatus) {
      this.isLoaderStart = true;
      this._placeBetCall();
    }
  }

  callForMobile() {
    if (this.betSlipParams) {
      this.isBack = this.betSlipParams['isBack'];
      this.isBetSlipActive = this.betSlipParams['isBetSlipActive'];
      if (!this.isBetSlipActive) {
        this.betSlipForm.patchValue({
          odds: 0,
          runs: 0,
          stake: 0
        })
        this.stakeVal(0);
      } else {
        if (this.isMobileView) {
          this.timeoutId = setTimeout(() => {
            this.bet_stakes.nativeElement.focus();
          }, 100);
        } else {
          this.timeoutId = setTimeout(() => {
            this.bet_odds.nativeElement.focus();
          }, 100);
        }
      }

      this.betSlipForm.patchValue({
        odds: this.betSlipParams['odds'],
        runs: this.betSlipParams['runs'],
      })
      this.betSlipParams['marketName'] == EMarketType.MATCH_TYPE;
      this.setStackMinMaxValidator();
      this.stakeVal(this.betSlipForm.controls['stake'].value);
    }
    if (this.marketType) {
      if (this.marketType == EMarketType.BOOKMAKER_TYPE) {
        this.betSlipForm.controls['odds'].disable();
      } else {
        this.betSlipForm.controls['odds'].enable();
      }
      this.stakeVal(this.betSlipForm.controls['stake'].value);
    }

    if (this.isTVEnable) {
      this.liveStreamingTVUrl = this._sharedService.liveStreamingTVUrl;
    }
  }

  isMobileViewCallInit() {
    this.isMobileView = this._sharedService.isMobileViewFn();
    this._sharedService.isMobileView.subscribe((res: any) => {
      this.isMobileView = res;
    })
  }

  private _setUserIp() {
    this._sharedService.userIp = '127.0.0.1';
    /*this._sharedService.getIPApi().subscribe(res => {
      this._sharedService.userIp = res['ip'];
    })*/
  }
  _createBetSlipForm() {
    this.betSlipForm = this._fb.group({
      odds: ['', [Validators.required, Validators.min(1.01)]],
      runs: [{ value: '', disabled: true }, [Validators.required]],
      stake: ['', [Validators.required]]
    })
  }

  onClickPlaceBet() {
    this.isBetSlipPlaceCall = true;
    // if(this.marketType == EMarketType.MATCH_TYPE){
    //   this.count = 5;
    // }else if(this.marketType == EMarketType.FANCY_TYPE){
    //   this.count = 2;
    // }else{
    //   this.count = 1;
    // }

    this.isLoaderStart = true;

    // let internvalCount = setInterval(()=>{
    //   // this.count--;
    //   if(this.count <= 0){
    //     clearInterval(internvalCount);
    //   }
    // },1000);

    this._placeBetCall();

    // if (this.isMobileView) {
    //   this.timeoutId = setTimeout(() => {
    //     if(this.bet_odds){
    //       this.bet_stakes.nativeElement.focus();
    //     }
    //   }, 100);
    // } else {
    //   this.timeoutId = setTimeout(() => {
    //     if(this.bet_odds){
    //       this.bet_odds.nativeElement.focus();
    //     }
    //   }, 100);
    // }
  }


  private _placeBetCall() {

    if(this.bettingStatus){
      this.betSlipForm.patchValue({
        stake : this.userConfig.userConfig['editOneClickStakeActiveBtn']
      });
    }

    if (this.betSlipParams.marketName == EMarketName.MATCH_ODDS_SPACE || this.betSlipParams.marketName == EMarketName.MATCH_ODDS_UNDERSCORE) {
      let multiplier = this.betSlipForm.controls['odds'].value >= 1 ? this.betSlipForm.controls['odds'].value - 1 : 1 - this.betSlipForm.controls['odds'].value;
      this.betSlipParams.profit = Math.round(multiplier * this.betSlipForm.controls['stake'].value);
      this.betSlipParams.marketName = 'Match Odds';
      this.betSlipParams.odds = this.betSlipForm.controls['odds'].value;
      this.betSlipParams.stake = this.betSlipForm.controls['stake'].value;
    } else if (this.betSlipParams.marketName == EMarketName.FANCY || this.betSlipParams.marketName == EMarketName.BOOKMAKER) {
      let multiplier = this.betSlipParams['odds'] / 100;
      this.betSlipParams.profit = Math.round(multiplier * this.betSlipForm.controls['stake'].value);
      this.betSlipParams.marketName = this.betSlipParams.marketName == EMarketName.FANCY ? 'Fancy' : 'Bookmaker';
      this.betSlipParams.odds = this.betSlipParams['odds'];
      this.betSlipParams.stake = this.betSlipForm.controls['stake'].value;
    }else if (this.betSlipParams.marketName == EMarketName.LINE ) {
      this.betSlipParams.profit = Math.round(this.betSlipForm.controls['stake'].value);
      this.betSlipParams.marketName = 'Line';
      this.betSlipParams.odds = this.betSlipParams['odds'];
      this.betSlipParams.stake = this.betSlipForm.controls['stake'].value;
    }
    this.betSlipParams['userIp'] = this._sharedService.getIpAddress();
    this.betSlipParams['exposure'] = this.exposure;


    this._sharedService._postPlaceBetApi(this.betSlipParams).subscribe(
      (betSlipRes: any) => {
        if (betSlipRes) {
          this.isBetSlipActive = false;
          this.isBetSlipPlaceCall = false;
          this.isLoaderStart = false;
          this._sharedService.getUserBalance.next();
          this._sharedService.getUserBalanceMarket.next({ 'marketType': this.marketType });
          this.betSlipForm.reset();
          this._getUserOpenBet();
          this._sharedService.getToastPopup(betSlipRes.message, 'Market Bet', 'success');
          if (this.isMobileView) this._sharedService.isMobileViewCancel.next();
        }
      },
      (err) => {
        this.isBetSlipActive = false;
        this.isBetSlipPlaceCall = false;
        this.isLoaderStart = false;
        this._sharedService.getUserBalance.next();
        this._sharedService.getUserBalanceMarket.next({ 'marketType': this.marketType });
        this.betSlipForm.reset();
        this._getUserOpenBet();
      });

  }

  get profit():any {
    if (this.betSlipParams.marketName == EMarketName.MATCH_ODDS_SPACE || this.betSlipParams.marketName == EMarketName.MATCH_ODDS_UNDERSCORE) {
      let multiplier = this.betSlipForm.controls['odds'].value >= 1 ? this.betSlipForm.controls['odds'].value - 1 : 1 - this.betSlipForm.controls['odds'].value;
      return Math.round(multiplier * this.betSlipForm.controls['stake'].value)
    }else if (this.betSlipParams.marketName == EMarketName.LINE) {
      return Math.round(this.betSlipForm.controls['stake'].value)
    }else if(this.betSlipParams.marketName == EMarketName.BOOKMAKER || this.betSlipParams.marketName == EMarketName.FANCY) {
      let multiplier = this.betSlipParams['odds'] / 100;
      return Math.round(multiplier * this.betSlipForm.controls['stake'].value);
    }
  }

  _getUserOpenBet() {
    this._sharedService._getUserOpenBetsApi().subscribe(
      (res: any) => {
        res.userBets.forEach(bet => {
          if (this.showMAtchwiseBet) bet.bets = bet.bets.filter(b => b.matchName == this.showMAtchwiseBet)
          if (bet.status == "EXECUTION_COMPLETE") {
            this.matchedBets = bet.bets
          } else {
            this.unMatchedBets = bet.bets
            this._sharedService.unmatchedBetsList = bet.bets;
          }
        })
      })
  }

  stakeVal(val: any) {
    //calculate profit and loss with marketID
    if (this.betSlipForm.controls['stake'].valid && val !== 0) {
      let marketObj = {};
      let calCulatedAmount = 0;
      if (this.betSlipParams.marketName == 'MATCH ODDS' || this.betSlipParams.marketName == "MATCH_ODDS") {
        let multiplier = this.betSlipForm.controls['odds'].value >= 1 ? this.betSlipForm.controls['odds'].value - 1 : 1 - this.betSlipForm.controls['odds'].value;
        calCulatedAmount = Math.round(multiplier * this.betSlipForm.controls['stake'].value);
      }if (this.betSlipParams.marketName == "LINE MARKET") {

        calCulatedAmount = Math.round(this.betSlipForm.controls['stake'].value);
      } else if(this.betSlipParams.marketName == "BOOKMAKER" || this.betSlipParams.marketName == "FANCY"){
        let multiplier = this.betSlipParams['odds'] / 100;
        calCulatedAmount = Math.round(multiplier * this.betSlipForm.controls['stake'].value)
      }

      let backUnMatchRunnerAmount = this.betSlipForm.controls['stake'].value * -1;
      let layUnMatchRunnerAmount = calCulatedAmount * -1;

      let marketId = this.betSlipParams['marketId'];
      marketObj['marketType'] = this.marketType;

      marketObj[marketId] = {};
      let bookMarketByMarketId = _.find(this.betSlipParams.booksForMarket, ['marketId', marketId]);
      this.getRunnerId().map((runnerId: any) => {
        marketObj[marketId][runnerId] = {};
        if (runnerId == this.betSlipParams.selectionId) {
          marketObj[marketId][runnerId]['amount'] = this.isBack ? calCulatedAmount : layUnMatchRunnerAmount;
        } else {
          marketObj[marketId][runnerId]['amount'] = this.isBack ? backUnMatchRunnerAmount : this.betSlipForm.controls['stake'].value;
        }
        if (this.betSlipParams?.booksForMarket?.length > 0) {
          if (bookMarketByMarketId) {
            let bookMarketAmtByRunnerId = _.find(bookMarketByMarketId?.horses, ['horse', +runnerId]); //need to add amount variable from horse
            bookMarketAmtByRunnerId ? marketObj[marketId][runnerId]['amount'] += bookMarketAmtByRunnerId?.amount : '';
          }
        }
      })

      let netExposure = Object.values(marketObj[marketId])
      this.exposure = Math.min(...netExposure.map((horse: any) => horse.amount));
      this._sharedService.marketBookCalSubject.next(marketObj);
    } else {
      this._sharedService.marketBookCalSubject.next({});
    }

  }

  upAndDownOddsValue(isUp: boolean) {
    if(this.marketType == EMarketType.MATCH_TYPE){
      this.betSlipForm.controls['odds'].setValue(isUp ? +(this.betSlipForm.controls['odds'].value + 0.01).toFixed(2) : +(this.betSlipForm.controls['odds'].value - 0.01).toFixed(2));
    }else{
      this.betSlipForm.controls['odds'].setValue(isUp ? +(this.betSlipForm.controls['odds'].value + 1).toFixed(2) : +(this.betSlipForm.controls['odds'].value - 1).toFixed(2));
    }
    this.stakeVal(this.betSlipForm.controls['stake'].value);
  }

  updateStack(stackVal: any) {
    if (isNaN(this.betSlipForm.controls['stake'].value) || this.betSlipForm.controls['stake'].value == "" || this.betSlipForm.controls['stake'].value == null) {
      this.betSlipForm.controls['stake'].setValue(parseInt(stackVal));
    } else {
      this.betSlipForm.controls['stake'].setValue(parseInt(this.betSlipForm.controls['stake'].value) + parseInt(stackVal));
    }

    this.stakeVal(this.betSlipForm.controls['stake'].value);

  }


  setStackMinMaxValidator() {
    this.betSlipForm.controls['stake'].setValidators([Validators.required, Validators.min(this.betSlipParams?.minBet), Validators.max(this.betSlipParams?.maxBet)]);
  }

  getRunnerId() {
    return _.map(this.betSlipParams['runnerObj'], 'SelectionId');
  }

  cancelBet(betListObj: any, marketType: string, cancelBetLevel: any) {
    let betList: any = [];
    switch (cancelBetLevel) {
      case 1:
        if (betListObj.length > 0 && betListObj[0]['markets'].length > 0) {
          betListObj[0]['markets'].map((singleMarket) => {
            singleMarket.runners.map((singleRunner) => {
              singleRunner.bets.map((singleBet) => {
                betList.push(singleBet['betId']);
              })
            })
          })
        }
        break;

      case 2:
        if (betListObj['runners'].length > 0) {
          betListObj.runners.map((singleRunner) => {
            singleRunner.bets.map((singleBet) => {
              betList.push(singleBet['betId']);
            })
          })
        }
        break;

      case 3:
        if (betListObj?.betId) betList.push(betListObj.betId);
        break;

    }

    let betIdObj = {
      betIdList: betList
    }
    this._sharedService.postCancelBetForMarket(betIdObj).subscribe((res) => {
      this._sharedService.getToastPopup('Successfully Bet Cancelled', 'Bet Cancelled', 'success');
      marketType = marketType.toUpperCase();
      this._sharedService.getUserBalance.next();
      switch (marketType) {
        case EMarketName.MATCH_ODDS_UNDERSCORE:
        case EMarketName.MATCH_ODDS_SPACE:
          this._sharedService.getUserBalanceMarket.next({ 'marketType': EMarketType.MATCH_TYPE });
          break;

        case EMarketName.BOOKMAKER:
          this._sharedService.getUserBalanceMarket.next({ 'marketType': EMarketType.BOOKMAKER_TYPE });
          break;

        case EMarketName.FANCY:
          this._sharedService.getUserBalanceMarket.next({ 'marketType': EMarketType.FANCY_TYPE });
          break;

          case EMarketName.LINE:
            this._sharedService.getUserBalanceMarket.next({ 'marketType': EMarketType.LINE_TYPE });
            break;

        case 'ALL':
          this._sharedService.getUserBalanceMarket.next({ 'marketType': EMarketType.MATCH_TYPE });
          this._sharedService.getUserBalanceMarket.next({ 'marketType': EMarketType.BOOKMAKER_TYPE });
          this._sharedService.getUserBalanceMarket.next({ 'marketType': EMarketType.FANCY_TYPE });
          break;
      }

      this._getUserOpenBet();
    })
  }

  cancelBetSlip() {
    if (this.isMobileView) this._sharedService.isMobileViewCancel.next();
    this.stakeVal(0);
    this.betSlipForm.controls['stake'].setValue("");
    this.isBetSlipActive = false;
    this.betSlipParams['isBack'] = false;
  }

  // numberOnly(event): boolean {
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
  //     return false;
  //   }
  //   return true;
  // }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46) {
        this.dotCount += 1;
        this.checkNumberOnly = (event.target.value);
        var numericCheck = (event.target.value).toString();
        if (numericCheck.includes('.')) {
            this.dotCount += 1;
        }
        if (this.dotCount > 1) {
            this.dotCount = 0;
            return false;
        }
    }
    if (charCode > 31 && (charCode < 45 || charCode > 57 || charCode==47)) {
        return false;
    }
    this.checkNumberOnly = (event.target.value);
    if (this.checkNumberOnly != null) {
        var numeric = (event.target.value).toString();
        if (numeric.includes('.')) {
          var checkNumeric = numeric.split('.');
          if (checkNumeric.length > 2) {
              return false;
          }
          this.checkString = checkNumeric[1].split('');
          if (this.checkString.length > 1) {
              return false;
          }
      }

  }
  this.dotCount = 0;
  return true;

}
}
