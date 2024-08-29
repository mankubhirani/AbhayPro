import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../service/company.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/services/shared.service';


@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.css']
})
export class EditCompanyComponent implements OnInit {
  editCompany: any = FormGroup;
  userDetails: any;
  getAllCountry: any;
  allcompany: any;
  companydata: any;
  all_data: any;
  company_Id: any;
  company: any;
  id: any;

  Company_Id: any;
  UserId: any;
  Email: any;
  Name: any;
  Username: any;
  Designation: any;


  constructor(
    private formBuilder: FormBuilder,
    private _shared: SharedService,
    private _companyService: CompanyService,
    private activatedRoute: ActivatedRoute,
    private _router: Router,
  ) {

    // this._companyService._getAllCompanyApi().subscribe((data) => {
    //   this.allcompany = data;
    //   // console.log("allcompany", data);
    // });

    this.userDetails = this._shared.getUserDetails();

    // console.log('local', this.userDetails)

    // console.log('UserId', this.userDetails.UserId);



    // // console.log('abc', this.userDetails.Company_Id);

    this._companyService.getCompanyByuserId(this.userDetails.UserId).subscribe((data) => {

      this.all_data = data[0];

      // console.log('all_data', this.all_data);

      this.id = this.all_data.company_Id;

      // console.log('id', this.id)

      // // console.log('id',this.id)

      this._companyService.getCompanyByid(this.id).subscribe((data: any) => {
        this.company = data[0];
        this.companydata = this.company[0];
        // console.log('check-status', this.companydata);



        // for(let i of this.companydata)
        // {
        // // console.log(this.allcompany[i].company_Id);}

        // console.log("url...", this.companydata.Number_of_Employe)

        this.editCompany.patchValue({
          'companyName': this.companydata.companyName,
          'companyEmail': this.companydata.companyEmail,
          'companyURL': this.companydata.companyURL,
          'Phone_Number': this.companydata.Phone_Number,
          'Number_of_Employe': this.companydata.Number_of_Employe,
          'city': this.companydata.city,
          'region': this.companydata.region,
          'zip': this.companydata.zip,
          'streetAddress': this.companydata.streetAddress,
          'timeZone': this.companydata.timeZone,
          'adddress': this.companydata.adddress,
          'remark': this.companydata.remark,
          'companyLocation': this.companydata.companyLocation,
        });

        // console.log('check', this.companydata);

      });

    });

  }

  get companyVail() { return this.editCompany.controls; }

  getcontrol(name: any): AbstractControl | null {
    return this.editCompany.get(name);
  }

  ngOnInit(): void {


    console.log("Call")

    this.editCompany = this.formBuilder.group({


      companyName: ['', [Validators.required]],
      companyEmail: ['', [Validators.required , Validators.email]],
      companyURL: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      Phone_Number: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]],
      Number_of_Employe: ['', [Validators.required]],
      companyLocation: [''],
      city: [''],
      region: [''],
      zip: [''],
      streetAddress: [''],
      timeZone: [''],
      adddress: ['',],
      remark: [''],
    })


    // console.log('timezone', JSON.stringify(this.timeZone));

    this._companyService._getCountryApi().subscribe((res) => {
      this.getAllCountry = res;
      // console.log(" GET country ", this.getAllCountry);
      // Countries

    })


    //  this.UpdateCompany()
  }


  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }


  ValidateAlpha(event: any) {
    var keyCode = (event.which) ? event.which : event.keyCode
    if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && keyCode != 32)

      return false;
    return true;
  }



  UpdateCompany() {
    // console.log("editCompany", this.editCompany.value);

    let companydata = {

      company_Id: this.id,
      UserId: this.userDetails.UserId,
      companyName: this.editCompany.value.companyName,
      companyEmail: this.editCompany.value.companyEmail,
      companyURL: this.editCompany.value.companyURL,
      Phone_Number: this.editCompany.value.Phone_Number,
      Number_of_Employe: this.editCompany.value.Number_of_Employe,
      companyLocation: this.editCompany.value.companyLocation,
      remark: this.editCompany.value.remark,

    }

    this._companyService.updateCompanyApi(companydata).subscribe((data) => {
      // console.log('company', data)
      // this._router.navigate(['/dashboard']);
      this._shared.ToastPopup('Updated Successfully ', '', 'success');

      setTimeout(() => {
        this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => this._router.navigate(['/dashboard']));
      }, 2000);
      // window.location.reload();
      // // console.log("Company details Successfully Updated", );
    });

  }

}
