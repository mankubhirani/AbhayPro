
// Angular Modules
import { Injectable } from '@angular/core';
// Application Classes
import { UrlBuilder } from '../../shared/classes/url-builder';
import { QueryStringParameters } from '../../shared/classes/query-string-parameters';
 
// Application Constants
import { Constants } from 'src/app/config/constant';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
 
@Injectable()
export class ApiEndpointsService {
  constructor(
    // Application Constants
    private _constants: Constants
    //task-schedular
  
  ) { }
  /* #region URL CREATOR */
  // URL
  private createUrl(
    action: string,
    isMockAPI: boolean = false
  ): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(
      isMockAPI ? this._constants.API_MOCK_ENDPOINT :
        this._constants.API_ENDPOINT,
      action
    );
    return urlBuilder.toString();
  }
  // URL WITH QUERY PARAMS
  private createUrlWithQueryParameters(
    action: string,
    queryStringHandler?:
      (queryStringParameters: QueryStringParameters) => void
  ): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(
      this._constants.API_ENDPOINT,
      action
    );
    // Push extra query string params
    if (queryStringHandler) {
      queryStringHandler(urlBuilder.queryString);
    }
    return urlBuilder.toString();
  }
 
  // URL WITH QUERY PARAMS
  private createUrlWithQueryParametersExclude(
    action: string,
    queryStringHandler?:
      (queryStringParameters: QueryStringParameters) => void
  ): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(
      this._constants.API_ENDPOINT,
      action
    );
    // Push extra query string params
    if (queryStringHandler) {
      queryStringHandler(urlBuilder.queryString);
    }
    return urlBuilder.toString();
  }
 
  // URL WITH PATH VARIABLES
  private createUrlWithPathVariables(
    action: string,
    pathVariables: any[] = []
  ): string {
    let encodedPathVariablesUrl: string = '';
    // Push extra path variables
    for (const pathVariable of pathVariables) {
      if (pathVariable !== null) {
        encodedPathVariablesUrl +=
          `${encodeURIComponent(pathVariable.toString())}/`;
      }
    }
    const urlBuilder: UrlBuilder = new UrlBuilder(
      this._constants.API_ENDPOINT,
      `${action}${encodedPathVariablesUrl}`
    );
    return urlBuilder.toString();
  }
  /* #endregion */
 
  private createPostInstallUrl(
    action: string,
    isMockAPI: boolean = false
  ): string {
    const urlBuilder: UrlBuilder = new UrlBuilder(
      isMockAPI ? this._constants.API_MOCK_ENDPOINT :
        '',
      action
    );
    return urlBuilder.toString();
  }
 
  //Example
 
  //   public getNewsEndpoint(): string {
  //     return this.createUrl('news');
  //   }
 
  //   This method will return:
  //    https://domain.com/api/news
 
 
  //   public getNewsEndpoint(): string {
  //     return this.createUrl('news', true);
  //   }
 
  //   This method will return:
  //   https://mock-domain.com/api/news
 
 
  //   public getProductListByCountryAndPostalCodeEndpoint(
  //     countryCode: string,
  //     postalCode: string
  //   ): string {
  //     return this.createUrlWithQueryParameters(
  //       'productlist',
  //       (qs: QueryStringParameters) => {
  //         qs.push('countryCode', countryCode);
  //         qs.push('postalCode', postalCode);
  //       }
  //     );
  //   }
 
  //   This method will return:
  //   https://domain.com/api/productlist?countrycode=en&postalcode=12345
 
 
  //   public getDataByIdAndCodeEndpoint(
  //     id: string,
  //     code: number
  //   ): string {
  //     return this.createUrlWithPathVariables('data', [id, code]);
  //   }
 
  //   This method will return:
  //   https://domain.com/api/data/12/67
 
 
  // Now, let’s go to a component and use them all together.
 
  // constructor(
  //   // Application Services
  //   private apiHttpService: ApiHttpService,
  //   private apiEndpointsService: ApiEndpointsService
  // ) {
  //     ngOnInit() {
  //     this.apiHttpService
  //       .get(this.apiEndpointsService.getNewsEndpoint())
  //       .subscribe(() => {
  //         // console.log('News loaded'))
  //       });
  // }
  public getSignUpEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_SIGN_UP);
  }
 
  public getLoginEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_LOGIN);
  }
 
  public getDesignations(): string {
    return this.createUrl(this._constants.API_ENDPOINT_DESIGNATIONS);
  }
 
  public postAddSubscriberEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_ADD_SUBSCRIBER);
  }
 
  public putUnSubscriberEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_UNSUBSCRIBER);
  }
  public getAutoClearLog(){
    return this.createUrl(this._constants.API_ENDPOINT_GET_AUTO_CLEAR_LOG);
  }
 
  public postAddCompanyEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_ADD_COMPANY);
  }
  public getCompanyDetailsEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_COMPANY_DETAILS);
  }
  
 
  public updateCompanyEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_UPDATE_COMPANY);
  }
 
  public getAllCompanyEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_All_COMPANY);
  }
 
  public getCompanyEndpoint() {
    return this.createUrl(this._constants.API_ENDPOINT_GET_COMPANYBY_ID);
  }
 
  public getCompanyByEndpoint(id) {
    return this.createUrl(this._constants.API_ENDPOINT_BY_USER_ID_COMPANY + id) + '/';
  }
 
  public getSegmentCategories() {
    return this.createUrl(this._constants.API_ENDPOINT_SEGMENT_CATEGORIES);
  }
 
  public getSegmentCriterias() {
    return this.createUrl(this._constants.API_ENDPOINT_SEGMENT_CRITERIAS);
  }
 
  public getAllContactEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_All_CONTACT);
  }
 
  public getBYContactListEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_COMPANY_ID_BY_CONTACT);
  }
 
  public getAllByCompanyId(): string {
    return this.createUrl(this._constants.API_ENDPOINT_CONTACT_COMPANY_ID);
  }
 
  public getListByEndpoint(id) {
    return this.createUrl(this._constants.API_ENDPOINT_BY_USER_ID_LIST + id) + '/';
  }
 
  public postSegmentEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_SEGMENT);
  }
 
 
 
 
 
 
  public getAllInfoEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_ALL_INFO);
  }
 
  public getUserInfoEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_INFO);
  }
  
  public deleteSegmentEndpoint(id): string {
    return this.createUrl(this._constants.API_ENDPOINT_DELETE_SEGMENT + '/' + id) + '/';
  }
  public putUpdateProfileEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_UPDATE_PROFILE)
  }
 
  public putUpdateChangePasswordEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_CHANGE_PASSWORD_PROFILE)
  }
 
  public getContactBYdateEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_COUNT_All_CONTACT);
  }
 
 
  public postCreateCamEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_ADD_CAMPAIGNS);
  }
 
  public getAllCamTypes(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_CAM_TYPES);
  }
 
  public postCreateCampaignsEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_ADD_CAMPAIGNS_MAIl);
  }
 
  public putCreateCampaignsEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_UPDATE_CAMPAIGNS_MAIl);
  }
 
  public getbyEmailEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_CAMPAIGNS_MAIl);
  }
 
  public filterEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_SEARCH_CONTACT);
  }
 
  public getuserEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_USER);
  }
 
  public getAllEmailProviders(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_EMAIL_PROVIDERS);
  }
 
  public getAllBatchMasterDetails(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_BATCH_MASTER);
  }
  public getCountry(): string {
    return this.createUrl(this._constants.API_ENDPOINT_COUNTRY);
  }
 
 
  public getStateEndpoint(id: string): string {
    return this.createUrl(this._constants.API_ENDPOINT_ADD_STATE + id);
  }
  public getCityEndpoint(id: string): string {
    return this.createUrl(this._constants.API_ENDPOINT_ADD_CITY + id);
  }
 
  public compaignsEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_COMPAIGNS);
  }
 
 
  public deletetemplate(template_Id: any): string {
    return this.createUrl(this._constants.API_TEMPLATE_DELET + '/' + template_Id);
  }
 
  public forgetPassword(): string {
    return this.createUrl(this._constants.API_ENDPOINT_FORGET_PASSWORD);
  }
 
  public resetPassword(): string {
    return this.createUrl(this._constants.API_ENDPOINT_RESET_PASSWORD);
  }
 
  public getsedule(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_SHEDULE);
  }
 
  public compaignsgetEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_COMPAIGNS_byCamID);
  }
 
  public bulkUploadContacts(): string {
    return this.createUrl(this._constants.API_ENDPOINT_BULK_UPLOAD);
  }
 
  public getTimezoneData() {
    return this.createUrl(this._constants.API_ENDPOINT_TIMEZONE)
  }
 
  public camTestEmailCred() {
    return this.createUrl(this._constants.API_ENDPOINT_TEST_EMAIL)
  }
  public getEmployeeData() {
    return this.createUrl(this._constants.API_ENDPOINT_EMPLOYEE_DATA);
  }
 
  public getGoogleAuth() {
    return this.createUrl(this._constants.API_ENDPOINT_GOOGLE_AUTH);
  }
 
  public getIndustryTypes() {
    return this.createUrl(this._constants.API_ENDPOINT_GET_ALL_INDUSTRY);
  }
 
  public getEmployeeCount() {
    return this.createUrl(this._constants.API_ENDPOINT_GET_EMPLOYEE_COUNT);
  }
 
  public getTaxTypes() {
    return this.createUrl(this._constants.API_ENDPOINT_GET_ALL_TAX_TYPES);
  }
 
  public getRolesEndpoint() {
    return this.createUrl(this._constants.API_ENDPOINT_GET_USER_ROLES);
  }
 
  public createUserEndpoint() {
    return this.createUrl(this._constants.API_ENDPOINT_CREATE_USER);
  }
  public getApplicationsEndpoint() {
    return this.createUrl(this._constants.API_ENDPOINT_GET_APPLICATIONS);
  }
  public updateUserEndpoint() {
    return this.createUrl(this._constants.API_ENDPOINT_UPDATE_USER);
  }
 
  public getUserListEndpoint() {
    return this.createUrl(this._constants.API_ENDPOINT_GET_USER_LIST);
  }
  public getcountriesTimezoneApiEndpoint() {
    return this.createUrl(this._constants.API_ENDPOINT_GET_COUNTRIES_TIMEZONE);
  }
 
  public getUserByIdEndpoint() {
    return this.createUrl(this._constants.API_ENDPOINT_GET_USER_BY_ID);
  }
 
  public getDeleteUserEndpoint() {
    return this.createUrl(this._constants.API_ENDPOINT_DELETE_USER);
  }
 
  public createRoleEndpoint() {
    return this.createUrl(this._constants.API_ENDPOINT_CREATE_ROLE);
  }
 
  public updateRoleEndpoint() {
    return this.createUrl(this._constants.API_ENDPOINT_UPDATE_ROLE);
  }
 
  public getRoleByIdEndpoint() {
    return this.createUrl(this._constants.API_ENDPOINT_GET_ROLE_BY_ID);
  }
 
  public getDeleteRoleEndpoint() {
    return this.createUrl(this._constants.API_ENDPOINT_DELETE_ROLE);
  }
 
  public getAllTemplateEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_TEMPLATE);
  }
  public getAllLetterHeadsEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_LETTER_HEADS);
  }
  public getEmailTemplateTypeEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_TEMPLATE_TYPE);
  }
  public createTemplate(): string {
    return this.createUrl(this._constants.API_ENDPOINT_CREATE_TEMPLATE);
  }
 
  public getTemplateByIdEndpoint() {
    return this.createUrl(this._constants.API_ENDPOINT_GET_TEMPLATE_BY_ID);
  }
  public getTemplateById_TestCampaignApi() {
    return this.createUrl(this._constants.API_ENDPOINT_GET_TEMPLATE_BY_ID_TEST_CAMPAIGN);
  }
 
 
 
 
  public updateTemplate(): string {
    return this.createUrl(this._constants.API_ENDPOINT_UPDATE_TEMPLATE);
  }
 
  public deleteTemplate(): string {
    return this.createUrl(this._constants.API_ENDPOINT_DELETE_TEMPLATE);
  }
 
  public cloneTemplate(): string {
    return this.createUrl(this._constants.API_ENDPOINT_CLONE_TEMPLATE);
  }
 
  // Excel Upload
 
  public uploadContacts(): string {
    return this.createUrl(this._constants.API_ENDPOINT_EXCEL_UPLOAD);
  }
 
  public getAllContactsEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_ALL_CONTACTS);
 
  }
 
  public getRunningVariableEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_RUNNING_VARIABLE);
 
  }
 
  public getDocumentTypeEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_DOCUMENT_TYPE);
 
  }
 
  public getAddDocumentEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_ADD_DOCUMENT_TYPE);
 
  }
 
  public getCheckListEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_CHECK_LIST);
  }
 
  public getListEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_LIST);
  }
 
  public getDaysApiEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_DAYS);
  }
  public createCampaign(): string {
    return this.createUrl(this._constants.API_ENDPOINT_CREATE_CAMPAIGN);
  }
 
  public getCampaignListEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_CAMPAIGN_LIST);
  }
 
  // mohit
 
  public getRuningVariableEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_COLUMN_VARIABLE);
  }
 
  public getSegmentEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_SEGMENT);
  }
 
  // public getbyidSegmentEndpoint(id): string {
  //   return this.createUrl(this._constants.API_ENDPOINT_BY_ID_SEGMENT + id);
  // }
 
 
  public editSegmentEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_EDIT_SEGMENT);
  }
 
  public updateSegmentEndpoint(id): string {
    return this.createUrl(this._constants.API_ENDPOINT_SEGMENT_update + id);
  }
 
  public getbyUSERidSegmentEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_BY_USER_ID_SEGMENT);
  }
 
 
  public getdropdownEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GETDROPDOWN);
  }
 
  public getAllDocumentTypesEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_ALL_DOCUMENT_TYPE);
  }
 
  public getAllEmailScheduleEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_ALL_EMAIL_SCHEDULE);
  }
 
  public getSetListEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_SET_LIST);
  }
 
  public getDeleteListEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_DELETE_LIST);
  }
 
  public getDeleteCampaignEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_DELETE_CAMPAIGN);
  }
 
  public getCloneCampaignEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_CLONE_CAMPAIGN);
  }
 
  public getTepmlatePreviewEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_TEMPLATE_PREVIEW);
  }
  
  public getSetCampaignStatusEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_SET_CAMPAIGN_STATUS);
  }
  
  public getDeleteContactsEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_DELETE_CONTACTS);
  }
  
  public getLinkMailBoxEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_LINK_MAILBOX);
  }
  
 
  public getAddMultipleContactsEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_ADD_MULTIPLE_CONTACTS);
  }
  
  public getUpdateMultipleContactsEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_UPDATE_MULTIPLE_CONTACTS);
  }
 
  // DEMO
 
 
  public getBulkUpdateContactsEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_BULK_UPDATE_CONTACTS);
  }
  
  public getMailboxEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_MAILBOX_CONTACTS);
  }
 
  public getMailPreviewEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_MAIL_PREVIEW);
  }
  
  public getOverviewEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_OVERVIEW);
  }
  
  public getEditProfileEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_EDIT_PROFILE);
  }
 
  public getChangeUserPasswordEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_CHANGE_USER_PASSWORD);
  }
 
  // User Permission
 
  public getUserPermissionEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_USER_PERMISSION_BY_ROLE_ID);
  }
  
  public getPageListEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_PAGE_LIST);
  }
  
  public getUserPermissionByUserIdEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_USER_PERMISSION_BY_USER_ID);
  }
 
  public getUpdateUserPermissionEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_CREATE_USER_PERMISSION);
  }
 
  public getDashboardEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_DASHBOARD_INFO);
  }
 
  public getUnsubscribeEmailEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_UNSUBSCRIBE_EMAIL);
  }
  
  public getEmailAnalyticsEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_EMAIL_ANALYTICS);
  }
  
  public getBounceEmailStatusEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_BOUNCE_EMAIL_STATUS);
  }
  
  public getSentEmailStatusEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_SENT_EMAIL_STATUS);
  }
 
  public getUnsubscribeEmailListEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_UNSUBSCRIBE_EMAIL_LIST);
  }
 
  public getCountryCodeListEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_COUNTRY_CODE_LIST);
  }
 
  public getStopEmailEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_STOP_MAIL);
  }
 
  public getRescheduleEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_RESCHEDULE);
  }
  
  public getDeleteDocumentEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_DELETE_DOCUMENT);
  }
  
  public getDeleteScheduledEmailEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_DELETE_SCHEDULED_EMAIL);
  }
 
  public getEditDocumentEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_EDIT_DOCUMENT);
  }
 
  public getCloneDocumentEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_CLONE_DOCUMENT);
  }
 
  public getActiveCampaignEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_ACTIVE_CAMPAIGN);
  }
 
  public getUnlinkMailboxEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_UNLINK_MAILBOX);
  }
  
  public createLetterHeadEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_CRETAE_LETTER_HEAD);
  }
 
  public getServers() :string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_SERVERS);
  }
  
  public getAlarmsAndTriggers() :string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_ALARM_AND_TRIGGER);
  }
 
  public addAlarmAndTrigger() : string {
    return this.createUrl(this._constants.API_ENDPOINT_ADD_ALARM_AND_TRIGGER);
  }
 
  //---------------TASK-SCHEDULAR--------------------//
  public getTaskScheduled(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_TASK_SCHEDULAR);
  }
 
   
  //----------ADD-TASK_SCHEDULAR---
 
  public addTaskScheduler() :string {
    return this.createUrl(this._constants.API_ENDPOINT_ADD_TASK_SCHEDULAR);
  }
  //--------server Dropdown-----//
  public getTaskServers() :string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_SERVERS);
  }
  //--Application Type----//
  public getApplicationTypes() :string{
    return this.createUrl(this._constants.API_ENDPOINT_GET_APPLICATION_TYPES);
  }
  //--UpdateTaskScheduled
  public updateTaskScheduled() :string{
    return this.createUrl(this._constants.API_ENDPOINT_UPDATE_TASK_SCHEDULED);
  }
 
  public deleteTaskScheduled(Id) :string{
    return this.createUrlWithPathVariables(this._constants.API_ENDPOINT_DELETE_TASK_SCHEDULED +'/'+ Id)
   }
//----------Get ERROR LOGS---------------------------------//
public getErrorLogs() :string{
  return this.createUrl(this._constants.API_ENDPOINT_GET_ERROR_LOGS);
}
 
public getTimespan() :string{
  return this.createUrl(this._constants.API_ENDPOINT_GET_TIME_SPAN);
}
 
public addAutoClearLog() :string{
  return this.createUrl(this._constants.API_ENDPOINT_ADD_AUTO_CLEAR_LOG)
}
 
 
 
  
  //***************  Map Server  *********************/
 
 
  public getAddMapServerEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_ADD_MAP_SERVER);
  }
 
  public getMapServerEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_MAP_SERVER);
  }
 
  public deleteMapServerEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_DELETE_MAP_SERVER );
  }
 
 
  public updateMapServerEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_UPDATE_MAP_SERVER);
  }
  //*************** Application Check Up *************************
  
  public getApplicationCheckUpEndpoint(): string{
    return this.createUrl(this._constants.API_ENDPOINT_GET_APPLICATION_CHECK_UP);
  }  
  
  public getServerNameEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_SERVER_NAME);
  }
 
  public getStatusNameEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_GET_STATUS_NAME);
  }
 
  public getApplicationTypeEndpoint(): string{
    return this.createUrl(this._constants.API_ENDPOINT_GET_APPLICATION_TYPES);
  }
//-------------------------------user management-----------------------
  public createUserManagementEndpoint(){
    return this.createUrl(this._constants.API_ENDPOINT_CREATE_USER1);
  }

  public userDetailsListUserManagementEndpoint(): string {
    return this.createUrl(this._constants.API_ENDPOINT_USER_DETAILS_LIST);
  }
  //--------------------------------------------------------------------
  public getFileSummaryEndpoint(){
    return this.createUrl(this._constants.API_ENDPOINT_GET_FILE_SUMMARY);
  }

  public getHealthCheckUpEndpoint(){
    return this.createUrl(this._constants.API_ENDPOINT_GET_HEALTH_CHECKUP);
  }
  //-------------------------------------------------------------------------
  public getOprations(){
    return this.createUrl(this._constants.API_ENDPOINT_GET_OPERATION);
  }

  public addApplication(){
    return this.createUrl(this._constants.API_ENDPOINT_ADD_APPLICATION);
  }

  public getApplications(){
    return this.createUrl(this._constants.API_ENDPOINT_GET_APPLICATIONS);
  }

  public getWiseLogs(){
    return this.createUrl(this._constants.API_ENDPOINT_GET_WISE_LOGS);
  }

  public addWiseLogs(){
    return this.createUrl(this._constants.API_ENDPOINT_ADD_WISE_LOGS);
  }
  public getDashboardStatisticsEndpoint(){
    return this.createUrl(this._constants.API_ENDPOINT_GET_DASHBOARD_STATISTICS);
  }
  public getCountryCode(){
    return this.createUrl(this._constants.API_ENDPOINT_GET_COUNTRY_CODE);
  }

  public getScheduledTask(){
    return this.createUrl(this._constants.API_ENDPOINT_GET_SCHEDULED_TASK);
  }

  public getApplicationPool(){
    return this.createUrl(this._constants.API_ENDPOINT_GET_APPLICATION_POOL);
  }

  public getIssServerStatus(){
    return this.createUrl(this._constants.API_ENDPOINT_GET_IIS_SERVER_STATUS);
  }

  public getDatabaseHealthStatusEndpoint(){
    return this.createUrl(this._constants.API_ENDPOINT_GET_DATABASE_HEALTH_STATUS);
  }

  public getTaskDetailsGraphEndpoint(){
    return this.createUrl(this._constants.API_ENDPOINT_GET_TASK_DETAIL_GRAPH);
  } 
   public getHealthCheackupApplicationPerformanceGraphEndpoint(){
    return this.createUrl(this._constants.API_ENDPOINT_GET_HEALTH_CHECKUP_APPLICATION_PERFORMANCE_GRAPH);
  }

  public getAppHealthGraphEndpoint(){
    return this.createUrl(this._constants.API_ENDPOINT_GET_APP_HEALTH_GRAPH)
  }
  public getServerIP(){
    return this.createUrl(this._constants.API_ENDPOINT_GET_SERVER_IP)
  }
  public getpoolgraph(){
    return this.createUrl(this._constants.API_ENDPOINT_GET_POOL_GRAPH)
  }
}
 