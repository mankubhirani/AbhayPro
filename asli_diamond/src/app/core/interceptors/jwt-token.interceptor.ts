import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '@shared/services/shared.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {

  constructor(
    private _sharedService: SharedService,
    private _router:Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): any {
    const jwtTokenHeader: { [header: string]: string } = {};

    if (request.url !== "https://api.ipify.org?format=json" && request.url !== "https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_O9SDuoswBQEZ23Act1whK9doGxRSQ&ipAddress=") {
      jwtTokenHeader['X-Client-Domain'] = window.location.hostname;
    }

     if (this._sharedService.getJWTToken() !== null && request.url !== "https://api.ipify.org?format=json" && request.url !== "https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_O9SDuoswBQEZ23Act1whK9doGxRSQ&ipAddress=") {
      const token = this._sharedService.getJWTToken();
      const parsedJWT = this.parseJwt(token);

      if (Date.now() >= parsedJWT.exp * 1000) {
        this._sharedService.removeJWTToken();
        this._router.navigate(['/home']);
      } else {
        jwtTokenHeader['Authorization'] = 'Bearer ' + this._sharedService.getJWTToken();
      }
    }

    const reqWithHeader = request.clone({
      setHeaders: jwtTokenHeader,
    });

    return next.handle(reqWithHeader);

  }


   parseJwt(token): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }
}
