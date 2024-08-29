import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpContextToken
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
//for catch:
import { catchError } from 'rxjs/operators';
import { SharedService } from '@shared/services/shared.service';
// import { NgxUiLoaderService } from 'ngx-ui-loader';
// import { Constants } from '@config/constant';
import * as _ from "lodash";
import { Router } from '@angular/router';


export const IGNORED_STATUSES = new HttpContextToken<number[]>(() => [600]);
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private _sharedService: SharedService,
    // private _ngxLoader:NgxUiLoaderService,
    // private _constant:Constants,
    private _router:Router
    ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
   
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse)=>{

        if(err['status'] === 401){
          this._sharedService.removeJWTToken();
          this._sharedService.getToastPopup(err['error']['message'],err['statusText'],'error');
          this._router.navigate(['/home']);
          return throwError(err);
        }

        if(err['error'] !== null){
          this._sharedService.getToastPopup(err['error']['message'],err['statusText'],'error');
        }else{
          this._sharedService.getToastPopup(err['message'],err['statusText'],'error');
        }

        // return EMPTY;
        return throwError(err);
      }),
      // finalize(()=>{
      //   this.isLoaderActivate(request) ? this._ngxLoader.stop() :this._ngxLoader.stop();
      // })
    );
  }

  // isLoaderActivate(request){
  //   var text = request['url'];
  //   var values = [
  //     this._constant.API_ENDPOINT+'/'+this._constant.API_URL_SPORTS_TOURNAMENT,
  //     this._constant.API_ENDPOINT+'/'+this._constant.API_URL_TOURNAMENT_MATCHES,
  //      ];
  //   if(_.some(values, (el) => _.includes(text, el))){
  //     return false;
  //   }else{
  //     return true;
  //   }
  // }
}
