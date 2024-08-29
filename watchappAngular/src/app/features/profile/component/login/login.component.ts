import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { AbstractControl,FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Variables for eye icon toggle
  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash"

  // Form control for email input field with validation
  email = new FormControl('', [Validators.required, Validators.email]);

  // Login form group
  loginForm!: FormGroup;

  constructor(
    private _fb: FormBuilder,
    public _data: ProfileService,
    private _router: Router,
    private _shared: SharedService,
    private ngxService: NgxUiLoaderService,
  ) { }

  ngOnInit(): void {
    // Set up form configurations
    this._preConfig();
  }


  getcontrol(name: any): AbstractControl | null {
    return this.loginForm.get(name);
  }

  // Function to initialize form configurations
  private _preConfig() {
    this._createLoginForm();
  }

  // Function to create the login form
  private _createLoginForm() {
    this.loginForm = this._fb.group({
      email: ['', [Validators.required,  Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', [Validators.required ,Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]]
    });
  }




  // Function to handle login form submission
  submitLoginForm() {
    let loginData = {
      Email: this.loginForm.controls['email'].value,
      Pas: this.loginForm.controls['password'].value,
    };
  
    this.ngxService.start();
  
    // Call the API to log in the user
    this._data._postLoginApi(loginData).subscribe(
      async (res: any) => {
        this.ngxService.stop();
        // console.log("res.data[0]",res,"res.data[0]")
  
        let set = res.token;
  
        sessionStorage.setItem('data', JSON.stringify(set));
  
        if (res.success == true) {
          // Display success message and navigate to the dashboard on successful login
          this._shared.ToastPopup('', res.message, 'success');
          this._shared.setJWTToken(res['token']);
          this._shared.setUserDetails(JSON.stringify(res['data']));
  
          console.log(res.IsCompanyRegistrationFormFill);
          let isCompany = JSON.parse(res.IsCompanyRegistrationFormFill);
          let isIndividual = JSON.parse(localStorage.getItem('isIndividual') || "{}");
          console.log("isIndividual", isIndividual);
  
          // Redirect to addcompany if the user does not have a company ID
          if (!isCompany) {
            console.log("1");
            this._router.navigate(['/addcompany']);
          } else {
            this._router.navigate(['/dashboard']);
          }
        } else {
          // Display error message on login failure
          this.ngxService.stop();
          this._shared.ToastPopup('Error', res.message || 'Login failed. Please try again.', 'error');
        }
      },
      (err) => {
        this.ngxService.stop();
        console.log("Error", err);
        // Display error message if OTP is not found or there's an error in API call
        this._shared.ToastPopup('Error', err.message || 'An unexpected error occurred. Please try again.', 'error');
      }
    );
  }
  

  // Function to get the error message for email field validation
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  // Getter for accessing the email form control
  get userNameVail() {
    return this.loginForm.get('email')
  }

  // Getter for accessing the password form control
  get passwordVail() {
    return this.loginForm.get('password')
  }

  // Function to toggle password visibility
  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

}
