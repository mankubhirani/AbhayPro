const { poolPromise } = require("../../config/db.config");
const sql = require("mssql");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
const { log } = require("async");
// const a=require("../../uploads")

const upload = multer({ dest: "./uploads" });
// console.log(upload.dest);
exports.AddAutoClearLog = async (req, res, next) => {
  const body = req.body;
  const { userId, applicationId , scheduleOn} = body;
	console.log(body);

  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const pool = await sql.connect(poolPromise);

    

    const result = await pool
      .request()
      .input("UserId", sql.Int, userId)
      .input("ApplicationId", sql.BigInt, applicationId)
      .input("ClearScheduleOn", sql.Int, scheduleOn)
      .input("IsActive", sql.Bit, 1)
      .query(
        `INSERT INTO tbl_auto_clear_log 
          (acl_user_id, acl_application_id, acl_clear_schedule_on, acl_is_active, acl_created_by, acl_created_date, acl_modified_by, acl_modified_date) 
         VALUES (@UserId, @ApplicationId, @ClearScheduleOn, 1, @UserId, GETDATE(), @UserId, GETDATE());`
      );

    return res.status(201).json({
      success: true,
      message: "The auto clear log details have been successfully inserted.",
      data: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while inserting auto clear log record",
      data: err.message,
    });
  }
};

exports.GetAutoClearLog = async (req, res, next) => {
  const { userId } = req.body;

  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const pool = await sql.connect(poolPromise);
    const result = await pool
      .request()
      .input('UserId', sql.Int, userId)
      .query('SELECT * FROM tbl_auto_clear_log WHERE acl_user_id = @UserId');

    const rowCount = result.recordset.length;

    return res.status(200).json({
      success: true,
      message: "The Auto Clear Log details have been successfully retrieved.",
      data: result.recordset,
      rowCount: rowCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting auto clear log details",
      data: err.message,
    });
  }
};

exports.GetTimespan = async (req, res, next) => {

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
        `SELECT tacl_time_id AS TimespanId , tacl_timespan AS TimeSpanName FROM tbl_timespan_auto_clear_log`
      );
    

    return res.status(201).json({
      success: true,
      message: "Timespan retrived.",
      data: result.recordset,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting Timespan types",
      data: err.message,
    });
  }
};
