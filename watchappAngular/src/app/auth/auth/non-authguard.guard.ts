import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class NonAuthguardGuard implements CanActivate {
  constructor(
    private _sharedService: SharedService,
    private _router: Router
  ){}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isLoggedIn = this._sharedService.getJWTToken();
      if(isLoggedIn){
        this._router.navigate(['/dashboard'])
        return false
      } else {
          return true
      }
  }
  
}
