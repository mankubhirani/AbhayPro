
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
 
@Injectable()
export class Constants {
 
  public readonly API_ENDPOINT: string = environment.apiUrl;
  public readonly API_MOCK_ENDPOINT: string = environment.apiMockUrl;
  public readonly API_IS_DEVELOPMENT_ENV: boolean = environment.production;
 
  // profile
  public readonly API_ENDPOINT_SIGN_UP: string = 'registerUser'
 
  public readonly API_ENDPOINT_LOGIN: string = 'login'
 
  // dashboard
  public readonly API_ENDPOINT_ADD_COMPANY: string = 'register-company'
 
  public readonly API_ENDPOINT_COMPANY_DETAILS: string = 'getCompanyById'
 
  public readonly API_ENDPOINT_UPDATE_COMPANY: string = 'edit-company'
 
  public readonly API_ENDPOINT_All_COMPANY: string = 'company/getAll/'
 
  public readonly API_ENDPOINT_GET_COMPANYBY_ID: string = 'getCompanyById'
 
  public readonly API_ENDPOINT_BY_USER_ID_COMPANY: string = 'companyby/'
 
  public readonly API_ENDPOINT_SEGMENT_CATEGORIES: string = 'segment/categories'
 
  public readonly API_ENDPOINT_SEGMENT_CRITERIAS: string = 'segment/criterias'
 
  public readonly API_ENDPOINT_ADD_SUBSCRIBER: string = 'contact/'
 
  public readonly API_ENDPOINT_UNSUBSCRIBER: string = 'ContactUnSubscribe/ByEmail/'
 
  public readonly API_ENDPOINT_All_CONTACT: string = 'GetAllContactDetails/'
 
  public readonly API_ENDPOINT_COMPANY_ID_BY_CONTACT: string = 'GetContactDetails/companyId/'
 
 
  public readonly API_ENDPOINT_CONTACT_COMPANY_ID: string = 'GetContactEmails/contact_Email=?'
 
  public readonly API_ENDPOINT_BY_USER_ID_LIST: string = 'listby/'
 
  public readonly API_ENDPOINT_UPDATE_PROFILE: string = 'update_user'
 
  public readonly API_ENDPOINT_CHANGE_PASSWORD_PROFILE: string = 'update_password'
 
  // public readonly API_ENDPOINT_SEGMENT: string = 'Segment/'
 
  public readonly API_ENDPOINT_GET_SEGMENT: string = 'getSegment/'
 
  public readonly API_ENDPOINT_EDIT_SEGMENT: string = 'UpdateSegment/'
 
  public readonly API_ENDPOINT_ALL_INFO: string = 'allCompaniesByUserId/UserId:UserId/'
  public readonly API_ENDPOINT_GET_INFO: string = 'getProfile_details'
 
  // public readonly API_ENDPOINT_DELETE_SEGMENT: string = 'DeleteSegment'
 
 
  public readonly API_ENDPOINT_COUNT_All_CONTACT: string = 'GetContactDetails/created_Date=?/'
 
  // public readonly API_ENDPOINT_BY_ID_SEGMENT: string = 'getSegment/segmentId=?/'
 
  // public readonly API_ENDPOINT_BY_USER_ID_SEGMENT: string = 'getSegment/UserId=?/'
 
  public readonly API_ENDPOINT_ADD_CAMPAIGNS: string = 'Campaign/'
 
  public readonly API_ENDPOINT_GET_CAM_TYPES: string = 'Campaign/types/'
 
  public readonly API_ENDPOINT_ADD_CAMPAIGNS_MAIl: string = 'NewCampaign/'
  public readonly API_ENDPOINT_UPDATE_CAMPAIGNS_MAIl: string = 'UpdateCampaign/'
 
 
  public readonly API_ENDPOINT_GET_CAMPAIGNS_MAIl: string = 'GetContactEmails/companyId=?/'
 
  public readonly API_ENDPOINT_SEARCH_CONTACT: string = 'search'
 
  public readonly API_ENDPOINT_GET_USER: string = 'GetEmailDetails/UserId=?'
 
  public readonly API_ENDPOINT_GET_EMAIL_PROVIDERS: string = 'emailProviders/all/'
 
  public readonly API_ENDPOINT_GET_BATCH_MASTER: string = 'batch/master/all/'
 
  public readonly API_ENDPOINT_COUNTRY: string = 'getAllCountry'
 
  public readonly API_ENDPOINT_ADD_STATE: string = 'GetStateDetails?country_id='
 
  public readonly API_ENDPOINT_ADD_CITY: string = 'GetCityDetails?state_id='
 
  public readonly API_ENDPOINT_GET_COMPAIGNS: string = 'GetCampaign/UserId=?'
 
  public readonly API_ENDPOINT_GET_COMPAIGNS_byCamID: string = 'GetCampaign/campaign_Id=?'
 
  public readonly API_TEMPLATE_DELET: string = 'DeleteTemplate'
 
 
  // forget
 
  public readonly API_ENDPOINT_FORGET_PASSWORD: string = 'forgot-password'
 
 
  public readonly API_ENDPOINT_RESET_PASSWORD: string = 'changePassword'
 
  // GETSEDULE
 
 
  public readonly API_ENDPOINT_GET_SHEDULE: string = 'getScheduler/Id=?'
 
  public readonly API_ENDPOINT_BULK_UPLOAD: string = 'contact/upload/bulk'
  public readonly API_ENDPOINT_DESIGNATIONS: string = 'designations';
  public readonly API_ENDPOINT_TIMEZONE: string = 'timezones';
  public readonly API_ENDPOINT_TEST_EMAIL: string = 'campaign/testMail';
  public readonly API_ENDPOINT_EMPLOYEE_DATA: string = 'companyDetails/employees';
 
  // new Endpoints
 
  public readonly API_ENDPOINT_GOOGLE_AUTH: string = 'auth/google';
 
  public readonly API_ENDPOINT_GET_ALL_INDUSTRY: string = 'getIndutryTypes'
  public readonly API_ENDPOINT_GET_EMPLOYEE_COUNT: string = 'getEmployeeCount'
  public readonly API_ENDPOINT_GET_ALL_TAX_TYPES: string = 'getTaxTypes'
 
  public readonly API_ENDPOINT_GET_USER_ROLES: string = 'get-roles'
  public readonly API_ENDPOINT_CREATE_USER: string = 'create-user'
  public readonly API_ENDPOINT_GET_USER_LIST: string = 'getUserList'
  public readonly API_ENDPOINT_GET_USER_BY_ID: string = 'get-user'
  public readonly API_ENDPOINT_UPDATE_USER: string = 'update-user'
  public readonly API_ENDPOINT_DELETE_USER: string = 'delete-user'
  public readonly API_ENDPOINT_CHANGE_PASSWORD: string = 'change-password'
 
  public readonly API_ENDPOINT_CREATE_ROLE: string = 'create-role'
  public readonly API_ENDPOINT_UPDATE_ROLE: string = 'update-role'
  public readonly API_ENDPOINT_DELETE_ROLE: string = 'delete-role'
  public readonly API_ENDPOINT_GET_TEMPLATE_TYPE: string = 'getTemplateType'
 
  public readonly API_ENDPOINT_GET_TEMPLATE: string = 'getAllTemplate'
  public readonly API_ENDPOINT_GET_TEMPLATE_BY_ID: string = 'getTemplateById'
  public readonly API_ENDPOINT_GET_TEMPLATE_BY_ID_TEST_CAMPAIGN: string = 'getTemplateByCidTempId'
 
 
  public readonly API_ENDPOINT_GET_LETTER_HEADS: string = 'letterHead/getAll'
 
  public readonly API_ENDPOINT_CRETAE_LETTER_HEAD: string = 'letterHead/create'
 
  public readonly API_ENDPOINT_CREATE_TEMPLATE: string = 'createTemplate'
  public readonly API_ENDPOINT_UPDATE_TEMPLATE: string = 'editExistingTemplate'
  public readonly API_ENDPOINT_DELETE_TEMPLATE: string = 'delete-template'
  public readonly API_ENDPOINT_GET_ROLE_BY_ID: string = 'getRoleById'
 
  public readonly API_ENDPOINT_CLONE_TEMPLATE: string = 'clone-template'
 
  // Excel Upload
 
  // public readonly API_ENDPOINT_EXCEL_UPLOAD : string = 'insertContactBulkData'
  public readonly API_ENDPOINT_EXCEL_UPLOAD: string = 'insertContactBulkDataInList'
  public readonly API_ENDPOINT_GET_ALL_CONTACTS: string = 'getAllContacts'
 
  public readonly API_ENDPOINT_GET_DOCUMENT_TYPE: string = 'getDocument'
  public readonly API_ENDPOINT_ADD_DOCUMENT_TYPE: string = 'addDocument'
  public readonly API_ENDPOINT_GET_RUNNING_VARIABLE: string = 'getAllRunningVariable'
  public readonly API_ENDPOINT_INSERT_DOCUMENT: string = 'insertDocument'
 
  // List
  public readonly API_ENDPOINT_CREATE_LIST: string = 'create_list'
  public readonly API_ENDPOINT_GET_ALL_LIST: string = 'getAllList'
  public readonly API_ENDPOINT_CHECK_LIST: string = 'check_list'
  public readonly API_ENDPOINT_GET_LIST: string = 'getAllList'
  public readonly API_ENDPOINT_GET_COUNTRIES_TIMEZONE: string = 'campaign/getAllCountriesTimezone'
  public readonly API_ENDPOINT_GET_DAYS: string = 'campaign/getAllDays'
  public readonly API_ENDPOINT_CREATE_CAMPAIGN: string = 'campaign/create'
 
  public readonly API_ENDPOINT_GET_CAMPAIGN_LIST: string = 'campaign/getAll'
 
  // mohit
 
 
 
  public readonly API_ENDPOINT_SEGMENT: string = 'api/v1/segments/'
 
  public readonly API_ENDPOINT_SEGMENT_update: string = 'api/v1/segments/'
 
  public readonly API_ENDPOINT_GETDROPDOWN: string = 'api/v1/segments/options'
 
  public readonly API_ENDPOINT_DELETE_SEGMENT: string = 'api/v1/segments'
 
  public readonly API_ENDPOINT_BY_ID_SEGMENT: string = 'api/v1/segments/'
 
  public readonly API_ENDPOINT_BY_USER_ID_SEGMENT: string = 'api/v1/segments/company'
 
  public readonly API_ENDPOINT_GET_COLUMN_VARIABLE: string = 'getAllColumnVariable'
 
  public readonly API_ENDPOINT_GET_ALL_DOCUMENT_TYPE: string = 'getAllDocType'
 
  public readonly API_ENDPOINT_GET_ALL_EMAIL_SCHEDULE: string = 'getAllEmailSchedule'
 
  public readonly API_ENDPOINT_SET_LIST: string = 'setListStatus'
 
  public readonly API_ENDPOINT_DELETE_LIST: string = 'deleteList'
 
  public readonly API_ENDPOINT_DELETE_CAMPAIGN: string = 'campaign/deleteCampaign'
 
  public readonly API_ENDPOINT_CLONE_CAMPAIGN: string ='campaign/clone-campaign'
 
  public readonly API_ENDPOINT_GET_TEMPLATE_PREVIEW: string ='getPreview'
 
  public readonly API_ENDPOINT_GET_CONTACT_LIST_BY_ID: string ='getContactsByListId'
 
  public readonly API_ENDPOINT_SET_CAMPAIGN_STATUS: string ='campaign/setCampaignStatus'
 
  public readonly API_ENDPOINT_DELETE_CONTACTS: string ='deleteContact'
 
  public readonly API_ENDPOINT_LINK_MAILBOX: string = 'link-mailbox'
 
  public readonly API_ENDPOINT_ADD_MULTIPLE_CONTACTS: string = 'saveCheckedContactToNewList'
 
  public readonly API_ENDPOINT_UPDATE_MULTIPLE_CONTACTS: string = 'updateMultipleCheckedContactInList'
 
  public readonly API_ENDPOINT_BULK_UPDATE_CONTACTS: string ='updateContactBulkDataInList'  
 
  public readonly API_ENDPOINT_GET_MAILBOX_CONTACTS: string ='get-mailbox'
 
  public readonly API_ENDPOINT_GET_MAIL_PREVIEW: string ='getMailPreview'
 
  public readonly API_ENDPOINT_GET_OVERVIEW: string ='get-overview'
 
  public readonly API_ENDPOINT_EDIT_PROFILE: string ='edit-profile'
 
  public readonly API_ENDPOINT_CHANGE_USER_PASSWORD: string ='change-password'
 
  // User Permission
 
  public readonly API_ENDPOINT_GET_USER_PERMISSION_BY_ROLE_ID: string = 'userpermission/permissionById'
 
  public readonly API_ENDPOINT_GET_PAGE_LIST: string ='userpermission/getforms'
 
  public readonly API_ENDPOINT_GET_USER_PERMISSION_BY_USER_ID: string = 'userpermission/findById'
 
  public readonly API_ENDPOINT_CREATE_USER_PERMISSION: string = 'userpermission/create'
 
  public readonly API_ENDPOINT_GET_DASHBOARD_INFO: string = 'getDashboardInfo'
 
  public readonly API_ENDPOINT_GET_UNSUBSCRIBE_EMAIL: string ='unsubscribe-email'
 
  // public readonly API_ENDPOINT_GET_EMAIL_ANALYTICS: string ='get-email-analytics'
 
  public readonly API_ENDPOINT_GET_UNSUBSCRIBE_EMAIL_LIST: string ='get-unsubscribe-email'
 
  public readonly API_ENDPOINT_GET_BOUNCE_EMAIL_STATUS: string ='get-bouncee-email-status'
 
  public readonly API_ENDPOINT_GET_SENT_EMAIL_STATUS: string ='get-sent-email-status'
 
  public readonly API_ENDPOINT_GET_EMAIL_ANALYTICS: string ='get-email-analytics'
 
  public readonly API_ENDPOINT_GET_COUNTRY_CODE_LIST: string ='getcountrycode'
 
  public readonly API_ENDPOINT_GET_RESCHEDULE: string ='re-schedule'
 
  public readonly API_ENDPOINT_GET_STOP_MAIL: string ='stop-email'
 
  public readonly API_ENDPOINT_GET_DELETE_SCHEDULED_EMAIL: string ='delete-email'
 
  public readonly API_ENDPOINT_GET_DELETE_DOCUMENT: string ='delete-document'
 
  public readonly API_ENDPOINT_GET_EDIT_DOCUMENT: string ='edit-document'
 
  public readonly API_ENDPOINT_GET_CLONE_DOCUMENT: string ='clone-document'
 
  public readonly API_ENDPOINT_GET_ACTIVE_CAMPAIGN: string ='campaign/getActiveCampaigns'
 
  public readonly API_ENDPOINT_GET_UNLINK_MAILBOX: string ='unlink-mailbox'
 
  //---server --
  public readonly API_ENDPOINT_GET_SERVERS: string ='getServers'
  
  //---/getAlarmAndTrigger
  public readonly API_ENDPOINT_GET_ALARM_AND_TRIGGER: string ='getAlarmsAndTriggers'
 
  public readonly API_ENDPOINT_ADD_ALARM_AND_TRIGGER: string ='addAlarmAndTrigger'
 
  // ************* Add Map Server ****************************
 
  public readonly API_ENDPOINT_GET_ADD_MAP_SERVER: string ='addMapServer'
 
  //  **************  Get Map Server ************************
 
  public readonly API_ENDPOINT_GET_MAP_SERVER: string = "getMapServer"
  
  //-------------------------Setting Task Schedular-----------
 
  public readonly API_ENDPOINT_GET_TASK_SCHEDULAR: string ='getTaskScheduled'
  
  public readonly API_ENDPOINT_ADD_TASK_SCHEDULAR: string ='addTaskScheduler'
 
  
 
  public readonly API_ENDPOINT_GET_APPLICATIONS: string ='getApplications'
 
  public readonly API_ENDPOINT_DELETE_MAP_SERVER: string ='deleteMapServer?msd_id=${id}'
 
  public readonly API_ENDPOINT_UPDATE_MAP_SERVER: string ='updateMapServer'
  
  public readonly API_ENDPOINT_UPDATE_TASK_SCHEDULED: string ='updateTaskScheduled'
 
  public readonly API_ENDPOINT_DELETE_TASK_SCHEDULED: string ='deleteTaskScheduled'
 
  //--------------------------Auto Clear- logs-------------------------
 
  public readonly API_ENDPOINT_GET_ERROR_LOGS: string ='getErrorLogs'
 
  public readonly API_ENDPOINT_GET_TIME_SPAN: string ='getTimespan'
 
  public readonly API_ENDPOINT_ADD_AUTO_CLEAR_LOG: string ='addAutoClearLog'
  // ************************ Application Check Up ****************************
  public readonly API_ENDPOINT_GET_FILE_SUMMARY: string = 'getFileSummary'

  public readonly API_ENDPOINT_GET_HEALTH_CHECKUP: string = 'getHealthCheckup'

  public readonly API_ENDPOINT_GET_APPLICATION_CHECK_UP: string = 'getErrorLogs'
 
  public readonly API_ENDPOINT_GET_SERVER_NAME: string = 'getServerNames'
 
  public readonly API_ENDPOINT_GET_STATUS_NAME: string = 'getServerStatus'
 
  public readonly API_ENDPOINT_GET_APPLICATION_TYPES: string = 'getApplicationTypes'

  //-----------------------------------create user------------------------
  
  public readonly API_ENDPOINT_CREATE_USER1: string='createUser'
  
  //-------------------------------User detail list---------------------
  
  public readonly API_ENDPOINT_USER_DETAILS_LIST: string ='getUserList'
  //-----------------------------------------------------------------
  public readonly API_ENDPOINT_GET_OPERATION: string ='getOprations'

  public readonly API_ENDPOINT_ADD_APPLICATION: string ='addApplication'

  public readonly API_ENDPOINT_GET_APPLICATION: string ='getApplications'

  public readonly API_ENDPOINT_GET_AUTO_CLEAR_LOG: string ='getAutoClearLog'
  public readonly API_ENDPOINT_GET_WISE_LOGS: string ='getWiseLogs'
  public readonly API_ENDPOINT_ADD_WISE_LOGS: string ='addWiseLogs'
  
  public readonly API_ENDPOINT_GET_DASHBOARD_STATISTICS: string = 'getGeneralStatistics'

  public readonly API_ENDPOINT_GET_COUNTRY_CODE: string ='getCountryCode'

  public readonly API_ENDPOINT_GET_SCHEDULED_TASK: string ='getScheduledTask'

  public readonly API_ENDPOINT_GET_APPLICATION_POOL: string ='getApplicationPool'

  public readonly API_ENDPOINT_GET_IIS_SERVER_STATUS: string ='getIIS_Status'

  public readonly API_ENDPOINT_GET_DATABASE_HEALTH_STATUS: string ='getDatabaseHealthStatus'

  public readonly API_ENDPOINT_GET_TASK_DETAIL_GRAPH: string ='getTaskDetailsGraph'
  

  public readonly API_ENDPOINT_GET_HEALTH_CHECKUP_APPLICATION_PERFORMANCE_GRAPH: string ='getAppHealthGraph'

  public readonly API_ENDPOINT_GET_APP_HEALTH_GRAPH:string='getAppHealthGraph'

  public readonly API_ENDPOINT_GET_SERVER_IP:string='getServerIP'

  public readonly API_ENDPOINT_GET_POOL_GRAPH:string='getpoolgraph'

}
 