const { poolPromise } = require("../../config/db.config");
const sql = require("mssql");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
const { log } = require("async");

const upload = multer({ dest: "./uploads" });
exports.AddWiseLogs = async (req, res, next) => {
  const body = req.body;
  const userId = body.userId;

  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  token = req.headers.authorization.split(" ")[1];

  try {
    const pool = await sql.connect(poolPromise);

    let newAppId = 1000000000000001;
    let appIdExists = true;

    while (appIdExists) {
      const checkAppIdQuery =
        "SELECT COUNT(*) AS count FROM tbl_application_wise_logs WHERE awl_application_id = @ApplicationId";
      const checkAppIdResult = await pool
        .request()
        .input("ApplicationId", sql.BigInt, newAppId)
        .query(checkAppIdQuery);

      if (checkAppIdResult.recordset[0].count === 0) {
        appIdExists = false;
      } else {
        newAppId += 1;
      }
    }

    // Check if req.file exists and has originalname property
    const logo = req.file && req.file.originalname ? req.file.originalname : null;

    const result = await pool
      .request()
      .input("UserId", sql.Int, userId)
      .input("ApplicationId", sql.BigInt, newAppId)
      .input("ApplicationName", sql.NVarChar(100), body.applicationName)
      .input("ValidFrom", sql.DateTime, body.validFrom)
      .input("ValidTo", sql.DateTime, body.validTo)
      .input("ServerId", sql.Int, body.serverId)
      .input("ApplicationType", sql.Int, body.applicationType)
      .input("ApplicationUser", sql.Int, body.applicationUser)
      .input(
        "ApplicationDescription",
        sql.NVarChar(sql.MAX),
        body.applicationDescription
      )
      .input("ApplicationIcon", sql.NVarChar(250), logo)
      .query(
        `INSERT INTO tbl_application_wise_logs 
          (awl_user_id, awl_application_id, awl_application_name, awl_application_icon, awl_valid_from, awl_valid_to, awl_server_id, awl_application_type, awl_application_user, awl_application_discription, awl_is_active, awl_created_date, awl_created_by, awl_modified_by, awl_modified_date) 
          VALUES (@UserId, @ApplicationId, @ApplicationName, @ApplicationIcon, @ValidFrom, @ValidTo, @ServerId,  @ApplicationType, @ApplicationUser, @ApplicationDescription, 1, GETDATE(), @UserId, @UserId, GETDATE());`
      );

    const resultValue = result.output.Result;
    if (resultValue === 1) {
      return res.status(400).json({
        success: false,
        message: "Application already exists.",
      });
    }

    return res.status(201).json({
      success: true,
      message: "The application wise details have been successfully inserted.",
      data: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while inserting application wise record",
      data: err.message,
    });
  }
};

exports.GetWiseLogs = async (req, res, next) => {
    console.log("Request body:", req.body);
    console.log("Request query:", req.query);
    console.log("Authorization header:", req.headers.authorization);
  
    const userId = req.body.user_id; // Adjust here based on your request structure
  
    console.log("Request received for GetWiseLogs API with userId:", userId);
  
    if (!req.headers.authorization) {
      console.log("Authorization token not present in headers");
      return res.status(401).json({
        success: false,
        message: "Token not present",
      });
    }
  
    token = req.headers.authorization.split(" ")[1];
  
    try {
      const pool = await sql.connect(poolPromise);
  
      console.log("Connected to SQL Server database");
  
      const result = await pool
        .request()
        .input("UserId", sql.Int, userId)
        .query(
          `SELECT awl_application_id AS AppId , awl_application_name AS AppName , awl_application_icon AS AppIcon , awl_valid_from VadilFrom , awl_valid_to AS ValidTo , awl_is_active AS Status  FROM tbl_application_wise_logs where awl_user_id = @UserId`
        );
  
      console.log("Query executed successfully");
  
      if (result.recordset.length === 0) {
        console.log("No application logs found for user:", userId);
        return res.status(404).json({
          success: true,
          message: "No servers found for the user.",
          data: [],
        });
      }
  
      console.log("Application logs found:", result.recordset.length);
  
      if (result.recordset.length > 0) {
        for (let i = 0; i < result.recordset.length; i++) {
          const additional_key_features = result.recordset[i].AppIcon;
  
          result.recordset[i].AppIcon = additional_key_features;
          const imageFileNames = result.recordset[i].AppIcon;
  
          const protocol = "https";
          const basePath = `${protocol}://${req.get(
            "host"
          )}/uploads/ApplicationLogs`;
          const imagePaths = imageFileNames
            ? imageFileNames
                .split(", ")
                .map((fileName) => `${basePath}/${fileName.trim()}`)
            : [];
          result.recordset[i].AppIcon = imagePaths;
        }
  
        console.log("Returning application logs data to client");
  
        return res.status(200).json({
          success: true,
          message: "The application types have been successfully retrieved.",
          data: result.recordset,
        });
      }
    } catch (err) {
      console.error("Error in GetWiseLogs API:", err);
      return res.status(500).json({
        success: false,
        message: "Error while getting application types",
        data: err.message,
      });
    }
  };
  
  
  