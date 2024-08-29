const { poolPromise } = require("../../config/db.config");
const sql = require("mssql");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    console.log(file.originalname,"name")
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

exports.CompanyRegistration = async (req, res, next) => {
  let token = null;
  let userDetails = null;
  let companyId = null;

  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  token = req.headers.authorization.split(" ")[1];

  const body = req.body;

  if (
    !body.companyName ||
    !body.companyEmail ||
    !body.contact ||
    !body.portal ||
    !body.industryId ||
    !body.employeeCountId ||
    !body.countryId ||
    !body.stateId ||
    !body.cityId ||
    !body.postalCode ||
    !body.user_id
  ) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields." });
  }

  try {
    userDetails = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  try {
    const maxCompanyIdQuery =
      "SELECT MAX(ucd_company_id) AS maxCompanyId FROM tbl_user_company_details";
    const pool = await sql.connect(poolPromise);
    const maxCompanyIdResult = await pool.request().query(maxCompanyIdQuery);
    const maxCompanyId = maxCompanyIdResult.recordset[0].maxCompanyId;
    const newCompanyId = maxCompanyId ? maxCompanyId + 1 : 1;

    // Add timestamp to logo filename
    const logo =
      req.file && req.file.filename ? req.file.filename : null;

    const result = await pool
      .request()
      .input("company_id", sql.Int, newCompanyId)
      .input("user_id", sql.Int, req.body.user_id)
      .input("companyName", sql.VarChar(255), req.body.companyName)
      .input("companyEmail", sql.VarChar(100), req.body.companyEmail)
      .input("contact", sql.BigInt, req.body.contact)
      .input("portal", sql.VarChar(250), req.body.portal)
      .input("industryId", sql.Int, req.body.industryId)
      .input("employeeCountId", sql.Int, req.body.employeeCountId)
      .input("taxId", sql.Int, req.body.taxId)
      .input("taxInfo", sql.VarChar(250), req.body.taxInfo)
      .input("countryId", sql.VarChar(50), req.body.countryId)
      .input("stateId", sql.VarChar(50), req.body.stateId)
      .input("cityId", sql.VarChar(50), req.body.cityId)
      .input("postalCode", sql.VarChar(200), req.body.postalCode)
      .input("address", sql.VarChar(200), req.body.address)
      .input("logo", sql.NVarChar(250), logo)
      .query(
        `INSERT INTO tbl_user_company_details 
          (ucd_company_id, ucd_us_user_id, ucd_company_name, ucd_company_email, ucd_company_contact_no, ucd_company_portal, ucd_industry, ucd_total_employees, ucd_tax_type, ucd_tax_information, ucd_company_logo, ucd_country, ucd_state, ucd_city, ucd_pincode, ucd_street_address, ucd_is_active, ucd_created_date, ucd_created_by) 
          VALUES 
          (@company_id, @user_id, @companyName, @companyEmail, @contact, @portal, @industryId, @employeeCountId, @taxId, @taxInfo, @logo, @countryId, @stateId, @cityId, @postalCode, @address, 1, GETDATE(), @user_id)`
      );

    return res.status(201).json({
      success: true,
      message: "The company details have been successfully inserted.",
      data: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while inserting company record",
      data: err.message,
    });
  }
};

exports.EditCompanyRegistration = async (req, res, next) => {
  if (!req.body.companyId) {
    return res.status(401).json({
      success: false,
      message: "Company Id missing",
    });
  }

  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  const companyId = req.body.companyId;
  const token = req.headers.authorization.split(" ")[1];

  let userDetails;
  try {
    userDetails = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  // Add timestamp to logo filename
  const logo =
    req.file && req.file.filename ? req.file.filename : null;

  const pool = await sql.connect(poolPromise);
  try {
    const result = await pool
      .request()
      .input("companyId", sql.Int, companyId)
      .input("userId", sql.Int, req.body.user_id)
      .input("companyName", sql.VarChar(255), req.body.companyName)
      .input("companyEmail", sql.VarChar(100), req.body.companyEmail)
      .input("contact", sql.BigInt, req.body.contact)
      .input("portal", sql.VarChar(250), req.body.portal)
      .input("industryId", sql.Int, req.body.industryId)
      .input("employeeCountId", sql.Int, req.body.employeeCountId)
      .input("taxId", sql.Int, req.body.taxId)
      .input("taxInfo", sql.VarChar(250), req.body.taxInfo)
      .input("countryId", sql.VarChar(50), req.body.countryId)
      .input("stateId", sql.VarChar(50), req.body.stateId)
      .input("cityId", sql.VarChar(50), req.body.cityId)
      .input("postalCode", sql.VarChar(200), req.body.postalCode)
      .input("address", sql.VarChar(200), req.body.address)
      .input("logo", sql.NVarChar(250), logo)
      .execute("dbo.USP_WP_UPDATE_COMPANY_DETAILS");

    console.log(result, "result");

    if (result.rowsAffected[0] === 1) {
      return res.status(201).json({
        success: true,
        message: "The company details have been successfully updated.",
        data: result,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid request",
        data: result,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while updating company record",
      data: err.message,
    });
  }
};

exports.GetCompanyDetailsById = async (req, res, next) => {
  const { user_id: UserId } = req.body;

  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  const token = req.headers.authorization.split(" ")[1];

  let userDetails;
  try {
    userDetails = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  try {
    const pool = await sql.connect(poolPromise);

    const result = await pool
      .request()
      .input("UserId", sql.Int, UserId)
      .execute("USP_WP_GET_COMPANY_DETAILS");
    const rows = result.recordset;

    if (rows.length > 0) {
      for (let i = 0; i < rows.length; i++) {
        const companyLogo = rows.companyLogo;

        rows.companyLogo = companyLogo;
        const imageFileNames = rows[i].companyLogo;

        //const protocol = "http";
        const basePath = `${req.protocol}://${req.get("host")}/uploads`;
        const imagePaths = imageFileNames
          ? imageFileNames
              .split(", ")
              .map((fileName) => `${basePath}/${fileName.trim()}`)
          : [];// const dbConn = require('../../config/db.config').promise();
          const { poolPromise } = require("../../config/db.config");
          const sql = require("mssql");
          const jwt = require("jsonwebtoken");
          const fs = require("fs");
          const multer = require("multer");
          const upload = multer({ dest: "uploads/" });
          
          (exports.CompanyRegistration = async (req, res, next) => {
            let token = null;
            let userDetails = null;
            let companyId = null;
          
            if (!req.headers.authorization) {
              return res.status(401).json({
                success: false,
                message: "Token not present",
              });
            }
          
            token = req.headers.authorization.split(" ")[1];
          
            const body = req.body;
          
            if (
              !body.companyName ||
              !body.companyEmail ||
              !body.contact ||
              !body.portal ||
              !body.industryId ||
              !body.employeeCountId ||
              !body.countryId ||
              !body.stateId ||
              !body.cityId ||
              !body.postalCode ||
              !body.user_id
            ) {
              return res
                .status(400)
                .json({ message: "Please fill in all required fields." });
            }
          
            try {
              userDetails = jwt.verify(token, process.env.SECRET_KEY);
            } catch (error) {
              return res.status(401).json({
                success: false,
                message: "Invalid token",
              });
            }
          
            try {
              const maxCompanyIdQuery =
                "SELECT MAX(ucd_company_id) AS maxCompanyId FROM tbl_user_company_details";
              const pool = await sql.connect(poolPromise);
              const maxCompanyIdResult = await pool.request().query(maxCompanyIdQuery);
              const maxCompanyId = maxCompanyIdResult.recordset[0].maxCompanyId;
              const newCompanyId = maxCompanyId ? maxCompanyId + 1 : 1;
          
              const logo =
                req.file && req.file.originalname ? req.file.originalname : null;
          
              const result = await pool
                .request()
                .input("company_id", sql.Int, newCompanyId)
                .input("user_id", sql.Int, req.body.user_id)
                .input("companyName", sql.VarChar(255), req.body.companyName)
                .input("companyEmail", sql.VarChar(100), req.body.companyEmail)
                .input("contact", sql.BigInt, req.body.contact)
                .input("portal", sql.VarChar(250), req.body.portal)
                .input("industryId", sql.Int, req.body.industryId)
                .input("employeeCountId", sql.Int, req.body.employeeCountId)
                .input("taxId", sql.Int, req.body.taxId)
                .input("taxInfo", sql.VarChar(250), req.body.taxInfo)
                .input("countryId", sql.VarChar(50), req.body.countryId)
                .input("stateId", sql.VarChar(50), req.body.stateId)
                .input("cityId", sql.VarChar(50), req.body.cityId)
                .input("postalCode", sql.VarChar(200), req.body.postalCode)
                .input("address", sql.VarChar(200), req.body.address)
                .input("logo", sql.NVarChar(250), req.file.originalname)
                .query(
                  `INSERT INTO tbl_user_company_details 
                    (ucd_company_id, ucd_us_user_id, ucd_company_name, ucd_company_email, ucd_company_contact_no, ucd_company_portal, ucd_industry, ucd_total_employees,ucd_tax_type, ucd_tax_information, ucd_company_logo ,ucd_country, ucd_state, ucd_city, ucd_pincode, ucd_street_address, ucd_is_active ,ucd_created_date, ucd_created_by) 
                    VALUES 
                    (@company_id, @user_id, @companyName, @companyEmail, @contact, @portal, @industryId, @employeeCountId,@taxId ,@taxInfo, @logo, @countryId, @stateId, @cityId, @postalCode, @address, 1, GETDATE(), @user_id)`
                );
          
              return res.status(201).json({
                success: true,
                message: "The company details have been successfully inserted.",
                data: result,
              });
            } catch (err) {
              console.error(err);
              return res.status(500).json({
                success: false,
                message: "Error while inserting company record",
                data: err.message,
              });
            }
          }),
            (exports.EditCompanyRegistration = async (req, res, next) => {
              if (!req.body.companyId) {
                return res.status(401).json({
                  success: false,
                  message: "Company Id missing",
                });
              }
          
              if (!req.headers.authorization) {
                return res.status(401).json({
                  success: false,
                  message: "Token not present",
                });
              }
          
              const companyId = req.body.companyId;
              const token = req.headers.authorization.split(" ")[1];
          
              let userDetails;
              try {
                userDetails = jwt.verify(token, process.env.SECRET_KEY);
              } catch (error) {
                return res.status(401).json({
                  success: false,
                  message: "Invalid token",
                });
              }
          
              const logo =
                req.file && req.file.originalname ? req.file.originalname : null;
              const pool = await sql.connect(poolPromise);
              try {
                const result = await pool
                  .request()
                  .input("companyId", sql.Int, companyId)
                  .input("userId", sql.Int, req.body.user_id)
                  .input("companyName", sql.VarChar(255), req.body.companyName)
                  .input("companyEmail", sql.VarChar(100), req.body.companyEmail)
                  .input("contact", sql.BigInt, req.body.contact)
                  .input("portal", sql.VarChar(250), req.body.portal)
                  .input("industryId", sql.Int, req.body.industryId)
                  .input("employeeCountId", sql.Int, req.body.employeeCountId)
                  .input("taxId", sql.Int, req.body.taxId)
                  .input("taxInfo", sql.VarChar(250), req.body.taxInfo)
                  .input("countryId", sql.VarChar(50), req.body.countryId)
                  .input("stateId", sql.VarChar(50), req.body.stateId)
                  .input("cityId", sql.VarChar(50), req.body.cityId)
                  .input("postalCode", sql.VarChar(200), req.body.postalCode)
                  .input("address", sql.VarChar(200), req.body.address)
                  .input("logo", sql.NVarChar(250), logo)
                  .execute("dbo.USP_WP_UPDATE_COMPANY_DETAILS");
          
                console.log(result, "result");
          
                if (result.rowsAffected[0] === 1) {
                  return res.status(201).json({
                    success: true,
                    message: "The company details have been successfully updated.",
                    data: result,
                  });
                } else {
                  return res.status(400).json({
                    success: false,
                    message: "Invalid request",
                    data: result,
                  });
                }
              } catch (err) {
                console.error(err);
                return res.status(500).json({
                  success: false,
                  message: "Error while updating company record",
                  data: err.message,
                });
              }
            });
          
          exports.GetCompanyDetailsById = async (req, res, next) => {
            const { user_id: UserId } = req.body;
          
            if (!req.headers.authorization) {
              return res.status(401).json({
                success: false,
                message: "Token not present",
              });
            }
          
            const token = req.headers.authorization.split(" ")[1];
          
            let userDetails;
            try {
              userDetails = jwt.verify(token, process.env.SECRET_KEY);
            } catch (error) {
              return res.status(401).json({
                success: false,
                message: "Invalid token",
              });
            }
          
            try {
              const pool = await sql.connect(poolPromise);
          
              const result = await pool
                .request()
                .input("UserId", sql.Int, UserId)
                .execute("USP_WP_GET_COMPANY_DETAILS");
              const rows = result.recordset;
          
              if (rows.length > 0) {
                for (let i = 0; i < rows.length; i++) {
                  const companyLogo = rows.companyLogo;
          
                  rows.companyLogo = companyLogo;
                  const imageFileNames = rows[i].companyLogo;
          
                  const protocol = "https";
                  const basePath = `${protocol}://${req.get("host")}/uploads`;
                  const imagePaths = imageFileNames
                    ? imageFileNames
                        .split(", ")
                        .map((fileName) => `${basePath}/${fileName.trim()}`)
                    : [];
                  result.recordset[i].AppIcon = imagePaths;
                }
                return res.status(201).json({
                  success: true,
                  message: "The Company details has been successfully retrived.",
                  data: result.recordset,
                });
              } else {
                return res.status(404).json({
                  success: false,
                  message: "No company found!",
                });
              }
            } catch (err) {
              console.log(err);
              return res.status(500).json({
                success: false,
                message: "Error while retrieving company record",
                data: err.message,
              });
            }
          };
          
          exports.GetIndustryTypes = async (req, res, next) => {
            try {
              const pool = await sql.connect(poolPromise);
          
              const result = await pool
                .request()
                .query("SELECT * FROM tbl_company_industry");
          
              let industry = result.recordset;
              return res.status(201).json({
                message: "Industry Types fetched",
                success: true,
                data: industry,
              });
            } catch (err) {
              next(err);
            }
          };
          
          exports.GetEmployeeCount = async (req, res, next) => {
            try {
              const pool = await sql.connect(poolPromise);
          
              const result = await pool
                .request()
                .query("SELECT * FROM tbl_emp_no_master");
          
              let industry = result.recordset;
              return res.status(201).json({
                message: "Industry Types fetched",
                success: true,
                data: industry,
              });
            } catch (err) {
              next(err);
            }
          };
          
          exports.GetTaxTypes = async (req, res, next) => {
            try {
              const pool = await sql.connect(poolPromise);
              const result = await pool.request().query("SELECT * FROM tbl_tax_types");
          
              return res.status(201).json({
                message: "Tax types Fetched",
                success: true,
                data: result.recordset,
              });
            } catch (err) {
              next(err);
            }
          };
          
        result.recordset[i].AppIcon = imagePaths;
      }
      return res.status(201).json({
        success: true,
        message: "The Company details has been successfully retrived.",
        data: result.recordset,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No company found!",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while retrieving company record",
      data: err.message,
    });
  }
};

exports.GetIndustryTypes = async (req, res, next) => {
  try {
    const pool = await sql.connect(poolPromise);

    const result = await pool
      .request()
      .query("SELECT * FROM tbl_company_industry");

    let industry = result.recordset;
    return res.status(201).json({
      message: "Industry Types fetched",
      success: true,
      data: industry,
    });
  } catch (err) {
    next(err);
  }
};

exports.GetEmployeeCount = async (req, res, next) => {
  try {
    const pool = await sql.connect(poolPromise);

    const result = await pool
      .request()
      .query("SELECT * FROM tbl_emp_no_master");

    let industry = result.recordset;
    return res.status(201).json({
      message: "Industry Types fetched",
      success: true,
      data: industry,
    });
  } catch (err) {
    next(err);
  }
};

exports.GetTaxTypes = async (req, res, next) => {
  try {
    const pool = await sql.connect(poolPromise);
    const result = await pool.request().query("SELECT * FROM tbl_tax_types");

    return res.status(201).json({
      message: "Tax types Fetched",
      success: true,
      data: result.recordset,
    });
  } catch (err) {
    next(err);
  }
};
