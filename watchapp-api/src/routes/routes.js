const router = require("express").Router();
const { body } = require("express-validator");
const { register } = require("../loginControllers/registerController.js");
const { login } = require("../loginControllers/loginController.js");
const {
  CompanyRegistration,
  GetIndustryTypes,
  GetEmployeeCount,
  GetTaxTypes,
  GetCompanyDetailsById,
  EditCompanyRegistration,
} = require("../loginControllers/CompanyRegistration.js");

const { GetStateDetails } = require("../Controller/GetEmailDetails.js");
const { getAllCountry } = require("../Controller/GetEmailDetails.js");
const { GetCityDetails } = require("../Controller/GetEmailDetails.js");

const {
  ChangePassword,
  SendOtp,
} = require("../loginControllers/changePassword/changePassword");
const multer = require("multer");
const path = require("path");

const {
  GetRoles,
  GetRoleById,
  CreateRoles,
  UpdateRoles,
  DeleteRoles,
  CreateUser,
  GetUserByCompany,
  UpdateUser,
  UpdatePassword,
  DeleteUser,
  UpdateSelfPassword,
  GetUserInfoByUserId,
  GetProfileInfoByUserId
} = require("../Controller/User/User.controller.js");
const { MapServer, GetMapServer, UpdateMapServer, DeleteMapServer } = require("../Controller/MapServer.js");
const {
  AddApplications,
  GetApplicationTypes,
  GetOprationTypes,
  GetServers,
  GetApplications,
} = require("../Controller/ApplicationMaster.js");
const {
  AddWiseLogs,
  GetWiseLogs
} = require("../Controller/ApplicationWiseLogs.js");
const {
  GetCountryCode
} = require("../Controller/countryCode.js");
//----Application Pool Status 
const {
GetApplicationPool,GETPOOLGRAPH
} = require("../Controller/ApplicationPoolStatus.js");
//---GetScheduledTask
const {
  GetScheduledTask,
  GetServerIPTask
  } = require("../Controller/GetScheduledTask.js");

const {
  AddTaskScheduler,
  GetTaskScheduled,
  UpdateTaskScheduled,
  DeleteTaskScheduled,
} = require("../Controller/TaskScheduler.js");
const {
  GetTimespan,
  AddAutoClearLog,
  GetAutoClearLog
} = require("../Controller/AutoLogDetails.js");
const {
  GetServerTypesName,
  GetServerStatusName,
  AddAlarmsAndTrigger,
  GetAlarmAndTriggers,
} = require("../Controller/AlarmsAndTrigger.js");

//----
const { 
  GETTASKDETAILGRAPH
} = require("../Controller/GetTaskDetailsForGraphByName.js");
//---
const { 
  GETAPPHEALTHGRAPH
} = require("../Controller/ApplicationGraph.js");

//----general-statitics-------
const { 
  GetGeneralStatistics
} = require("../Controller/general_statistics.js");
//----------iis_status---------
const { 
  GetIISSTATUS
} = require("../Controller/GET_IIS_STATUS.js");
//-----Get App health memory graph
const { 
 GetAppHealthMemoryGraph
} = require("../Controller/GetAppHealthMemory.js");
//----GetDatabaseHealthStatus
const { 
  GetDataBaseHealthStatus
} = require("../Controller/GetDatabaseHealthStatus.js");

const { GetErrorLogs ,
        GetFileSummary,
        GetHealthCheckup
} = require("../Controller/ErrorLogs.js");


const fs = require('fs');


router.post("/registerUser", register);
router.post("/addMapServer", MapServer);
router.post("/getMapServer", GetMapServer);
router.put("/updateMapServer", UpdateMapServer);
router.delete("/deleteMapServer", DeleteMapServer);


//------------- Application Log----------------------------------
const DIR = path.join(__dirname, "../../uploads");
exports.DIR = DIR;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
exports.storage = storage;
const upload = multer({ storage: storage });


router.post(
  "/addApplication",
  [
    body("applicationName", "Application name required.")
      .notEmpty()
      .escape()
      .trim(),

    body("validFrom", "Valid from date required.")
      .notEmpty()
      .escape()
      .trim()
      .isISO8601()
      .withMessage("Invalid date format"),

    body("validTo", "Valid to date required.")
      .notEmpty()
      .escape()
      .trim()
      .isISO8601()
      .withMessage("Invalid date format"),

    body("serverId", "Server ID required.")
      .notEmpty()
      .escape()
      .trim()
      .isInt()
      .withMessage("Server ID must be an integer"),

    body("operation", "Operation required.").notEmpty().escape().trim(),

    body("aaddApplicationpplicationType", "Application type required.")
      .notEmpty()
      .escape()
      .trim(),

    body("applicationUser", "Application user required.")
      .notEmpty()
      .escape()
      .trim(),

    body("applicationDescription", "Application description required.")
      .notEmpty()
      .escape()
      .trim(),
  ],
  upload.single("logo"),
  AddApplications
);
const Dir = path.join(__dirname, "../../uploads");
exports.DIR = DIR;
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
exports.storage = storage;
const uploads = multer({ diskStorage: diskStorage });


router.post(
  "/addWiseLogs",
  [
    body("applicationName", "Application name required.")
      .notEmpty()
      .escape()
      .trim(),

    body("validFrom", "Valid from date required.")
      .notEmpty()
      .escape()
      .trim()
      .isISO8601()
      .withMessage("Invalid date format"),

    body("validTo", "Valid to date required.")
      .notEmpty()
      .escape()
      .trim()
      .isISO8601()
      .withMessage("Invalid date format"),

    body("serverId", "Server ID required.")
      .notEmpty()
      .escape()
      .trim()
      .isInt()
      .withMessage("Server ID must be an integer"),

   

    body("aaddApplicationpplicationType", "Application type required.")
      .notEmpty()
      .escape()
      .trim(),

    body("applicationUser", "Application user required.")
      .notEmpty()
      .escape()
      .trim(),

    body("applicationDescription", "Application description required.")
      .notEmpty()
      .escape()
      .trim(),
  ],
  upload.single("logo"),
  AddWiseLogs
);
router.post("/getWiseLogs", GetWiseLogs);
//--------- Map Server Routes------
router.post("/getApplications", GetApplications);
router.get("/getApplicationTypes", GetApplicationTypes);
router.get("/getOprations", GetOprationTypes);
router.post("/getServers", GetServers);

//-----Application Pool Status 

router.post("/getApplicationPool",GetApplicationPool)
router.post("/getpoolgraph",GETPOOLGRAPH)

//---iis-status---
 router.post("/getIIS_Status", GetIISSTATUS)
//----Database Health status
router.get("/getDatabaseHealthStatus",GetDataBaseHealthStatus)


//**************
//****************
//--------  GET TASK DETAIL & Health status GRAPH
router.post("/getTaskDetailsGraph", GETTASKDETAILGRAPH
)

router.post("/getAppHealthGraph", GETAPPHEALTHGRAPH
)

router.post("/getHealthMemoryGraph", GetAppHealthMemoryGraph
)


// --------Task Scheduler Routes-------

router.post("/addTaskScheduler", AddTaskScheduler);
router.post("/getTaskScheduled", GetTaskScheduled);
router.put("/updateTaskScheduled", UpdateTaskScheduled);
router.delete("/deleteTaskScheduled", DeleteTaskScheduled);
router.post("/getScheduledTask",GetScheduledTask)
router.post("/getServerIP",GetServerIPTask)

//-------- Get error Logs ---------------
router.post("/getGeneralStatistics",GetGeneralStatistics);

router.post("/getErrorLogs", GetErrorLogs)

router.post("/getHealthCheckup",GetHealthCheckup)

router.post("/getFileSummary",GetFileSummary)

router.post("/addAutoClearLog", AddAutoClearLog);

router.post("/getAutoClearLog", GetAutoClearLog);

router.get("/getTimespan", GetTimespan);

router.get("/getServerNames", GetServerTypesName);

router.get("/getServerStatus", GetServerStatusName);

router.post("/addAlarmAndTrigger", AddAlarmsAndTrigger);

router.post("/getAlarmsAndTriggers", GetAlarmAndTriggers);

router.post(
  "/login",
  [
    body("Email", "Invalid Email address").notEmpty().escape().trim().isEmail(),
    body("Pas", "The Password must be of minimum 4 characters length")
      .notEmpty()
      .trim()
      .isLength({ min: 4 }),
  ],
  login
);


//COMPANY REGISTRATION
router.get("/getIndutryTypes", GetIndustryTypes);
router.get("/getEmployeeCount", GetEmployeeCount);
router.get("/getTaxTypes", GetTaxTypes);
router.post("/getCompanyById", GetCompanyDetailsById);


//------ Company Logo-------------------------

const imgStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "../../../uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const imguploads = multer({ storage: imgStorage });

router.post(
  "/register-company",
  [
    body("companyName", "Company name required.").notEmpty().escape().trim(),

    body("companyEmail", "Email required.")
      .notEmpty()
      .escape()
      .trim()
      .isEmail(),

    body("contact", "contact required.").notEmpty().escape().trim(),

    body("portal", "portal required.").notEmpty().escape().trim(),

    body("industryId", "Please select industry.").notEmpty().escape().trim(),

    body("taxTypId", "Tax type required.").notEmpty().escape().trim(),

    body("employeeCountId", "Employee count required.")
      .notEmpty()
      .escape()
      .trim(),
    body("taxInfo", "Tax info required.").notEmpty().escape().trim(),
    body("taxId", "Tax info required.").notEmpty().escape().trim(),

    body("countryId", "Country required.").notEmpty().escape().trim(),

    body("stateId", "State required.").notEmpty().escape().trim(),

    body("cityId", "Country required.").notEmpty().escape().trim(),

    body("postalCode", "Zip code required.").notEmpty().escape().trim(),

    body("address", "Address required.").notEmpty().escape().trim(),
  ],
  upload.single("logo"),
  CompanyRegistration
);

router.post("/edit-company", upload.single("logo"), EditCompanyRegistration);

//USER MANAGEMENT
router.get("/get-roles", GetRoles);

router.post(
  "/getRoleById",
  [body("roleId", "role id required").notEmpty().escape()],
  GetRoleById
);

router.post(
  "/create-role",
  [
    body("roleName", "Role name required.").notEmpty().escape().trim(),

    body("description", "Description required.").notEmpty().escape().trim(),
  ],
  CreateRoles
);

router.post(
  "/update-role",
  [
    body("roleId", "Role id required.").notEmpty().escape().trim(),

    body("roleName", "Role name required.").notEmpty().escape().trim(),

    body("description", "Description required.").notEmpty().escape().trim(),
  ],
  UpdateRoles
);

router.post(
  "/delete-role",
  [body("roleId", "Role id required.").notEmpty().escape().trim()],
  DeleteRoles
);

router.post(
  "/create-user",
  [
    body("Name", "Name required.").notEmpty().escape().trim(),

    body("Email", "Email required.").notEmpty().escape().trim().isEmail(),

    body("Username", "Username required.").notEmpty().escape().trim(),

    body("Password", "Password required.").notEmpty().escape().trim(),

    body("designationId", "Designation required.").notEmpty().escape(),

    body("roleId", "Role required.").notEmpty().escape().trim(),
  ],
  CreateUser
);

router.get("/getUserList", GetUserByCompany);

const profilePhotoStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "../../../uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});


const profileUploads = multer({ storage: profilePhotoStorage });

router.post(
  "/update_user",
  [
    body("userId", "User id required").notEmpty().escape().trim(),
    body("Name", "Name required.").notEmpty().escape().trim(),

    body("Email", "Email required.").notEmpty().escape().trim().isEmail(),

    body("Username", "Username required.").notEmpty().escape().trim(),

    body("designationId", "Designation required.").notEmpty().escape(),

    body("roleId", "Role required.").notEmpty().escape().trim(),
  ],
  profileUploads.single("logo"),
  UpdateUser
);

router.post(
  "/get-user",
  [body("userId", "User id required").notEmpty().escape()],
  GetUserInfoByUserId
);

router.post(
  "/change-password",
  [
    body("userId", "User id required").notEmpty().escape(),
    body("password", "Password required").notEmpty().escape(),
  ],
  UpdatePassword
);

router.post(
  "/forgot-password",
  [body("email", "Email id required").notEmpty().escape()],
  SendOtp
);

router.post(
  "/delete-user",
  [body("userId", "User id required").notEmpty().escape()],
  DeleteUser
);

router.post(
  "/update_password",
  [
    body("userId", "User ID required").notEmpty().escape(),
    body("oldPassword", "Old Password required").notEmpty().escape(),
    body("newPassword", "New Password required").notEmpty().escape(),
  ],
  UpdateSelfPassword
);




// router.post("/userRole", UserRoles);

router.get("/GetStateDetails", GetStateDetails);
router.get("/GetCityDetails", GetCityDetails);
router.get("/getAllCountry", getAllCountry);


router.post("/ChangePassword", ChangePassword);
router.post("/getProfile_details", GetProfileInfoByUserId);
router.get("/getCountryCode",GetCountryCode);


module.exports = router;
