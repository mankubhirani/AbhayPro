import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment';
import { ApiEndpointsService } from "src/app/core/services/api-endpoints.service";
import { ApiHttpService } from "src/app/core/services/api-http.service";
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProfileUserService {
  // profile_photo:any='';
  // user_name:any='';
  private profilePhotoSubject = new BehaviorSubject<any>(null);
  private userNameSubject = new BehaviorSubject<any>(null);

  profilePhoto$ = this.profilePhotoSubject.asObservable();
  userName$ = this.userNameSubject.asObservable();
  private apiUrl = environment.apiUrl;
  constructor(
    public _http: HttpClient,
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,
  ) { }

  _getAllInfoApi(Obj: object) {
    // // console.log( JSON.stringify(Obj));
  return this._apiHttpService.post(this._apiEndpointsService.getAllInfoEndpoint(),Obj) ;
  }
  _getAllApplicationApi(Obj: object) {
    // // console.log( JSON.stringify(Obj));
  return this._apiHttpService.get(this._apiEndpointsService.getApplicationsEndpoint()) ;
  }
  _getUserInfoApi(Obj: object) {
    // // console.log( JSON.stringify(Obj));
  return this._apiHttpService.post(this._apiEndpointsService.getUserInfoEndpoint(),Obj) ;
  }
  
  
  updateProfile(updateData:object){
    // return this._http.put(`${this.apiUrl}/updateUserByUserId`
    return this._apiHttpService.post(
      this._apiEndpointsService.putUpdateProfileEndpoint()
    ,updateData)
  }

  changePassword(updateData:object){
    // return this._http.put(`${this.apiUrl}/updateUserByUserId`
    return this._apiHttpService.post(
      this._apiEndpointsService.putUpdateChangePasswordEndpoint()
    ,updateData)
  }
  // setDatainHeader(photo: any,name:any) {
  //   this.profile_photo = photo;
  //   this.user_name=name;
  //   console.log("...",this.profile_photo ,this.user_name);
    
  // }
 
  setProfilePhoto(photo: any) {
    this.profilePhotoSubject.next(photo);
  }

  getProfilePhoto() {
    this.userNameSubject.next(name);
  }
  // getUserName() {
  //   return this.user_name;
  // }
}
