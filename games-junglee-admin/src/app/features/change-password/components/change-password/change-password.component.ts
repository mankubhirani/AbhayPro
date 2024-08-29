import { Component, HostListener, OnInit } from '@angular/core';
import { ChangePasswordService } from '../../services/change-password.service';
import { SharedService } from '../../../../shared/services/shared.service';
import { FormGroup, FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm!: FormGroup;
  sideBarClass:String = 'mobile-menu';

  isLeftMenuOpen: boolean;
  mainClass:String = 'col-md-10';
  authObj = {
    currentPassword: "",
    newPassword: "",
    retypePassword: ""
  }
  isMobileView = false;


  onResize() {
    if (window.innerWidth <= 767) {
      this.isMobileView = true;
    } else {
      this.isMobileView = false;
    }
  }

  constructor(private _changePasswordService: ChangePasswordService,
    private _sharedService: SharedService,
    private formbuilder: FormBuilder) {
      this.onResize();
    this.changePasswordForm = this.formbuilder.group({
      oldPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      newPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c), Validators.pattern(
        "^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
      )]),
      confirmPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
    },
      {

        validators: this.Mustmatch('newPassword', 'confirmPassword')
      }
    )
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  ngOnInit(): void {
    this._sharedService.leftMenuStatus.subscribe((res: any) => {
      this.isLeftMenuOpen = res.leftMenuOpen;
      if(this.isLeftMenuOpen){
        this.sideBarClass = 'mobile-menu';
        this.mainClass = 'col-md-10';
      } else {
        this.sideBarClass = '';
        this.mainClass = 'col-md-12';
      }
    });
    // var sportId:any;
    // this._sharedService.testFunc(sportId).subscribe((data:any)=>{
    // });
  }

  postChangePassword() {
    if (this.authObj.currentPassword == "") {
      this._sharedService.getToastPopup("Enter current password", 'Password', 'error');
      return;
    }
    else if (this.authObj.newPassword == "") {
      this._sharedService.getToastPopup("Enter new password", 'Password', 'error');
      return;
    }
    else if (this.authObj.retypePassword == "") {
      this._sharedService.getToastPopup("Enter confirm password", 'Password', 'error');
      return;
    }

    this._changePasswordService._getChangePasswordeApi(this.authObj).subscribe((res: any) => {
      this._sharedService.getToastPopup(res.message, 'Password', 'success');
      this.authObj.currentPassword = "";
      this.authObj.newPassword = "";
      this.authObj.retypePassword = "";
    })
  }

  // Validation & Confirm Password

  get oldPasswordVail() {
    return this.changePasswordForm.get('oldPassword')
  }

  get newPasswordVail() {
    return this.changePasswordForm.get('newPassword')
  }

  get confirmPasswordVail() {
    return this.changePasswordForm.get('confirmPassword')
  }

  Mustmatch(newPassword: any, confirmPassword: any) {
    return (formGroup: FormGroup) => {
      const newPasswordcontrol = formGroup.controls[newPassword];
      const confirmPasswordcontrol = formGroup.controls[confirmPassword];

      if (confirmPasswordcontrol.errors && !confirmPasswordcontrol.errors['Mustmatch']) {
        return;
      }
      if (newPasswordcontrol.value !== confirmPasswordcontrol.value) {
        confirmPasswordcontrol.setErrors({ Mustmatch: true });
      }
      else {
        confirmPasswordcontrol.setErrors(null);
      }
    }
  };

  resetForm() {
    this.changePasswordForm.reset();
  }

  toggleMenu(){
    if(this.isMobileView){
      this._sharedService.leftMenuStatus.next({
        'leftMenuOpen': false
      });
    }
   }

}
