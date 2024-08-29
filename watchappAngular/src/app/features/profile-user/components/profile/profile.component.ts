import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormControlName, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ProfileUserService } from '../../service/profile-user.service';
import { CompanyService } from 'src/app/features/company/service/company.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  UserForm: FormGroup;
  userInfo: any;
  userDetails: any;
  body: any;
  selectedFile: File | any;
  changePassword: any = FormGroup;
  oldPassword: any = FormGroup;
  newPassword: any = FormGroup;
  editProfile: any = FormGroup;  
  editProfileset: any = FormGroup;  

  company_logo: File | any;
  

  allCountryData: any;
  companydata: any;
  type: string = "password";
  type1: string = "password";
  type2: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash"
  eyeIcon1: string = "fa-eye-slash";
  eyeIcon2: string = "fa-eye-slash"
  signUpVail: any;
  Profile_details: any;
  ProfilePicture: any;
  profilelogo: any;
  about_user: any;
  physical_adress: any;
  user_twitter_profile:any;
  user_facebook_profile:any;
  user_instagram_profile:any;
  user_linkedin_profile:any;
  Id: { user_id: any; };
  about: any;
  isConfirmPasswordDirty: boolean;
  passwordsMatching: boolean;
  confirmPasswordClass: string;



  constructor(
    private _profile: ProfileUserService,
    private _shared: SharedService,
    private formBuilder: FormBuilder,
    private _router: Router,
    private _companyService: CompanyService,

  ) { }

  url() {

    this._router.navigate(['/dashboard'])
  }

  get f() { return this.editProfile.controls; }

  get g() { return this.changePassword.controls; }

  ngOnInit(): void {

    this.getAllCountry();
    this.userDetails = this._shared.getUserDetails();
    this.Id =
    {
      user_id: this.userDetails.userId
    }
    this.setvalues(this.Id)

    this.editProfile = new FormGroup({
      Name: new FormControl('', [Validators.required]),
      Email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      UserPhoneNo: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10)]),
      companyLocation: new FormControl('', [Validators.required]),
      companyName: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      company_logo: new FormControl(''),
      Profile_details: new FormControl(''),
      ProfilePicture: new FormControl(''),
      profilelogo: new FormControl(''),
      user_job: new FormControl(''),
      about_user: new FormControl(''),
      physical_adress: new FormControl(''),
      user_twitter_profile:new FormControl(''),
      user_facebook_profile:new FormControl(''),
      user_instagram_profile:new FormControl(''),
      user_linkedin_profile:new FormControl(''),
    })

      this.changePassword = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: [null, [Validators.required, Validators.minLength(6), Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]],
      confirmPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c),Validators.pattern('^((?!.*[s])(?=.*[A-Z])(?=.*d).{8,99})'),]),
    },{ validators: this.passwordMatchValidator })


  }

  passwordMatchValidator(formGroup: FormGroup<any>) {
    const password = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }


  getcontrol(name: any): AbstractControl | null {

    return this.changePassword.get(name)


  }

  getAllCountry(){
    this._companyService._getCountryApi().subscribe((res:any) => {
     
      this.allCountryData = res.data;
    });
  }

  get passwordVail() {
    return this.changePassword.controls;
  }
  get getProfile_detailsVail() {
    return this.getProfile_detailsVail.controls;
  }



  savepassword() {
    // console.log("changePassword", this.changePassword.value);      this.allCountryData.Country = JSON.parse(this.allCountryData.Country)
   // // console.log("savePass",this.changePassword.newPassword.value);
    if (this.changePassword.controls['newPassword'].value == this.changePassword.controls['confirmPassword'].value) {
      // console.log("confirm password same")

      let savePass = {
        userId: this.userDetails.userId,
        oldPassword: this.changePassword.controls['oldPassword'].value,
        newPassword: this.changePassword.controls['newPassword'].value,
      }

      // console.log("Check Password", savePass);

      this._profile.changePassword(savePass).subscribe((res: any) => {
        // console.log('done', res);
        if (res.success == true) {
          this._shared.ToastPopup(res.message, '', 'success');
         
        } else {
          this._shared.ToastPopup(res.message, '', 'error');

        }

      })
    }

    else {
      alert("New Password and Confirm Password are not same...")
    }


    


  }

  
  


  EditProfile() {
    let formData = new FormData();
    // console.log("addProject", this.editProfile.value);
   console.log("nnn",this.editProfile.Name);
   
    formData.append('user_id',this.userDetails.userId),
    formData.append('name',this.editProfile.value.Name),
    formData.append('email',this.editProfile.value.Email),
    formData.append('logo',this.selectedFile ? this.selectedFile : this.ProfilePicture),
    formData.append('phone_no',this.editProfile.value.UserPhoneNo),
    formData.append('country',this.editProfile.value.country),
    formData.append('user_twitter_profile',this.editProfile.value.user_twitter_profile),
    formData.append('user_instagram_profile',this.editProfile.value.user_instagram_profile),
    formData.append('user_linkedin_profile',this.editProfile.value.user_linkedin_profile),
    formData.append('user_facebook_profile',this.editProfile.value.user_facebook_profile),
    formData.append('physical_adress',this.editProfile.value.physical_adress),
    formData.append('about_user',this.editProfile.value.about_user),
    formData.append('user_job',this.editProfile.value.user_job),

  console.log(formData , 'test');
  console.log("formvalue",this.editProfile.value);
  
    this._profile.updateProfile(formData).subscribe((res: any) => {
      

      if (res.success) {
        this._shared.ToastPopup('Profile updated successfully!','', 'success');
        this.setvalues(this.Id)
        this._router.navigate(['/profile']);
        window.location.reload();
    
      } else {
        this._shared.ToastPopup(res.message, '', 'error');
      }

    })

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

  checkPasswords(newPassword: string, renewPassword: string) {
    this.isConfirmPasswordDirty = true;
    if (newPassword == renewPassword) {
      this.passwordsMatching = true;
      this.confirmPasswordClass = 'form-control is-valid';
    } else {
      this.passwordsMatching = false;
      this.confirmPasswordClass = 'form-control is-invalid';
    }
  }


  onFileSelected(event: any) {
    // this.selectedFile = event.target.files[0] as File;
    if (event.target.files[0]) {
      this.selectedFile = <File>event.target.files[0];
    }
  }
  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }
  hideShow() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon1 = "fa-eye" : this.eyeIcon1 = "fa-eye-slash";
    this.isText ? this.type1 = "text" : this.type1 = "password";
  }
  hidePass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon2 = "fa-eye" : this.eyeIcon2 = "fa-eye-slash";
    this.isText ? this.type2 = "text" : this.type2 = "password";
  }


  setvalues(Id) {
    this._profile._getUserInfoApi(Id).subscribe((res: any) => {
      this.userInfo = res.data;
      this.userInfo.Country = this.userInfo.Country.replace(/"/g, '');
      console.log("this.userInfo.Country", this.userInfo.Country);
  
      console.log(this.userInfo);
  
      if (this.userInfo.ProfilePicture && this.userInfo.ProfilePicture.length > 0) {
        this.profilelogo = this.userInfo.ProfilePicture[0];
      } else {
        this.profilelogo = 'assets/images/onlylogo.jpg';
        console.log("Temporary profile logo set:", this.profilelogo);
      }
  
      console.log("this.userInfo.ProfilePicture[0]", this.userInfo.ProfilePicture[0]?.split('/').pop());
  
      let profile_pic = this.userInfo.ProfilePicture[0]?.split('/').pop();
      this.profilelogo = this.userInfo.ProfilePicture[0] || 'assets/images/photologo.jpeg';
      this.about = this.userInfo.AboutUser;
      console.log("this.profilelogo", this.profilelogo);
  
      this.editProfile.patchValue({
        profilelogo: profile_pic,
        Name: this.userInfo.Name,
        about_user: this.userInfo.AboutUser,
        user_job: this.userInfo.Job,
        Email: this.userInfo.EmailID,
        companyName: this.userInfo.CompanyName,
        companyLocation: this.userInfo.PhysicalAddress,
        UserPhoneNo: this.userInfo.PhoneNumber,
        country: this.userInfo.CountryId,
        physical_adress: this.userInfo.PhysicalAddress,
        user_twitter_profile: this.userInfo.TwitterProfile,
        user_facebook_profile: this.userInfo.FacebookProfile,
        user_instagram_profile: this.userInfo.InstagramProfile,
        user_linkedin_profile: this.userInfo.LinkedInProfile,
      });
    });
  }
  
  
  logImageSource(event: any) {
    console.log('Image loaded:', event.target.src);
  }
}
