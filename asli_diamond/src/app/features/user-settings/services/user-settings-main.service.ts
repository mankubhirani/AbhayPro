import { Injectable } from '@angular/core';
import { ApiEndpointsService } from '@core/services/api-endpoint.service';
import { ApiHttpService } from '@core/services/api-http.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsMainService {
  private currentBet:any = {};
  constructor(
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService
  ) { }


  userConfig:any = null;
  userConfigSubject = new BehaviorSubject<any>(null);


  _getTermCondApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getTermCondEndPoint());
  }

  _postChangePasswordApi(ChangePasswordBody: object){
    return this._apiHttpService
    .post(this._apiEndpointsService.getChangePasswordEndpoin(),ChangePasswordBody);
  }

  _getTransferStatementApi(trasnStatObj) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getTransferStatementEndPoint(),trasnStatObj);
  }


  _getUserConfigApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getUserConfigEndPoint());
  }

  _getSaveUserConfigApi(saveUserConfig: object) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getSaveUserConfigEndPoint(),saveUserConfig);
  }

  _getUserBetsApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getUserBets());
  }

  _getProfitLossApi(profitLossObj) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getProfitLoss(),profitLossObj);
  }

  _getBetHistoryForUserApi(betHistoryObj){
    return this._apiHttpService
    .post(this._apiEndpointsService._getBetHistoryForUserEndpoint(),betHistoryObj);
  }

  _getBetHistoryForUserAccountStatementApi(betHistoryObj){
    return this._apiHttpService
    .post(this._apiEndpointsService._getBetHistoryForUserAccountStatementEndpoint(),betHistoryObj);
  }
  getPlBets(){
      return this.currentBet;
  }

  setPlBets(currentBet:any){
      this.currentBet =currentBet;
  }

  _getAccountStatementApi(acctObj){
    return this._apiHttpService
    .post(this._apiEndpointsService.getAccountStatement(),acctObj);
  }

}
