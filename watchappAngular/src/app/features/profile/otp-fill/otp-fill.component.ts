import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/services/shared.service';


@Component({
  selector: 'app-otp-fill',
  templateUrl: './otp-fill.component.html',
  styleUrls: ['./otp-fill.component.css']
})
export class OtpFillComponent implements OnInit {

  // Declare the form group
  createForm: FormGroup;

  // Variables for password show/hide feature
  type: string = "password";
  type1: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash"
  eyeIcon1: string = "fa-eye-slash"

  constructor(private fb: FormBuilder,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private ProfileService: ProfileService,
    private shared: SharedService) {

    // Initialize the form group with form controls and validators
    this.createForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      newPassword: [null, [Validators.required, Validators.maxLength(6), Validators.minLength(6), Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]],
      confirmPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c), Validators.pattern('^((?!.*[s])(?=.*[A-Z])(?=.*d).{8,99})'),]),
    }, { validators: this.passwordMatchValidator })

  }

  ngOnInit(): void {
  }

  // Custom validator function to check if password and confirm password match
  passwordMatchValidator(formGroup: FormGroup<any>) {
    const password = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  // Function to get control from the form group
  getcontrol(name: any): AbstractControl | null {
    return this.createForm.get(name)
  }

  // Function to handle form submission and validation
  verify() {
    if (this.createForm.valid) {
      // Perform necessary actions if form is valid
    } else {
      // Mark form controls as touched to trigger validation messages
      this.createForm.markAllAsTouched();
    }
  }

  // Function to submit the form data
  postapi() {
    let loginData = {

      otp: this.createForm.controls['code'].value,
     
      newPassword: this.createForm.controls['confirmPassword'].value,
    
      
    }

    // Log the loginData object for debugging purposes
    console.log(loginData.otp + "loginData");
    // console.log(loginData.Email + "Email");
    console.log(loginData.newPassword + "newPassword");



    this.ngxService.start();
    //Call the ProfileService to post the OTP and password data
    this.ProfileService.resetPasswordApi(loginData).subscribe((res: any) => {
      this.ngxService.stop();

      // Display success message after successful OTP submission
      this.shared.ToastPopup('PASSWORD CHANGE SUCCESSFUL', '', 'success');

      // Redirect to the login page after a delay
      setTimeout(() => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/login']));
      }, 2000);
    },(err) => {
      this.ngxService.stop();

      // Display error message if OTP is not found or there's an error in API call
      this.shared.ToastPopup('OTP not found', '', 'error');
    })
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

  // Function to allow only numbers in the input field
  keyPressNumbers(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
}
