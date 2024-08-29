import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router , } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CompanyService } from 'src/app/features/company/service/company.service';
import { log } from 'console';

@Component({
  selector: 'app-company-main',
  templateUrl: './company-main.component.html',
  styleUrls: ['./company-main.component.css']
})
export class CompanyMainComponent implements OnInit {
  showFiller = false;
  userDetails: any;
  companyId: any;
  companydata: any;

  constructor(

    private _shared: SharedService,
    private _companyService: CompanyService,
    private router: Router,
  ) { }
  ngOnInit(): void {
    this.userDetails = this._shared.getUserDetails();

    // // console.log('abc', this.userDetails.Company_Id);

    this.redirect();
  }

  url() {

    // this.router.navigateByUrl('/login')
    window.localStorage.clear();
    window.sessionStorage.clear();
    alert("Log out Successfully")
    this.router.navigate(['/login']);
    window.location.reload();
  }
  profile() {
    this.router.navigateByUrl('/profile')
    // alert("Please Fill The Company Registation Page")
    // if(this.cid == null)
    // {
    //   this.router.navigateByUrl('/addcompany')

    // }
    // if(this.cid!=null)
    // {
    //   this.router.navigateByUrl('/profile')

    // }
  }

  redirect() {

    this.userDetails = this._shared.getUserDetails();

    // this._companyService.getCompanyByuserId(this.userDetails.userId).subscribe((data: any) => {

    //   // console.log("company,data", data)
    //   if (data.length > 0) {
    //     this.companydata = data[0];

    //     this.companyId = this.companydata.company_Id;

    //     if (this.companydata.company_Id === this.companyId) {
    //       this.router.navigate(['/editcompany'])
    //       // console.log("navigated to edit page")
    //     }
    //     else {
    //       this.router.navigate(['/addcompany'])
    //       // console.log("navigated to add page")
    //     }
    //   }
    // })
  }
}
