const { poolPromise } = require("../../config/db.config");
const sql = require("mssql");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
const { log } = require("async");

const upload = multer({ dest: "./uploads" });

exports.AddApplications = async (req, res, next) => {
  const body = req.body;

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
        "SELECT COUNT(*) AS count FROM tbl_application_details_master WHERE adm_application_id = @ApplicationId";
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

    // Generate a new filename with timestamp
    const originalname = req.file ? req.file.originalname : null;
    const timestamp = Date.now();
    const logo = originalname ? `${timestamp}-${originalname}` : null;

    // Move the file to the destination with the new filename
    if (req.file) {
      const oldPath = req.file.path;
      const newPath = `./uploads/${logo}`;
      fs.renameSync(oldPath, newPath);
    }

    const result = await pool
      .request()
      .input("UserId", sql.Int, body.user_Id)
      .input("ApplicationId", sql.BigInt, newAppId)
      .input("ApplicationName", sql.NVarChar(100), body.applicationName)
      .input("ValidFrom", sql.DateTime, body.validFrom)
      .input("ValidTo", sql.DateTime, body.validTo)
      .input("ServerId", sql.Int, body.serverId)
      .input("Operation", sql.Int, body.operation)
      .input("ApplicationType", sql.Int, body.applicationType)
      .input("ApplicationUser", sql.Int, body.applicationUser)
      .input(
        "ApplicationDescription",
        sql.NVarChar(sql.MAX),
        body.applicationDescription
      )
      .input("ApplicationIcon", sql.NVarChar(250), logo) // Save the new filename
      .query(
        `INSERT INTO tbl_application_details_master 
							(adm_user_id, adm_application_id, adm_application_name, adm_application_icon, adm_valid_from, adm_valid_to, adm_server_id, adm_opration, adm_application_type, adm_application_user, adm_application_discription, adm_is_active, adm_created_date, adm_created_by, adm_modified_by, adm_modified_date) 
							VALUES (@UserId, @ApplicationId, @ApplicationName, @ApplicationIcon, @ValidFrom, @ValidTo, @ServerId, @Operation, @ApplicationType, @ApplicationUser, @ApplicationDescription, 1, GETDATE(), @UserId, @UserId, GETDATE());`
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
      message: "The application details have been successfully inserted.",
      data: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while inserting application record",
      data: err.message,
    });
  }
};

exports.GetApplications = async (req, res, next) => {
  const body = req.body;
  const userId = body.user_Id;

  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  token = req.headers.authorization.split(" ")[1];

  try {
    const pool = await sql.connect(poolPromise);

    const result = await pool
      .request()
      .input("UserId", sql.Int, userId)
      .query(
        `SELECT adm_application_id AS AppId , adm_application_name AS AppName , adm_application_icon AS AppIcon , adm_valid_from ValidFrom , adm_valid_to AS ValidTo , adm_is_active AS Status  FROM tbl_application_details_master where adm_user_id = @UserId`
      );
    if (result.recordset.length === 0) {
      return res.status(400).json({
        success: true,
        message: "No servers found for the user.",
        data: [],
      });
    }

    if (result.recordset.length > 0) {
      for (let i = 0; i < result.recordset.length; i++) {
        const additional_key_features = result.recordset[i].AppIcon;

        result.recordset[i].AppIcon = additional_key_features;
        const imageFileNames = result.recordset[i].AppIcon;

        const protocol = "https";
        const basePath = `${protocol}://${req.get(
          "host"
        )}/uploads`;
        const imagePaths = imageFileNames
          ? imageFileNames
              .split(", ")
              .map((fileName) => `${basePath}/${fileName.trim()}`)
          : [];
        result.recordset[i].AppIcon = imagePaths;
      }
      return res.status(201).json({
        success: true,
        message: "The application types have been successfully retrieved.",
        data: result.recordset,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting application types",
      data: err.message,
    });
  }
};

exports.GetApplicationTypes = async (req, res, next) => {
  const body = req.body;
  const user_Id = body.userId;

  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  token = req.headers.authorization.split(" ")[1];

  try {
    const pool = await sql.connect(poolPromise);

    const result = await pool
      .request()
      .query(
        `SELECT atm_application_id AS id , atm_application_type_name AS application_name FROM tbl_application_type_master`
      );

    return res.status(201).json({
      success: true,
      message: "The application types have been successfully retrieved.",
      data: result.recordset,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting application types",
      data: err.message,
    });
  }
};

exports.GetOprationTypes = async (req, res, next) => {
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

    const result = await pool
      .request()
      .query(
        `SELECT om_opration_id AS oprationId ,om_opration_name AS oprationName FROM tbl_opration_master`
      );

    return res.status(201).json({
      success: true,
      message: "The application types have been successfully retrieved.",
      data: result.recordset,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting application types",
      data: err.message,
    });
  }
};

exports.GetServers = async (req, res, next) => {
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

    const result = await pool
      .request()
      .input("UserId", sql.Int, userId)
      .query(
        `SELECT msd_server_id AS serverId , msd_server_name AS serverName  FROM tbl_map_server_details_master where msd_user_id= @UserId AND msd_is_active =1`
      );
    if (result.recordset.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No servers found for the user.",
        data: [],
      });
    }

    return res.status(201).json({
      success: true,
      message: "The application types have been successfully retrieved.",
      data: result.recordset,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting application types",
      data: err.message,
    });
  }
};
