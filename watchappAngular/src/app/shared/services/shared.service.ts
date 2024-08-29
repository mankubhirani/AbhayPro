import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {



  isisExpandedNavSideBar = new BehaviorSubject(true);
  userUpdated = new Subject();
  headerTabOptionSelected = new Subject();

  private selectedFileSubject = new BehaviorSubject<File | null>(null);
  selectedFile$ = this.selectedFileSubject.asObservable();
  permissionData: any;

  private refreshPermissionSubject = new Subject<boolean>();
  refresh$ = this.refreshPermissionSubject.asObservable();

  constructor(
    private _toastr: ToastrService,

  ) { }

  setSelectedFile(file: File | null) {
    this.selectedFileSubject.next(file);
  }



  ToastPopup(errorMsg: string, errorModule: string, errorType: string) {
    switch (errorType) {
      case 'error':
        this._toastr.error(errorMsg, errorModule, {
          progressBar: true
        });
        break;
      case 'info':
        this._toastr.info(errorMsg, errorModule, {
          progressBar: true
        });
        break;
      case 'success':
        this._toastr.success(errorMsg, errorModule, {
          progressBar: true
        });
        break;
    }
  }

  refreshPermissions() {
    this.refreshPermissionSubject.next(true);
  }


  getJWTToken() {
    // return sessionStorage.getItem('res');
    return localStorage.getItem('res');
    // return localStorage.setItem('data', JSON.stringify(set));
  }

  setJWTToken(res: string) {
    sessionStorage.setItem('res', res);
    localStorage.setItem('res', res);
  }

  getCompanyId(){
    return sessionStorage.getItem('res');
  }

  removeJWTToken() {
    localStorage.removeItem('res');
    localStorage.removeItem('data');
    sessionStorage.removeItem('data');
  }

  getUserDetails() {
    // return JSON.parse(sessionStorage.getItem('userDetails') || '{}');
    return JSON.parse(localStorage.getItem('userDetails') || '{}');
  }

  setUserDetails(userDetails: any) {
    sessionStorage.setItem('userDetails', userDetails);
    localStorage.setItem('userDetails', userDetails);
  }

  getUser() {
    return JSON.parse(sessionStorage.getItem('user') || '{}');

  }

  setUser(user: any) {
    sessionStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user));

  }

  removeUserDetails() {
    localStorage.removeItem('userDetails');
    sessionStorage.removeItem('userDetails');
  }

  getUserView() {
    this.permissionData = JSON.parse(localStorage.getItem('userPermission') || "[]");
    return this.permissionData;

  }


}

