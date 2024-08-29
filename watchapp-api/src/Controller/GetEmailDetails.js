// const dbConn = require('../../config/db.config').promise();
const sql = require("mssql");
const { poolPromise } = require("../../config/db.config");

exports.GetEmailDetails = async (req, res, next) => {
  try {
    const [row_a] = await dbConn.execute(
      "SELECT es_id AS id, es_name AS name FROM `sqm_email_senders` WHERE `es_user_id`=? AND `es_company_id`=? AND `es_is_active`=1 AND `es_is_deleted`=0",
      [req.body.userId, req.body.companyId]
    );
    if (!row_a) {
      return res.status(200).send({
        success: false,
        error: true,
        message: "Something went wrong while fetching email sender details.",
      });
    }
    if (row_a.length > 0) {
      return res.status(200).send({
        success: true,
        error: false,
        message: "Email sender details fetched successfully",
        data: row_a,
      });
    } else {
      return res.status(200).send({
        success: false,
        error: true,
        message: "Email sender details fetched successfully. No records found.",
      });
    }
  } catch (err) {
    console.log("err...", err);
    next(err);
  }
};

exports.GetEmailProvidersList = async (req, res, next) => {
  try {
    const [row_a] = await dbConn.execute(
      "SELECT epm_id AS id, epm_name AS name FROM `sqm_email_provider_master` WHERE `epm_is_active`=1 AND `epm_is_deleted`=0"
    );
    if (!row_a) {
      return res.status(200).send({
        success: false,
        error: true,
        message: "Something went wrong while fetching email provider details.",
      });
    }
    if (row_a.length > 0) {
      return res.status(200).send({
        success: true,
        error: false,
        message: "Email provider details fetched successfully",
        data: row_a,
      });
    } else {
      return res.status(200).send({
        success: false,
        error: true,
        message:
          "Email provider details fetched successfully. No records found.",
      });
    }
  } catch (err) {
    console.log("err...", err);
    next(err);
  }
};

exports.GetStateDetails = async (req, res, next) => {
  try {
    if (!req.query.country_id) {
      return res.status(400).send({
        success: false,
        error: true,
        message: "Invalid Request! Please provide country id.",
      });
    }

    const countryId = req.query.country_id;
    const pool = await sql.connect(poolPromise);

    const result = await pool
      .request()
      .input("countryId", sql.Int, countryId)
      .query("SELECT * FROM tbl_state_master WHERE country_id = @countryId");

    // const row_a = result.recordset;
    const row_a = result.recordset.map((row) => ({
      id: row.id.replace(/["']/g, ""),
      state_name: row.state_name.replace(/["']/g, ""),
      state_id: row.state_id.replace(/["']/g, ""),
      country_id: row.country_id.replace(/["']/g, ""),
      is_active: row.is_active.replace(/["']/g, ""),
      created_by: row.created_by.replace(/["']/g, ""),
      created_date: row.created_date.replace(/["']/g, ""),
      updated_by: row.updated_by.replace(/["']/g, ""),
      updated_date: row.updated_date.replace(/["']/g, ""),
    }));

    if (row_a.length > 0) {
      return res.json({
        success: "true",
        message: "Country id matched Successfully",
        data: row_a,
      });
    } else {
      return res.json({
        status: 404,
        message: "Invalid country_id ",
      });
    }
  } catch (err) {
    console.log("err...", err);
    next(err);
  }
};

// exports.getAllCountry = async (req, res, next) => {
//   try {
//     const [row_a] = await dbConn.execute("SELECT id AS id, country_name AS name FROM `tbl_country_master` WHERE is_active=1");
//     if (row_a && row_a.length > 0) {
//       return res.status(200).send({
//         success: true,
//         error: false,
//         message: "List of All countries",
//         data: row_a,
//       });
//     } else {
//       return res.status(200).send({
//         success: true,
//         error: false,
//         message: "No data found",
//       });
//     }
//   } catch (err) {
//     console.error("err...", err);
//     next(err);
//   }
// };

exports.getAllCountry = async (req, res, next) => {
  try {
    const pool = await sql.connect(poolPromise);

    const result = await pool
      .request()
      .query(
        "SELECT id AS id, country_name AS name FROM tbl_country_master WHERE is_active= '1' "
      );

    // const row_a = result.recordset;
    const row_a = result.recordset.map((row) => ({
      id: row.id.replace(/["']/g, ""), // Removing double quotes and slashes from id
      name: row.name.replace(/["']/g, ""), // Removing double quotes and slashes from name
    }));

    if (row_a && row_a.length > 0) {
      return res.status(200).send({
        success: true,
        error: false,
        message: "List of All countries",
        data: row_a,
      });
    } else {
      return res.status(200).send({
        success: true,
        error: false,
        message: "No data found",
      });
    }
  } catch (err) {
    console.error("err...", err);
    next(err);
  }
};

exports.getAllTimezones = async (req, res, next) => {
  try {
    const [row] = await dbConn.execute(
      "SELECT tm_id AS id, tm_name AS name FROM `sqm_timezone_master` WHERE tm_is_active=1 AND tm_is_deleted=0"
    );
    if (row && row.length > 0) {
      res.status(200).send({
        success: true,
        error: false,
        message: "Timezone data fetched successfully.",
        data: row,
      });
    } else {
      res.status(200).send({
        success: true,
        message: "No data to load.",
        error: false,
      });
    }
  } catch (e) {
    console.error("err...", e);
    next(e);
  }
};

exports.GetCityDetails = async (req, res, next) => {
  try {
    if (!req.query.state_id) {
      return res.status(400).send({
        success: false,
        error: true,
        message: "Invalid Request! Please provide state id.",
      });
    }

    const state_id = req.query.state_id;
    const pool = await sql.connect(poolPromise);
    const result = await pool
      .request()
      .input("state_id", sql.Int, state_id)
      .query("SELECT * FROM tbl_city_master WHERE state_id = @state_id");

 
    const row_a = result.recordset.map((row) => ({
      id: row.id.replace(/["']/g, ""),
      city_name: row.city_name.replace(/["']/g, ""),
      city_id: row.city_id.replace(/["']/g, ""),
      country_id: row.country_id.replace(/["']/g, ""),
      state_id: row.state_id.replace(/["']/g, ""),
      is_active: row.is_active.replace(/["']/g, ""),
      created_by: row.created_by.replace(/["']/g, ""),
      created_date: row.created_date.replace(/["']/g, ""),
      updated_by: row.updated_by.replace(/["']/g, ""),
      updated_date: row.updated_date.replace(/["']/g, ""),
    }));

    if (row_a.length > 0) {
      return res.json({
        success: "true",
        message: "state_id matched Successfully",
        data: row_a,
      });
    } else {
      return res.status(400).json({
        status: 404,
        message: "Invalid state_id ",
      });
    }
  } catch (err) {
    console.log("err...", err);
    next(err);
  }
};
