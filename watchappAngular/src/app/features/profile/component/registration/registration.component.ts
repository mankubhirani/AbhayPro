
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import jwt_decode from "jwt-decode";
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  integerRegex = /^\d+$/;
  // Variables for eye icon toggle
  type: string = "password";
  type1: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash"
  eyeIcon1: string = "fa-eye-slash"
  getCountryCodeArr:any;
  userID:any
  
  // Variable to disable the button
  isDisabled: boolean;

  // separateDialCode = true;
  // SearchCountryField = SearchCountryField;
  // CountryISO = CountryISO;
  // preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.Canada];

  // phoneNumber: string;

  
 
  // Variable to store the original password
  original_Password: string = "";
 
  // Form control for email input field with validation
  email = new FormControl('', [Validators.required, Validators.email]);
 
  // Variable to check if the form is submitted
  submitted: any;
 
  // Sign-up form group
  signupForm!: FormGroup;
  
 
 
  
  constructor(
    public _profileservice: ProfileService,
    private formBuilder: FormBuilder,
    public _data: ProfileService,
    private _router: Router,
    private _shared: SharedService,
    private ngxService: NgxUiLoaderService,
  ) { }
 
 
  ngOnInit(): void {

    let userDetail = JSON.parse(localStorage.getItem('userDetails') || '{}');
    this.userID = userDetail.userId;
    
    this._preConfig();
    this.getCountry();
  }
 
  // Function to initialize form configurations
  private _preConfig() {
    this._createSignUpForm();
  }
 
  private _createSignUpForm() {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      username: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      country_code: [, [Validators.required]],
      phone: new FormControl('', [Validators.required, Validators.maxLength(12), Validators.minLength(10), Validators.pattern(this.integerRegex)]),
      designation: [null, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]],
      terms : [,[Validators.required]],
      IsCompany:[,[Validators.required]],
    }, { validators: this.passwordMatchValidator }
    
    );}
 
  // Function to validate password match
  passwordMatchValidator(formGroup: FormGroup<any>) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirm_password')?.value;
 
    if (password !== confirmPassword) {
      formGroup.get('confirm_password')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirm_password')?.setErrors(null);
    }
  }


  getCountry() {
    let body = {
      userId: this.userID
    };

    this._profileservice.getCountryCode(body).subscribe(
      (res: any) => {
        this.getCountryCodeArr = res.data;
      },
      (err: any) => {
        console.error('Error fetching operations:', err);
      }
    );
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

  // Function to get the form control by name
  getcontrol(name: any): AbstractControl | null {
    return this.signupForm.get(name);
  }
 
  // Getter for accessing the form controls
  get f() {
    return this.signupForm.controls;
  }
 
  // Function to handle sign-up form submission
  signup() {
    this.submitted = true;
 
    // Check if the password and confirm_password match
    if (this.signupForm.value.password != this.signupForm.value.confirm_password) {
      this._shared.ToastPopup('Password did not match with confirm password', '', 'error');
      return;
    }
 
    // Check if the form is valid and submitted
    // if (this.submitted && this.signupForm.valid) {
    //   this.original_Password = this.signupForm.value.confirm_password;
 
      // Prepare data to send to the API
      let signUpData = {
        Name: this.signupForm.controls['name'].value,
         Email: this.signupForm.controls['email'].value,
         Country_code : this.signupForm.controls['country_code'].value,
        Phone: this.signupForm.controls['phone'].value,
        Password:this.signupForm.controls['password'].value,
        IsTermCondition : this.signupForm.controls['terms'].value,
        IsCompany:this.signupForm.controls['IsCompany'].value,
        
      }
 
       // Call the sign-up API
      this.ngxService.start();
      this._data._postSignUpApi(signUpData).subscribe(
        (res: any) => {
          // console.log("registered", res);
          this.ngxService.stop();
          if (res.success == true) {
            // Display success message and navigate to login page on successful registration
            this._shared.ToastPopup('Successfully', res.message, 'success');
            this._router.navigate(['/login']);
            localStorage.setItem('isIndividual', JSON.stringify(this.signupForm.controls['IsCompany'].value));

            this.signupForm.reset();
          } else {
            // Display error message on registration failure
            this._shared.ToastPopup('password', res.message, 'error');
          }
        }, (err) => {
          this.ngxService.stop();
 
          // Display error message if OTP is not found or there's an error in API call
          this._shared.ToastPopup('Please Enter Valid Data', '', 'error');
        })
    // }
  }
 
  // Getter for accessing the form controls in template
  get signUpVail() {
    return this.signupForm.controls;
  }
 
  // Getter for accessing the name form control
  get firstnameVail() {
    return this.signupForm.get('name')
  }
 
  // Getter for accessing the username form control
  get lastnameVail() {
    return this.signupForm.get('username')
  }
 
  // Getter for accessing the email form control
  get emailVail() {
    return this.signupForm.get('email')
  }
 
  // Getter for accessing the mobile form control
  get mobileVail() {
    return this.signupForm.get('mobile')
  }
 
  // Getter for accessing the password form control
  get passwordVail() {
    return this.signupForm.get('password')
  }
 
  // Function to toggle password visibility
  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }
 
  // Function to toggle confirm password visibility
  hideShow() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon1 = "fa-eye" : this.eyeIcon1 = "fa-eye-slash";
    this.isText ? this.type1 = "text" : this.type1 = "password";
  }
 
  ValidateAlpha(event: any) {
 
    var keyCode = (event.which) ? event.which : event.keyCode
 
    if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && keyCode != 32)
 
      return false;
 
    return true;
  }
  updateDisplayedValue(evt){
    this.signupForm.patchValue({
       country_code : '+' + evt.target.value
    })
  }
 
  TermsAndConditions(){
    this._router.navigate(['/t&c']);
  }
}
 