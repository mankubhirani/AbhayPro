const { poolPromise } = require("../../config/db.config");
const sql = require("mssql");



exports.GETTASKDETAILGRAPH = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  const token = req.headers.authorization.split(" ")[1];
  const userId = req.body.userId;  // Assuming userId is passed in the request body
  const serverIPAddress = req.body.serverIPAddress || null;  // Assuming serverIPAddress is optional in the request body

  try {
    const pool = await sql.connect(poolPromise);
    const result = await pool
      .request()
      .input('UserID', sql.Int, userId)
      .input('ServerIPAddress', sql.VarChar(50), serverIPAddress)
      .execute('GetTaskSchedulerCPUUsageForGraph');

    const rowCount = result.recordset.length;
    return res.status(200).json({
      success: true,
      message: "The Task Details For Graph have been successfully retrieved.",
      data: result.recordset,
      rowCount: rowCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting Task Details For Graph",
      data: err.message,
    });
  }
};


