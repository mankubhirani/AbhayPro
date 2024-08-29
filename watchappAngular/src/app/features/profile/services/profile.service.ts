
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment';
import { ApiEndpointsService } from "src/app/core/services/api-endpoints.service";
import { ApiHttpService } from "src/app/core/services/api-http.service";
 
 
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  getUserDetailsList() {
    throw new Error('Method not implemented.');
  }
  postOTP(loginData: { otp: any; email: string | null; newPassword: any; }) {
    throw new Error('Method not implemented.');
  }
 
  // private apiUrl = environment.apiUrl;
  constructor(
    public _http: HttpClient,
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,
  ) { }
 
  // _postLoginApi(loginBody: object){
  //   return this._http.post(`${this.apiUrl}/login`,loginBody);
 
  // }
  
  _postSignUpApi(signupBody: object) {
    return this._apiHttpService.post(
      this._apiEndpointsService.getSignUpEndpoint(),
      signupBody
    )
  }
  _postLoginApi(loginBody: object) {
    return this._apiHttpService.post(
      this._apiEndpointsService.getLoginEndpoint(),
      loginBody
    )
  }
 
  forgetPassword(email: object) {
    return this._apiHttpService.post(
      this._apiEndpointsService.forgetPassword(),
      email
    )
  }
 
  resetPasswordApi(loginData: object) {
    return this._apiHttpService.post(
      this._apiEndpointsService.resetPassword(),
      loginData
    )
  }
 
  getDesignations() {
    return this._apiHttpService.get(this._apiEndpointsService.getDesignations())
  }
 
  // saveRequestDemoApi(body: object) {
  //   return this._apiHttpService
  //     .post(this._apiEndpointsService.SavedDemoRequestEndpoint(), body);
  // }
 
  getUserPermissionsApi(body: any) {
    return this._apiHttpService.post(
      this._apiEndpointsService.getUserPermissionEndpoint(), body).toPromise();
  }
 
  getCountryCodeApi() {
    return this._apiHttpService.get(this._apiEndpointsService.getCountryCodeListEndpoint());
  }
  getServers(Id){
    return this._apiHttpService.post(this._apiEndpointsService.getServers(),
  Id)
  }
 
  getAlarmsAndTriggers(Id){
    return this._apiHttpService.post(this._apiEndpointsService.getAlarmsAndTriggers(),
  Id)
  }
 
  addAlarmAndTrigger(body: object) {
    return this._apiHttpService.post(this._apiEndpointsService.addAlarmAndTrigger(),
  body)
  }
 
  // ********************  Map Server  *******************
 
  // getAddMapServer(Id) {
  //   return this._apiHttpService.post(
  //     this._apiEndpointsService.getAddMapServerEndpoint(),
  //     Id
  //   )
  // }
  postmapApi(mapBody: object) {
    return this._apiHttpService.post(
      this._apiEndpointsService.getAddMapServerEndpoint(),
      mapBody
    )
  }
 
  // ********************  Get Map Server  *******************
 
  getMapApi(Id) {
    return this._apiHttpService.post(
      this._apiEndpointsService.getMapServerEndpoint(),
      Id
    )
  }
 
  getTaskScheduled(Id) {
    return this._apiHttpService.post(this._apiEndpointsService.getTaskScheduled(),
      Id
    )
  }
 
  addTaskScheduler(Id) {
    return this._apiHttpService.post(this._apiEndpointsService.addTaskScheduler(),
      Id)
  }
 
  getTaskServers(Id) {
    return this._apiHttpService.post(this._apiEndpointsService.getTaskServers(),
      Id)
  }
//---task Schedular Application
  getApplicationTypes(Id){
    return this._apiHttpService.get(this._apiEndpointsService.getApplicationTypes(),
  Id )
  }
 
  deleteMapServer(id:any){
    debugger
    console.log(id.msd_id,"dsdsd");
    return this._apiHttpService.delete(this._apiEndpointsService.deleteMapServerEndpoint(),id
    )
  }
 
  updateMapServer(body: any){
    return this._apiHttpService.put(this._apiEndpointsService.updateMapServerEndpoint(),
    body )
  }
//---updateTaskScheduled---
updateTaskScheduled(Id){
  return this._apiHttpService.put(this._apiEndpointsService.updateTaskScheduled(),
Id)
}
//---Auto clear log in get error logs
  getErrorLogs(Id){
    return this._apiHttpService.post(this._apiEndpointsService.getErrorLogs(),
  Id)
  }
//---Auto clear log in get time span
  getTimespan(Id){
    return this._apiHttpService.get(this._apiEndpointsService.getTimespan(),
  Id)
  }
//----Auto clear log in add auto clear log
addAutoClearLog(Id){
    return this._apiHttpService.post(this._apiEndpointsService. addAutoClearLog(),
  Id)
  }

  

//---deleteTaskScheduled
  deleteTaskScheduled(Id){
    return this._apiHttpService.delete(this._apiEndpointsService.deleteTaskScheduled(Id))
  }
 
 
  getApplicationCheckUp(Id) {
    return this._apiHttpService.post(this._apiEndpointsService.getApplicationCheckUpEndpoint(),
      Id
    )
  }
  
  getServerName(Id){
    return this._apiHttpService.get(this._apiEndpointsService.getServerNameEndpoint(),
    Id
  )
  }
 
  getStatusName(Id){
    return this._apiHttpService.get(this._apiEndpointsService.getStatusNameEndpoint(),
  Id)
  }
 
  getAlarmApplicationTypes(Id){
    return this._apiHttpService.get(this._apiEndpointsService.getApplicationTypeEndpoint(),
  Id)
  }
  //-----------------------------------create-user---------------
  createUser(body:object) {
    return this._apiHttpService.post(this._apiEndpointsService.createUserEndpoint(),body);
}
//-----------------------------------user-details-list---------------

getUserList(Id) {
  return this._apiHttpService.get(this._apiEndpointsService.userDetailsListUserManagementEndpoint(),Id);
}
getFileSummary(Id){
   return this._apiHttpService.post(this._apiEndpointsService.getFileSummaryEndpoint(),Id);
}
getAutoClearLog(Id){
  return this._apiHttpService.post(this._apiEndpointsService.getAutoClearLog(),Id)
}
getHealthCheckUp(Id){
  return this._apiHttpService.post(this._apiEndpointsService.getHealthCheckUpEndpoint(),Id);
}

getOprations(Id){
  return this._apiHttpService.get(this._apiEndpointsService.getOprations(),Id);
}
 addApplication(Id){
  return this._apiHttpService.post(this._apiEndpointsService.addApplication(),Id)
 }
 getApplications(Id){
  return this._apiHttpService.post(this._apiEndpointsService.getApplications(),Id)
 }
 
 getWiseLogs(Id){
  return this._apiHttpService.post(this._apiEndpointsService.getWiseLogs(),Id)
 }

 addWiseLogs(Id){
  return this._apiHttpService.post(this._apiEndpointsService.addWiseLogs(),Id)
}

 getDashboardStatistics(body: Object){
  return this._apiHttpService.post(this._apiEndpointsService.getDashboardStatisticsEndpoint(),body)
 }
 getCountryCode(Id){
  return this._apiHttpService.get(this._apiEndpointsService.getCountryCode(),Id)
 }
 getScheduledTask(Id){
  return this._apiHttpService.post(this._apiEndpointsService.getScheduledTask(),Id)
 }

 getApplicationPool(Id){
  return this._apiHttpService.post(this._apiEndpointsService.getApplicationPool(),Id)
 }

 getISSServerStatus(Id){
  return this._apiHttpService.post(this._apiEndpointsService.getIssServerStatus(),Id)
 }
 getDatabaseHealthStatus(Id){
  return this._apiHttpService.get(this._apiEndpointsService.getDatabaseHealthStatusEndpoint(),Id)
 }

 getTaskDetailsGraph(Id){
  return this._apiHttpService.post(this._apiEndpointsService.getTaskDetailsGraphEndpoint(),Id)
 }

 getHealthCheckUpApplicationGraph(Id){
  return this._apiHttpService.post(this._apiEndpointsService.getHealthCheackupApplicationPerformanceGraphEndpoint(),Id)
 }
 getAppHealthGraph(Id){
  return this._apiHttpService.post(this._apiEndpointsService.getAppHealthGraphEndpoint(),Id)
 }

 getServerIP(Id){
  return this._apiHttpService.post(this._apiEndpointsService.getServerIP(),Id)
 }

 getpoolgraph(Id){
  return this._apiHttpService.post(this._apiEndpointsService.getpoolgraph(),Id)
 }

}