import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CompanyService } from '../../service/company.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProfileUserService } from 'src/app/features/profile-user/service/profile-user.service';
import { ProfileService } from 'src/app/features/profile/services/profile.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.css']
})
export class AddCompanyComponent implements OnInit {

  companyForm: FormGroup;
  userDetails: any;
  allCountryData: any;
  allCountryDataC: any;
  selectedTimezone: number;
  selectedCountryId: number;
  allTimezoneData: any;
  allTimezoneDataC: any;
  employeeNumData: any;
  employeeNumDataC: any;
  selectedEmployeeNum: number;
  selectedFile: File | any;
  company_logo: File | any;
  country_id: any;
  statesData: any;
  state_id: any;
  cityData: any;
  city_id: any;
  industryData: any;
  noOfEmployeesData: any;
  taxTypes: any;
  company_logo_path: any;
  userPermission: any;
  country_codeList: any;
  countryCodeLIst:any;
  userID:any

  constructor(
    private formBuilder: FormBuilder,
    private _shared: SharedService,
    private _companyService: CompanyService,
    private _router: Router,
    private ngxService: NgxUiLoaderService,
    public profileService: ProfileService,
    public _profileservice: ProfileService,
  ) { }

  ngOnInit(): void {
    // Get user details
    this.userDetails = this._shared.getUserDetails();

    this.getAllCountry();

    this.getIndustryTypes();
    this.getNumberOfEmployees();
    this.getTaxTypes();
    this.createCompanyForm();

    this.getUserviewPermission();
    this.getCountryAPILIST()

    //this.getCountryCode();
  }

  getAllCountry(){
    this._companyService._getCountryApi().subscribe((res:any) => {
      this.allCountryData = res.data;;
    });
  }

  createCompanyForm() {
    this.companyForm = this.formBuilder.group({
      company_name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      company_email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      phoneNumber: new FormControl('', [
         Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10),
      ]),
      company_website: new FormControl('', [
        Validators.required,
        Validators.minLength(8),Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
      ]),
      idindustry_typ_id: new FormControl('', [Validators.required]),
      employee_count_id: new FormControl('', [Validators.required]),
      company_logo: new FormControl(''),
      tax_type_id : new FormControl('',Validators.required),
      tax_information: new FormControl('',[Validators.required]),
      country_id: new FormControl('',[Validators.required]),
      state_id: new FormControl('',[Validators.required]),
      city_id: new FormControl('',[Validators.required]),
      pin_code: new FormControl('',[Validators.required , Validators.minLength(6),Validators.maxLength(6)]),
      street_address: new FormControl('',[Validators.required]),
      country_code:['+91'],

    });
  }


  getCountryAPILIST() {
    let body = {
      userId: this.userID
    };

    this._profileservice.getCountryCode(body).subscribe(
      (res: any) => {
        this.countryCodeLIst = res.data;
      },
      (err: any) => {
        console.error('Error fetching operations:', err);
      }
    );
  }
  // Getters for companyVail form controls
  get companyVail() {
    return this.companyForm.controls;
  }
  // Function to clear form fields
  clear() {
    this.companyForm.reset();
  }

  addCompany() {
    
    let formData = new FormData();

    formData.append('companyName', this.companyForm.value.company_name);
    formData.append('companyEmail', this.companyForm.value.company_email);
    formData.append('portal', this.companyForm.value.company_website);
    formData.append('contact', this.companyForm.value.phoneNumber);
    formData.append('industryId', this.companyForm.value.idindustry_typ_id);
    formData.append('employeeCountId', this.companyForm.value.employee_count_id);
    formData.append('taxId',this.companyForm.value.tax_type_id);
    formData.append('taxInfo', this.companyForm.value.tax_information);
    formData.append('logo',this.selectedFile ? this.selectedFile : this.company_logo_path);
    formData.append('countryId', this.companyForm.value.country_id);
    formData.append('stateId', this.companyForm.value.state_id);
    formData.append('cityId', this.companyForm.value.city_id);
    formData.append('postalCode', this.companyForm.value.pin_code);
    formData.append('address', this.companyForm.value.street_address);
    // formData.append('email', this.userDetails.userEmail);
    formData.append('user_id', this.userDetails.userId);
    
    if (this.companyForm.valid) {
      this.ngxService.start();
      this._companyService._postAddCompanyApi(formData).subscribe((res: any) => {

        if (res) {
          this.ngxService.stop();
          if (res.success == true) {
            this._shared.ToastPopup('Registered Successfully', '', 'success');

            // let body = {
            //   customer_name:this.userDetails.name,        
            //   to:this.userDetails.userEmail ,
      
            // }
      
      
            // this._companyService._postWelcomeCompanyApi(body).subscribe((res: any) => {
      
            //   if (res.success) {
            //     // this._shared.ToastPopup(res.message, '', 'success');
            //     console.log("welcome mail sent successfully");
                
            //   }
      
            // }, (err: any) => {
      
            //   console.log(err);
              
            // })
          
            // this._shared.setUserDetails(JSON.stringify(res.data[0]));

          //   let currentValue = localStorage.getItem('userDetails');

          //   if (currentValue !== null) {

          //     let userDetails = JSON.parse(currentValue);

          //     userDetails.companyId = res.data.company_id;

          //     userDetails.roleId = res.data.roleId;

          //     userDetails.logoUrl = res.data.companyLogo;
          
          //     localStorage.setItem('userDetails', JSON.stringify(userDetails));

          //     this._shared.setJWTToken(res.data.token);
          // }

            setTimeout(() => {
              this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => this._router.navigateByUrl('/dashboard'));
            }, 1000);

          }
        }
      },(err)=>{
        console.log("Err",err);
        this.ngxService.stop();
      });
    }
  }

  // Function to allow only numeric input for Phone_Number field
  keyPressNumbers(event: any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  // Function to allow only alphabetic input
  ValidateAlpha(event: any) {
    var keyCode = (event.which) ? event.which : event.keyCode
    if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && keyCode != 32)
      return false;
    return true;
  }


  keyPressAlphabet(event: any) {
    var input = String.fromCharCode(event.keyCode);
    if (/[a-z A-Z]/.test(input)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  onFileSelected(event: any) {
    // this.selectedFile = event.target.files[0] as File;
    if (event.target.files[0]) {
      this.selectedFile = <File>event.target.files[0];
      console.log(" this.selectedFile",  this.selectedFile);
      
    }

  }

  changeCountry(e: any) {
    this.country_id = e.target.value;
    this.ngxService.start();
    this._companyService._getStateApi(this.country_id).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.statesData = res.data;
      },
      (err) => {
        console.log('Err', err);
        this.ngxService.stop();
      }
    );
  }

  changeState(e: any) {
    this.state_id = e.target.value;
    this.ngxService.start();
    this._companyService._getCityApi(this.state_id).subscribe((res: any) => {
      this.ngxService.stop();
      this.cityData = res.data;
    });
  }

  changeCity(e: any) {
    this.city_id = e.target.value;
    console.log('state', e.target.value);
  }

  getIndustryTypes() {
    this._companyService.getAllIndustries().subscribe(
      (res: any) => {
        console.log("Res",res);
        this.industryData = res['data'];
      },
      (err) => {
        console.log('Error', err);
      }
    );
  }

  getNumberOfEmployees() {
    this._companyService.getEmployeeCount().subscribe(
      (res: any) => {
        this.noOfEmployeesData = res['data'];
      },
      (err) => {
        console.log('Error', err);
      }
    );
  }

  getTaxTypes() {
    this._companyService.getTaxTypes().subscribe(
      (res: any) => {
        this.taxTypes = res['data'];
      },
      (err) => {
        console.log('Error', err);
      }
    );
  }

  getUserviewPermission() {
    let data = this._shared.getUserView();
    this.userPermission = data.data;
  }

  updateDisplayedValue(evt){
    this.companyForm.patchValue({
       country_code : '+' + evt.target.value
    })
  }

  getCountryCode(){
    this.profileService.getCountryCodeApi().subscribe((res:any)=>{
      console.log('res',res);
      this.country_codeList = res.data;
    })
  }
} 