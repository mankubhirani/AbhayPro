import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import {Location} from '@angular/common';
import { CasinoService } from 'src/app/features/casino/services/casino.service';

@Component({
  selector: 'app-left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.scss']
})
export class LeftNavigationComponent implements OnInit {

  mainMenu:any = [];
  viewMoreNavList:any = [];
  leftMenu:any;
  leftCasinoMenu:any;
  isLoggedIn:boolean = false;
  sportsName:string;
  userDetails:any;

  menuList:any;
  isUserActive:boolean = true;
  tourId:any;
  matchId:any;
  isMobileView:boolean;
  isCasinoEnabled:boolean = false;
  expandedTournament: any = null;
  expandedSport: any = null;

  constructor(
    private _route: ActivatedRoute,
    private _sharedService: SharedService,
    private _location: Location,
    private _casinoService: CasinoService,
    private router : Router,
  ) { }

  ngOnInit(): void {

    this.isMobileViewCallInit();
    this.getNavList();
    this._route.params.subscribe((routeParams)=>{
      this.sportsName = routeParams.sports;
      // this.sportsName = 'Cricket';
      this.tourId = routeParams.tourId;
      this.matchId = routeParams.matchId;

      if(this.sportsName){
        this.matchId ? this.getSubNavBySportsWithTourAndMatchList()
                    : this.tourId ? this.getSubNavBySportsWithTourList() : this.getSubNavBySportsList();
      }else{
        this.getSubNavList();
      }

    })
    this.isLoggedIn = this._sharedService.isLoggedIn();
    this.userDetails = this._sharedService.getUserDetails();
    this.isUserActive = this._sharedService.isUserActive();
  }

  isMobileViewCallInit(){
    this.isMobileView =  this._sharedService.isMobileViewFn();
    this._sharedService.isMobileView.subscribe((res:any)=>{
      this.isMobileView = res;
    })
  }

  getSubNavBySportsList(){
    this._sharedService._postTourListApi({name:this.sportsName}).subscribe((tourListRes:any)=>{

      if(tourListRes?.length >0){
        let updatedTourList = tourListRes.map((singleObj:any)=>(
          {
            'id':singleObj['tournamentId'],
            'name':singleObj['tournamentName']
          }
        ));
        this.menuList = updatedTourList;
      }
    });
  }


  redirectToAviatorCasino(){
    if(!this.isUserActive){
      return;
    }
    let body = {
      "gameCode": "SPB-aviator",
      "providerCode": "QT",
      "url": window.location.hostname
    }
    this._casinoService._postCasinoURLApi(body).subscribe(res=>{
      this._sharedService.launchURL = res['casinoObj'].launchURL;
      localStorage.setItem('iframeUrl',res['casinoObj'].launchURL);
      this.router.navigate(['/casino-play']);
    })
  }

  getSubNavBySportsWithTourList(){
    this._sharedService._getToursMatchesListApi(this.tourId).subscribe((matchListRes:any)=>{
      if(matchListRes?.length >0){
        let updatedMatchList = matchListRes.map((singleObj:any)=>(
          {
            'id':singleObj['matchId'],
            'refTournamentId':singleObj['refTournamentId'],
            'name':singleObj['matchName']
          }
        ));
        this.menuList = updatedMatchList;
      }
    });
  }

  getSubNavBySportsWithTourAndMatchList(){
    this._sharedService._getToursMatchesListApi(this.tourId).subscribe((matchListRes:any)=>{

      if(matchListRes?.length >0){
        let updatedMatchList = matchListRes.map((singleObj:any)=>(
          {
            'id':singleObj['matchId'],
            'refTournamentId':singleObj['refTournamentId'],
            'name':singleObj['matchName']
          }
        ));
        this.menuList = updatedMatchList;
      }
    });
  }


  getNavList(){
    this._sharedService._getLeftMenuList().subscribe((res)=>{
      this.leftMenu = res.menuList.allSports;
      this.leftCasinoMenu = res.menuList.casinoList;
    });
    // this._sharedService._getSportsListApi().subscribe((res)=>{
    //   this.mainMenu = res;
    //   console.log('this.mainMenu', this.mainMenu);
    // });
  }

  getSubNavList(){
    this._sharedService._getAllNavListApi().subscribe((res)=>{
      this.viewMoreNavList = res['menuList'];
      if(this.viewMoreNavList.some(function(el){ return el.gameId === 4})){
        this.isCasinoEnabled = true;
      }
    });
  }

  goBack(){
    this._location.back();
  }
  toggleExpansion(tournament: any) {
    if (this.expandedTournament === tournament) {
      this.expandedTournament = null; // Collapse if already expanded
    } else {
      this.expandedTournament = tournament; // Expand if not expanded
    }
  }
  isTournamentExpanded(tournament: any): boolean {
    return this.expandedTournament === tournament;
  }

  toggleSport(sport: any) {
    if (this.expandedSport === sport) {
      this.expandedSport = null; // Collapse if already expanded
    } else {
      this.expandedSport = sport; // Expand if not expanded
    }
  }

  isSportExpanded(sport: any): boolean {
    return this.expandedSport === sport;
  }
}
