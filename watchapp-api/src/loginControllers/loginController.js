require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { poolPromise } = require("../../config/db.config");
const sql = require("mssql");
const CryptoJS = require("crypto-js");

exports.login = async (req, res, next) => {
  const { Email, Pas } = req.body;

  try {
    const pool = await sql.connect(poolPromise);

    let userRecord = await pool
      .request()
      .input("email", sql.NVarChar(100), Email)
      .query(
        "SELECT us_password AS pwdHash, us_user_id AS userId FROM tbl_users_signup WHERE us_email = @email AND us_is_active = 1"
      );

    if (userRecord.recordset.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Email does not exist or user is not active",
      });
    }

    const user = userRecord.recordset[0];
    const dbEncPwd = user.pwdHash;

    const secretKey = "XkhZG4fW2t2W";

    const decryptData = (encryptedPassword, key) => {
      try {
        const keyUtf = CryptoJS.enc.Utf8.parse(key);
        const iv = CryptoJS.enc.Utf8.parse(key); // Use the same key as IV for simplicity
        const decrypted = CryptoJS.AES.decrypt(encryptedPassword, keyUtf, {
          iv: iv,
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
      } catch (error) {
        console.error("Decryption error:", error);
        throw error;
      }
    };

    const decryptedPassword = decryptData(dbEncPwd, secretKey);

    if (decryptedPassword !== Pas) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    let loginResult = await pool
      .request()
      .input("email", sql.NVarChar(100), Email)
      .input("password", sql.NVarChar(100), dbEncPwd)
      .execute("USP_WP_USERS_LOGIN");

    const loginResponse = loginResult.recordset[0];
    if (loginResponse.Result === "Success") {
      const token = jwt.sign(
        { user_id: user.userId },
        process.env.SECRET_KEY,
        { expiresIn: '10h' }
      );

      let loginDetailsResult = await pool
        .request()
        .input("user_key", sql.Int, user.userId)
        .input("email_id", sql.VarChar(50), Email)
        .input("token", sql.VarChar(300), token) 
        .execute("USP_WP_SAVE_LOGIN_DETAILS");

      const loginDetailsResponse = loginDetailsResult.recordset[0];
      
      if (loginDetailsResponse.RESULT === 1) {
        return res.json({
          success: true,
          message: 'Login successful',
          data: {
            userId: user.userId,
            userEmail: Email,
            CompanyId:loginResult.recordset[0].CompanyId
          },
          token: token,
          IsCompanyRegistrationFormFill:loginResponse.Message
        });
      } else {
        return res.status(400).json({
          success: false,
          message: 'Failed to save login details',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Failed to login',
      });
    }
  } catch (err) {
    next(err);
  }
};
