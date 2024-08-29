
const { poolPromise } = require("../../config/db.config");
const sql = require("mssql");

exports.GetGeneralStatistics = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  const token = req.headers.authorization.split(" ")[1];
  const { user_Id } = req.body;

  

  try {
    const pool = await sql.connect(poolPromise);

    // Get active and inactive counts for task schedulers by user ID
    const taskSchedulerCounts = await pool.request()
      .input('UserId', sql.Int, user_Id)
      .query(
        `SELECT 
          SUM(CASE WHEN tsd_is_active = 1 THEN 1 ELSE 0 END) AS ActiveCount,
          SUM(CASE WHEN tsd_is_active = 0 THEN 1 ELSE 0 END) AS InactiveCount
         FROM tbl_task_scheduler_details
         WHERE tsd_user_id = @UserId`
      );

    // Get active and inactive counts for servers by user ID
    const serverCounts = await pool.request()
      .input('UserId', sql.Int, user_Id)
      .query(
        `SELECT 
          SUM(CASE WHEN msd_is_active = 1 THEN 1 ELSE 0 END) AS ActiveCount,
          SUM(CASE WHEN msd_is_active = 0 THEN 1 ELSE 0 END) AS InactiveCount
         FROM tbl_map_server_details_master
         WHERE msd_user_id = @UserId`
      );

    // Get active and inactive counts for applications by user ID
    const applicationCounts = await pool.request()
      .input('UserId', sql.Int, user_Id)
      .query(
        `SELECT 
          SUM(CASE WHEN adm_is_active = 1 THEN 1 ELSE 0 END) AS ActiveCount,
          SUM(CASE WHEN adm_is_active = 0 THEN 1 ELSE 0 END) AS InactiveCount
         FROM tbl_application_details_master
         WHERE adm_user_id = @UserId`
      );

    return res.status(200).json({
      success: true,
      message: "Counts retrieved successfully",
      data: {
        taskSchedulers: {
          active: taskSchedulerCounts.recordset[0].ActiveCount,
          inactive: taskSchedulerCounts.recordset[0].InactiveCount,
        },
        servers: {
          active: serverCounts.recordset[0].ActiveCount,
          inactive: serverCounts.recordset[0].InactiveCount,
        },
        applications: {
          active: applicationCounts.recordset[0].ActiveCount,
          inactive: applicationCounts.recordset[0].InactiveCount,
        },
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while retrieving counts",
      data: err.message,
    });
  }
};

