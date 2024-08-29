const { poolPromise } = require("../../config/db.config");
const sql = require("mssql");



exports.GetAppHealthMemoryGraph = async (req, res, next) => {
  const body = req.body;
  const AdmUserId = body.AdmUserId;

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
      .input('AdmUserId', sql.Int, AdmUserId)
      .execute('GetApplicationHealthMemoryUsageForGraph');
      
      const rowCount = result.recordset.length;
    return res.status(200).json({
      success: true,
      message: "The Application Health Memory Graph details have been successfully retrieved.",
      data: result.recordset,
      rowCount: rowCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting Application Health Memory For Graph By Name",
      data: err.message,
    });
  }
};