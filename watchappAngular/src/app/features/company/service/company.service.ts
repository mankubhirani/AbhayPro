import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment';
import { ApiEndpointsService } from "src/app/core/services/api-endpoints.service";
import { ApiHttpService } from "src/app/core/services/api-http.service";

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private _postWelcomeCompanyApi(body: { customer_name: any; to: any; }) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = environment.apiUrl;
  constructor(
    public _http: HttpClient,
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,
  ) { }


  _getCountryApi() {
    return this._apiHttpService.get(this._apiEndpointsService.getCountry());
  }


  _getStateApi(id: any) {
    return this._apiHttpService.get(
      this._apiEndpointsService.getStateEndpoint(id));
  }

  _getCityApi(id: any) {
    return this._apiHttpService.get(
      this._apiEndpointsService.getCityEndpoint(id));
  }

  _postAddCompanyApi(addCompany: object) {

    // console.log('addCompany', addCompany);

    return this._apiHttpService.post(
      this._apiEndpointsService.postAddCompanyEndpoint(), addCompany);

  }


  _getCompanyDetailsApi(CompanyId: object) {

    // console.log('addCompany', addCompany);

    return this._apiHttpService.post(
      this._apiEndpointsService.getCompanyDetailsEndpoint(), CompanyId);

  }
  
  // _postWelcomeCompanyApi(addCompany: object) {

  //   // console.log('addCompany', addCompany);

  //   return this._apiHttpService.post(
  //     this._apiEndpointsService.WelcomeCompanyEndpoint(), addCompany);

  // }
  _getAllCompanyApi() {
    // return this._http.get(`${this.apiUrl}/getall`);
    return this._apiHttpService.get(
      this._apiEndpointsService.getAllCompanyEndpoint()
    );
  }

  getCompanyByid(body:object) {

    return this._apiHttpService
      .post(this._apiEndpointsService.getCompanyEndpoint(),body);
  }

  getCompanyByuserId(id) {

    return this._apiHttpService
      .get(this._apiEndpointsService.getCompanyByEndpoint(id));
  }

  updateCompanyApi(body: object) {
    return this._apiHttpService.post(
      this._apiEndpointsService.updateCompanyEndpoint(), body);
  }

  _getTimezoneApi() {
    return this._apiHttpService.get(this._apiEndpointsService.getTimezoneData());
  }

  _getEmployeeData() {
    return this._apiHttpService.get(this._apiEndpointsService.getEmployeeData())
  }

  getAllIndustries(){
    return this._apiHttpService.get(this._apiEndpointsService.getIndustryTypes())
  }

  getEmployeeCount(){
    return this._apiHttpService.get(this._apiEndpointsService.getEmployeeCount())
  }

  getTaxTypes(){
    return this._apiHttpService.get(this._apiEndpointsService.getTaxTypes())
  }
}
