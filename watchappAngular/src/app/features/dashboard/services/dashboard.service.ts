import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment';
import { ApiEndpointsService } from "src/app/core/services/api-endpoints.service";
import { ApiHttpService } from "src/app/core/services/api-http.service";


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;
  constructor(
    public _http: HttpClient,
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,
  ) { }


  _postAddCompanyApi(addCompany: object) {
  return this._apiHttpService.post(
    this._apiEndpointsService.postAddCompanyEndpoint(),addCompany);
  }

  _postAddSubscriberApi(addSubscriber: object) {
  return this._apiHttpService.post(
    this._apiEndpointsService.postAddSubscriberEndpoint(), addSubscriber);
  }

  _getAllContactApi() {
  // return this._http.get(`${this.apiUrl}/getall`);
  return this._apiHttpService.get(
    this._apiEndpointsService.getAllContactEndpoint()
  );
  }

  _getCountryApi() {
    return this._apiHttpService.get('https://raw.githubusercontent.com/sagarshirbhate/Country-State-City-Database/master/Contries.json');
  }

  _postSegmentApi(addSegment: object) {
  return this._apiHttpService.post(this._apiEndpointsService.postSegmentEndpoint(),addSegment);
  }

  _getSegmentApi() {
  return this._apiHttpService.get(this._apiEndpointsService.getSegmentEndpoint());
  }

  // _getAllInfoApi(Obj: object) {
  //   // // console.log( JSON.stringify(Obj));
  // return this._apiHttpService.post(this._apiEndpointsService.getAllInfoEndpoint(),Obj) ;
  // }

  _deleteSegmentApi(id) {
  return this._apiHttpService.delete(this._apiEndpointsService.deleteSegmentEndpoint(id));
  }

  // updateProfile(updateData:object){
  //   // return this._http.put(`${this.apiUrl}/updateUserByUserId`
  //   return this._apiHttpService.put(
  //     this._apiEndpointsService.putUpdateProfileEndpoint()
  //   ,updateData)
  // }


  dateBYgetCount(date:object){
    return this._apiHttpService.post(
      this._apiEndpointsService.getContactBYdateEndpoint()
    ,date)
  }

  _getGoogleApi() {
    return this._apiHttpService.get(this._apiEndpointsService.getGoogleAuth());
    }

}
