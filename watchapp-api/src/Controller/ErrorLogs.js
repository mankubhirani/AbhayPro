const { poolPromise } = require("../../config/db.config");
const sql = require("mssql");


exports.GetErrorLogs = async (req, res, next) => {
  try {
    // Check for the presence of authorization header
    if (!req.headers.authorization) {
      return res.status(401).json({
        success: false,
        message: "Token not present",
      });
    }

    // Extract token from authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Ensure user_id is present in the request body
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({ 
        success: false,
        message: "User_id is required." 
      });
    }

    // Connect to the database
    const pool = await sql.connect(poolPromise);

    // Execute stored procedure with user_id as input
    let result = await pool
      .request()
      .input("user_id", sql.Int, user_id)
      .execute("dbo.USP_WP_GET_ERROR_LOGS");

    // Check if result is empty and respond accordingly
    if (!result.recordset || result.recordset.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No error logs found for the given user ID.",
        data:[]
      });
    }

    // Return successful response with data
    return res.status(200).json({
      success: true,
      message: "Error logs retrieved successfully",
      data: result.recordset,
    });
  } catch (err) {
    console.error('Error in GetErrorLogs:', err.message);
    return next(err);
  }
};



exports.GetFileSummary = async (req, res, next) => {
  const body = req.body;
  const user_id = body.user_id;

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
      .input('user_id', sql.Int, user_id)
      .execute('USP_WP_GET_FILE_SUMMARY');
      
      const rowCount = result.recordset.length;
    return res.status(200).json({
      success: true,
      message: "The FILE SUMMARY details have been successfully retrieved.",
      data: result.recordset,
      rowCount: rowCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting FILE SUMMARY details",
      data: err.message,
    });
  }
};


 
exports.GetHealthCheckup = async (req, res, next) => {
  const body = req.body;
  const user_id = body.user_id;

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
      .input('user_id', sql.Int, user_id)
      .execute('USP_WP_GET_APPLICATION_HEALTH_CHECKUP');
      
      const rowCount = result.recordset.length;
    return res.status(200).json({
      success: true,
      message: "The Health Checkup details have been successfully retrieved.",
      data: result.recordset,
      rowCount: rowCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting Health Checkup details",
      data: err.message,
    });
  }
};
 



