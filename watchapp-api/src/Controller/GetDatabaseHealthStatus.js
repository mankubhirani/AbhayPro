const { poolPromise } = require("../../config/db.config");
const sql = require("mssql");

exports.GetDataBaseHealthStatus = async (req, res, next) => {
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
            .execute('USP_GET_DATABASE_HEALTH_STATUS');

        const data = result.recordset;

        return res.status(200).json({
            success: true,
            message: "The Database Health Status details have been successfully retrieved.",
            data: data
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error while getting Database Health Status",
            data: err.message,
        });
    }
};
