const { poolPromise } = require("../../config/db.config");
const sql = require("mssql");

exports.AddTaskScheduler = async (req, res, next) => {
  const body = req.body;
  const userId = body.userId;

  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const pool = await sql.connect(poolPromise);

    let newTaskSchedulerId = 1000000000000001;
    let taskSchedulerIdExists = true;

    while (taskSchedulerIdExists) {
      const checkTaskSchedulerIdQuery =
        "SELECT COUNT(*) AS count FROM tbl_task_scheduler_details WHERE tsd_task_scheduler_id = @TaskSchedulerId";
      const checkTaskSchedulerIdResult = await pool
        .request()
        .input("TaskSchedulerId", sql.BigInt, newTaskSchedulerId)
        .query(checkTaskSchedulerIdQuery);

      if (checkTaskSchedulerIdResult.recordset[0].count === 0) {
        taskSchedulerIdExists = false;
      } else {
        newTaskSchedulerId += 1;
      }
    }

    const result = await pool
      .request()
      .input("UserId", sql.Int, userId)
      .input("TaskSchedulerId", sql.BigInt, newTaskSchedulerId)
      .input("TaskSchedulerName", sql.NVarChar(50), body.taskSchedulerName)
      .input("TaskValidFrom", sql.DateTime, body.taskValidFrom)
      .input("TaskValidTo", sql.DateTime, body.taskValidTo)
      .input("ServerId", sql.Int, body.serverId)
      .input("ApplicationName", sql.Int, body.applicationName)
      .input("TaskDescription", sql.NVarChar(255), body.taskDescription)
      .input("IsEnable", sql.Bit, body.isEnable)
      .query(
        `INSERT INTO tbl_task_scheduler_details 
          (tsd_user_id, tsd_task_scheduler_id, tsd_task_scheduler_name, tsd_task_valid_from, tsd_task_valid_to, tsd_server_id, tsd_application_name, tsd_task_description, tsd_is_enable, tsd_is_active, tsd_created_date, tsd_created_by, tsd_modified_by, tsd_modified_date) 
         VALUES (@UserId, @TaskSchedulerId, @TaskSchedulerName, @TaskValidFrom, @TaskValidTo,
					 @ServerId, @ApplicationName, @TaskDescription, @IsEnable, 1, GETDATE(), @UserId, @UserId, GETDATE());`
      );

    return res.status(201).json({
      success: true,
      message: "The task scheduler details have been successfully inserted.",
      data: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while inserting task scheduler record",
      data: err.message,
    });
  }
};


exports.GetTaskScheduled = async (req, res, next) => {
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
      .input('UserId', sql.Int, userId)
      .execute('USP_GET_TASK_SCHEDULED_DETAILS');
      
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

exports.UpdateTaskScheduled = async (req, res, next) => {
  let token = null;

  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  token = req.headers.authorization.split(" ")[1];

  try {
    const { tsd_id,taskSchedulerName, taskValidFrom, taskValidTo , serverId , applicationId , taskDescription , isEnable } = req.body;

    if (!tsd_id || !taskSchedulerName || !taskValidFrom || !taskValidTo  || !applicationId || !taskDescription || !isEnable ) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const pool = await sql.connect(poolPromise);

    const request = pool.request();
    request.input('tsd_id', sql.Int, tsd_id);
    request.input('TaskSchedulerName', sql.NVarChar(255), taskSchedulerName);
    request.input('TaskValidFrom', sql.DateTime, taskValidFrom);
    request.input('TaskValidTo', sql.DateTime, taskValidTo);
    request.input('ServerId', sql.Int, serverId);
    request.input('ApplicationId', sql.Int, applicationId);
    request.input('TaskDescription', sql.NVarChar(255), taskDescription);
    request.input('IsEnable', sql.Bit, isEnable);
    request.output('result_status', sql.Int);

    const result = await request.execute('dbo.USP_WP_UPDATE_TASK_SCHEDULED');
    const resultStatus = result.output.result_status;

    if (resultStatus === 1) {
      return res.status(200).json({
        message: "Task scheduled has been updated",
        success: true,
      });
    } else {
      return res.status(404).json({
        message: "Task scheduled not found.",
        success: false,
      });
    }
  } catch (err) {
    return next(err);
  }
};

exports.DeleteTaskScheduled = async (req, res, next) => {

	let token = null;
  
	if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  token = req.headers.authorization.split(" ")[1];


  try {
		const pool = await sql.connect(poolPromise);
    const tsd_id = req.query.tsd_id;

    console.log(tsd_id,"task id ");
		if (!tsd_id ) {
			return res.status(400).json({ message: 'Task Id is reqiure.' });
		}
    const request = pool.request();

    request.input('tsd_id', sql.Int, tsd_id);
    request.output('result_status', sql.Int);

    const result = await request.execute('dbo.USP_WP_DELETE_TASK_SCHEDULED');
    const resultStatus = result.output.result_status;

    if (resultStatus === 1) {
      return res.status(200).json({
        message: "Task scheduler deleted successfully",
        success: true,
      });
    } else {
      return res.status(404).json({
        message: "Task scheduler not found.",
        success: false,
      });
    }
  } catch (err) {
    return next(err);
  }
};

