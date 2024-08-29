const { poolPromise } = require("../../config/db.config");
const sql = require("mssql");
const nodemailer = require("nodemailer");

exports.AddAlarmsAndTrigger = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  const token = req.headers.authorization.split(" ")[1];
  const userId = req.body.userId;
  console.log(userId);

  try {
    const pool = await sql.connect(poolPromise);

    let newAlarmId = 1000000000000001;
    let alarmIdExists = true;

    while (alarmIdExists) {
      const checkAlarmIdQuery =
        "SELECT COUNT(*) AS count FROM tbl_alarms_triggers WHERE at_alarm_id = @AlarmId";
      const checkAlarmIdResult = await pool
        .request()
        .input("AlarmId", sql.BigInt, newAlarmId)
        .query(checkAlarmIdQuery);

      if (checkAlarmIdResult.recordset[0].count === 0) {
        alarmIdExists = false;
      } else {
        newAlarmId += 1;
      }
    }

    const result = await pool
      .request()
      .input("UserId", sql.Int, userId)
      .input("AlarmId", sql.BigInt, newAlarmId)
      .input("AlarmName", sql.NVarChar(100), req.body.AlarmName)
      .input("ServerId", sql.Int, req.body.ServerId)
      .input("ServerNameId", sql.Int, req.body.ServerNameId) // Corrected to req.body.ServerNameId
      .input("TaskSchedulerId", sql.BigInt, req.body.TaskSchedulerId)
      .input("ApplicationTypeId", sql.Int, req.body.ApplicationTypeId)
      .input("ApplicationId", sql.BigInt, req.body.ApplicationId)
      .input("ServerStatusId", sql.Int, req.body.ServerStatusId)
      .input("ErrorCode", sql.NVarChar(100), req.body.ErrorCode)
      .input("Email", sql.Bit, req.body.IsEmail)
      .input("EmailTo", sql.NVarChar(100), req.body.EmailTo)
      .input("EmailCc", sql.NVarChar(100), req.body.EmailCc)
      .input("EmailBcc", sql.NVarChar(100), req.body.EmailBcc)
      .input("EmailDescription", sql.NVarChar(255), req.body.EmailDescription)
      .input("EmailAttachment", sql.NVarChar(255), req.body.EmailAttachment)
      .input("IsSent", sql.Bit, req.body.IsSent)
      .execute("dbo.USP_WP_INSERT_ALARM_AND_TRIGGER_DETAILS");

    const resultValue = result.output?.Result;

    if (resultValue === 1) {
      return res.status(400).json({
        success: false,
        message: "Application already exists.",
      });
    }

    // Send email if IsEmail is set to 1
    if (req.body.IsEmail === 1) {
      const transporter = nodemailer.createTransport({
        host: "smtp.outlook.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          ciphers: "TLS_AES_256_GCM_SHA384",
          minVersion: "TLSv1.2",
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.body.EmailTo,
        cc: req.body.EmailCc,
        bcc: req.body.EmailBcc,
        subject: "Alarms For Your Application",
        text: `Description: ${req.body.EmailDescription}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Failed to send email:", error);
          return res.status(500).json({ error: "Failed to send email" });
        }
        console.log('Email sent: ' + info.response);
      });
    }

    return res.status(201).json({
      success: true,
      message:
        "The Alarms and Trigger details have been successfully inserted.",
      data: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while inserting Alarms and Trigger",
      data: err.message,
    });
  }
};

exports.GetServerStatusName = async (req, res, next) => {
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
      .query(
        "SELECT ss_status_id AS statusId, ss_status_name AS statusName FROM tbl_server_status"
      );

    return res.status(200).json({
      success: true,
      message: "The server status have been successfully retrieved.",
      data: result.recordset,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting server status",
      data: err.message,
    });
  }
};

exports.GetServerTypesName = async (req, res, next) => {
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
      .query(
        "SELECT st_server_id AS serverId , st_server_name AS serverName FROM tbl_server_type"
      );

    return res.status(200).json({
      success: true,
      message: "The servers have been successfully retrieved.",
      data: result.recordset,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting server types",
      data: err.message,
    });
  }
};

exports.GetAlarmAndTriggers = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  const token = req.headers.authorization.split(" ")[1];
  const body = req.body;
  const userId = body.userId;

  try {
    const pool = await sql.connect(poolPromise);
    const result = await pool.request().input("UserId", sql.Int, userId).query(`
      SELECT 
        em.em_email_description AS description, 
        msdm.msd_server_ip AS serverKey
      FROM 
        tbl_alarms_triggers at
      INNER JOIN 
        tbl_email_master em ON at.at_user_id = em.em_user_id
      INNER JOIN 
        tbl_map_server_details_master msdm ON at.at_user_id = msdm.msd_user_id
      WHERE 
        at.at_user_id = @UserId AND at.at_is_email = 1;
    `);

    return res.status(200).json({
      success: true,
      message: "The alarms and triggers have been successfully retrieved.",
      data: result.recordset,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting alarms and triggers",
      data: err.message,
    });
  }
};
