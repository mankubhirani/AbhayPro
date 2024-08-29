const express = require("express");
const app = express();
app.use(express.json());
const { poolPromise } = require("../../config/db.config");
const sql = require("mssql");

exports.MapServer = async (req, res, next) => {
  let token = null;

  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  token = req.headers.authorization.split(" ")[1];

  try {
    const { user_id,server_name, server_ip, server_description } = req.body;

    if (!user_id || !server_name || !server_ip || !server_description) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const pool = await sql.connect(poolPromise);
		 // Check if there are existing records in the table
		 const checkExistingRecordsQuery = "SELECT COUNT(*) AS recordCount FROM tbl_map_server_details_master";
		 const recordCountResult = await pool.request().query(checkExistingRecordsQuery);
		 const recordCount = recordCountResult.recordset[0].recordCount;
 
		 let nextServerId;
 
		 if (recordCount === 0) {
			 // If there are no existing records, start server_id from 1
			 nextServerId = 1;
		 } else {
			 // If there are existing records, get the last inserted server_id and increment by 1
			 const getLastServerIdQuery = "SELECT TOP 1 msd_server_id FROM tbl_map_server_details_master ORDER BY msd_server_id DESC";
			 const lastServerIdResult = await pool.request().query(getLastServerIdQuery);
			 const lastServerId = lastServerIdResult.recordset[0].msd_server_id;
			 nextServerId = lastServerId + 1;
		 }

    const request = pool.request();
    request.input('msd_user_id', sql.Int, user_id);
    request.input('msd_server_id', sql.Int, nextServerId);
    request.input('msd_server_name', sql.NVarChar(255), server_name);
    request.input('msd_server_ip', sql.NVarChar(255), server_ip);
    request.input('msd_server_description', sql.NVarChar(sql.MAX), server_description);
    request.output('result_status', sql.Int);

    const result = await request.execute('USP_WP_ADD_MAP_SERVER');
    const resultStatus = result.output.result_status;

    if (resultStatus === 1) {
      return res.status(409).json({
        message: "Map server already exists.",
        error: true,
        success: false,
      });
    } else {
      return res.status(201).json({
        message: "Map server has been created",
        data: result.recordset,
        success: true,
      });
    }
  } catch (err) {
    return next(err);
  }
};

exports.GetMapServer = async (req, res, next) => {

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
    const { user_id} = req.body;

		if (!user_id ) {
			return res.status(400).json({ message: 'User_id is reqiure.' });
		}

    let result = await pool.request()
      .input('user_id', sql.Int, user_id)
      .execute('USP_WP_GET_MAP_SERVERS_BY_USER_ID');

    const resultStatus = result.output.result_status;

		if (!result.recordset || result.recordset.length === 0) {
      return res.status(200).json({
        message: "No map servers found for the given user ID.",
        data: result.recordset,
        success: false,
      });
    }

    return res.status(201).json({
      message: "Map servers retrieved successfully",
      data: result.recordset,
      success: true,
    });
  } catch (err) {
    return next(err);
  }
};

exports.UpdateMapServer = async (req, res, next) => {
  let token = null;

  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  token = req.headers.authorization.split(" ")[1];

  try {
    const { msd_id,server_name, server_ip, server_description } = req.body;

    if (!msd_id || !server_name || !server_ip || !server_description) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const pool = await sql.connect(poolPromise);

    const request = pool.request();
    request.input('msd_id', sql.Int, msd_id);
    request.input('msd_server_name', sql.NVarChar(255), server_name);
    request.input('msd_server_ip', sql.NVarChar(255), server_ip);
    request.input('msd_server_description', sql.NVarChar(sql.MAX), server_description);
    request.output('result_status', sql.Int);

    const result = await request.execute('dbo.USP_WP_UPDATE_MAP_SERVER');
    const resultStatus = result.output.result_status;

    if (resultStatus === 1) {
      return res.status(200).json({
        message: "Map server has been updated",
        success: true,
      });
    } else {
      return res.status(404).json({
        message: "Map server not found.",
        error: true,
        success: false,
      });
    }
  } catch (err) {
    return next(err);
  }
};


exports.DeleteMapServer = async (req, res, next) => {

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
    const { msd_id} = req.body;

		if (!msd_id ) {
			return res.status(400).json({ message: 'User_id is reqiure.' });
		}
    const request = pool.request();

    request.input('msd_id', sql.Int, msd_id);
    request.output('result_status', sql.Int);

    const result = await request.execute('dbo.USP_WP_DELETE_MAP_SERVER');
    const resultStatus = result.output.result_status;

    if (resultStatus === 1) {
      return res.status(200).json({
        message: "Map server deleted successfully",
        success: true,
      });
    } else {
      return res.status(404).json({
        message: "Map server not found.",
        success: false,
      });
    }
  } catch (err) {
    return next(err);
  }
};
