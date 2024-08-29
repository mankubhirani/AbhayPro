import { Injectable } from '@angular/core';
import { ApiEndpointsService } from '@core/services/api-endpoint.service';
import { ApiHttpService } from '@core/services/api-http.service';

@Injectable({
  providedIn: 'root'
})
export class CasinoService {

  constructor(private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService) { }


  _getCasinoProviderApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getCasinoProviderEndPoint());
  }

  _getgetCasinoGamesApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getCasinoProviderEndPoint());
  }

  _postCasinoGamesListApi(body: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getCasinoGamesEndPoint(), body);
  }

  _getCasinoCategoryApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getCasinoCategoryEndPoint());
  }

  _postCasinoURLApi(body: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getCasinoURLEndPoint(), body);
  }


  _getCasinoProvider2Api() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getProviderForUserEndPoint());
  }

  
  
}
