const { poolPromise } = require("../../config/db.config");
const sql = require("mssql");

exports.GetApplicationPool = async (req, res, next) => {
  const { user_id, PageNumber, RowsPerPage, fromdate, todate, serveripaddress, status } = req.body;

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
      .input('user_id', sql.Int, user_id)
      .input('PageNumber', sql.Int, PageNumber)
      .input('RowsPerPage', sql.Int, RowsPerPage)
      .input('fromdate', sql.DateTime, fromdate)
      .input('todate', sql.DateTime, todate)
      .input('serveripaddress', sql.NVarChar(50), serveripaddress)
      .input('status', sql.NVarChar(50), status)
      .execute('USP_WP_GET_APPLICATION_POOL_STATUS');

    // Retrieve the recordsets for paginated data and total count
    const [paginatedData, totalCountResult] = result.recordsets;
    const totalCount = totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;

    return res.status(200).json({
      success: true,
      message: "The Application Pool details have been successfully retrieved.",
      data: paginatedData,
      user_id: user_id,
      PageNumber: PageNumber,
      RowsPerPage: RowsPerPage,
      totalCount: totalCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting Application Pool details",
      data: err.message,
    });
  }
};




exports.GETPOOLGRAPH = async (req, res, next) => {
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
      .execute('GetAppPoolCPUUsageForGraph');

    const rowCount = result.recordset.length;
    return res.status(200).json({
      success: true,
      message: "The Application Pool For Graph have been successfully retrieved.",
      data: result.recordset,
      rowCount: rowCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting Application Pool For Graph",
      data: err.message,
    });
  }
};
