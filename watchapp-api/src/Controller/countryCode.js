const { poolPromise } = require("../../config/db.config");
const sql = require("mssql");


exports.GetCountryCode = async (req, res, next) => {
  try {
    const pool = await sql.connect(poolPromise);

    const result = await pool
      .request()
      .query(
        `SELECT id AS Id, country_name AS CountryName, phone_code AS PhoneCode FROM tbl_country_code`
      );

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No country codes found.",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Country codes retrieved successfully.",
      data: result.recordset,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while retrieving country codes.",
      data: err.message,
    });
  }
};

  