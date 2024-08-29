const { poolPromise } = require("../../config/db.config");
const sql = require("mssql");


exports.GetScheduledTask = async (req, res, next) => {
  const body = req.body;
  const user_id = body.user_id;
  const server_ip = body.server_ip || null; 
  const status = body.status || null; 
  const fromdate = body.fromdate || null; 
  const todate = body.todate || null; 
  
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
      .input('UserID', sql.Int, user_id)
      .input('ServerIP', sql.NVarChar(50), server_ip)
      .input('Status', sql.NVarChar(50), status)
      .input('fromdate', sql.DateTime, fromdate)
      .input('todate', sql.DateTime, todate)
      .execute('GetScheduledTasksWithServerDetails');

    const rowCount = result.recordset.length;
    return res.status(200).json({
      success: true,
      message: "The task scheduled details have been successfully retrieved.",
      data: result.recordset,
      rowCount: rowCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting task scheduled details",
      data: err.message,
    });
  }
};




exports.GetServerIPTask = async (req, res, next) => {
  const body = req.body;
  const UserId = body.UserId;

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
      .input('UserId', sql.Int, UserId)
      .execute('USP_GET_SERVER_TASK_DETAILS');
      
      const rowCount = result.recordset.length;
    return res.status(200).json({
      success: true,
      message: "The server IP Address details have been successfully retrieved.",
      data: result.recordset,
      rowCount: rowCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting Server IP Address details",
      data: err.message,
    });
  }
};