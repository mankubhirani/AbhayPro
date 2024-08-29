import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {
  forgetPasswordForm: FormGroup;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private profileService: ProfileService,
    private shared: SharedService
  ) {}

  ngOnInit(): void {
    this.createPasswordForm();
  }

  createPasswordForm() {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    });
  }

  getcontrol(controlName: string): AbstractControl | null {
    return this.forgetPasswordForm.get(controlName);
  }

  submit() {
    this.isSubmitted = true;

    if (this.forgetPasswordForm.invalid) {
      this.shared.ToastPopup('Please enter a valid email', '', 'error');
      return;
    }

    const email = this.forgetPasswordForm.controls['email'].value;

    this.ngxService.start();
    this.profileService.forgetPassword({ email }).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.shared.ToastPopup(res.message, '', 'success');
        this.router.navigate(['/otp']);
      },
      (err) => {
        this.ngxService.stop();
        this.shared.ToastPopup('User not found', '', 'error');
      }
    );
  }
}
