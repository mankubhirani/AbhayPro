import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { AuthService } from '../../services/auth.service';
import jwt_decode from "jwt-decode";
import { UserSettingsMainService } from 'src/app/features/user-settings/services/user-settings-main.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signInForm: FormGroup;
  show: boolean = false;
  isLoading:boolean = false;
  button = 'LOGIN';
  demoLoading = false;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _sharedService: SharedService,
    private _userSettingsService:UserSettingsMainService
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    this._preConfig();
  }

  private _preConfig() {
    this._createSignInForm();
  }

  _createSignInForm(){
    this.signInForm = this._fb.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
  }


  demoLogin(){
    this.demoLoading = true;
    this._sharedService._getDemoLoginApi().subscribe(res=>{
      this._sharedService.setJWTToken(res['token']);
      this._sharedService.setUserDetails(jwt_decode(res['token']));
      this.demoLoading = false;
      this._router.navigate(['/'])
    },err=>{
      this.demoLoading = false;
      if(err['error'] !== null){
        // this._sharedService.getToastPopup(err['error']['message'],err['statusText'],'error');
      }else{
        // this._sharedService.getToastPopup(err['message'],err['statusText'],'error');
      }
    })
  }



  onSubmitSignIn(){
    this.isLoading = true;
    let loginData = {
      username: this.signInForm.value['username'],
      pwd: this.signInForm.value['password'],
      userIp: this._sharedService.getIpAddress(),
      rememberme: true
    }
    

    //this._sharedService.getIPApi().subscribe(res=>{
      // let ip = '127.0.0.1';
      // loginData['userIp'] = ip;
      /*this._sharedService.getIPV2Api(ip).subscribe((res: any)=>{
        sessionStorage.setItem('ipdata',JSON.stringify(res));

      })*/
      this._authService._postLoginApi(loginData).subscribe(
        (res: any) => {
          this._sharedService.setJWTToken(res['token']);
          this._sharedService.setUserDetails(jwt_decode(res['token']));
          this._router.navigate(['/'])
          this._userSettingsService._getUserConfigApi().subscribe(
            (res) => {
              this._userSettingsService.userConfigSubject.next(res)
            });
        },
        (err) => {
          this.isLoading=false
          if(err['error'] !== null){
            // this._sharedService.getToastPopup(err['error']['message'],err['statusText'],'error');
          }else{
            // this._sharedService.getToastPopup(err['message'],err['statusText'],'error');
          }
        },
        () => this.isLoading=false
        )
    //},
    //() => this.isLoading=false,
    //() => this.isLoading=false
    //)

  }

}
