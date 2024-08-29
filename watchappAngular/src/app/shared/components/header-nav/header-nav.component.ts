import { Component, Input, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CommonModule } from '@angular/common';
import { CompanyService } from 'src/app/features/company/service/company.service';
import { log } from 'console';
import { ProfileService } from 'src/app/features/profile/services/profile.service';
import { ProfileUserService } from 'src/app/features/profile-user/service/profile-user.service';
import { BehaviorSubject } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-header-nav',
  templateUrl: './header-nav.component.html',
  styleUrls: ['./header-nav.component.css']
})
export class HeaderNavComponent implements OnInit {
  showFiller = false;
  userDetails: any;
  cid: any;
  companydata: any;
  company_logo: any ;
  profilelogo: any;
  userName: any;
  userInfo: any;
  Id: { user_id: any; };
  curDate: Date;
  constructor(
    private _shared: SharedService,
    private router: Router,
    private _route: ActivatedRoute,
    private CompanyService: CompanyService,
    private _profile:ProfileUserService,
    private _companyService: CompanyService,

  ) { }

  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
  ngOnInit(): void {
    this.userDetails = this._shared.getUserDetails();
    // console.log("message", this.userDetails);

    // // console.log('abc', this.userDetails.Company_Id);

    this.redirect();

    this.fullHeight();
    this.initSidebarCollapse();
    // this.profileData()
    this.userDetails = this._shared.getUserDetails();

    // console.log(this.userDetails);

    // console.log('UserId', this.userDetails.UserId);

    this.Id =
    {
      user_id: this.userDetails.userId
    }
    this.setvalues(this.Id)
    this.getCompanyDetails()
  }

  fullHeight() {
    const windowHeight = $(window).height();
    if (windowHeight !== undefined) {
      $(".js-fullheight").css("height", windowHeight.toString() + "px");
      $(window).resize(() => {
        const resizedHeight = $(window).height();
        if (resizedHeight !== undefined) {
          $(".js-fullheight").css("height", resizedHeight.toString() + "px");
        }
      });
    }
  }

  initSidebarCollapse() {
    $("#sidebarCollapse").on("click", () => {
      $("#sidebar").toggleClass("active");
    });
  }
  url() {

    this.router.navigateByUrl('/login')
  }
  profile() {
    this.router.navigateByUrl('/profile')
  }

  redirect() {

    this.userDetails = this._shared.getUserDetails();

    // console.log('local', this.userDetails)

    // // console.log('abc', this.userDetails.Company_Id);

    // console.log('abc', this.userDetails.UserId);

    /*this.CompanyService.getCompanyByuserId(this.userDetails.UserId).subscribe((data: any) => {

      this.companydata = data[0];
      // console.log('check-status', this.companydata);

      this.cid = this.companydata.company_Id;

      // console.log(this.cid)


      // console.log(this.companydata.company_Id === this.cid)

      if (this.companydata.company_Id === this.cid) {
        this.router.navigate(['/editcompany'])
        // console.log("navigated to edit page")
      }

      else {
        this.router.navigate(['/addcompany'])
        // console.log("navigated to add page")
      }

    })*/
  }

  
  // profileData() {
  //   this.userName = this._profile.getUserName();
  //   this.profilelogo = this._profile.getProfilePhoto();
  //   console.log( "header1",this._profile.user_name)
  //   console.log("header2", this._profile.profile_photo)
  // }



  setvalues(Id){
    this._profile._getUserInfoApi(Id).subscribe((res: any) => {

      this.userInfo = res.data;
      
      this.profilelogo=this.userInfo.ProfilePicture[0]? this.userInfo.ProfilePicture[0]: 'assets/images/avatar.png';
      this.userName=this.userInfo?.Name
      this.curDate=new Date();
    })

  }

  getCompanyDetails(){
    let body ={
      user_id : this.userDetails.userId
    }   
    this._companyService._getCompanyDetailsApi(body).subscribe((res: any) => {
      let CompanyDetails = res['data'][0];
      this.company_logo = res.data[0].AppIcon[0];
    })
  }
  
}
