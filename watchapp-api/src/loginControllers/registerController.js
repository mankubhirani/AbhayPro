const { validationResult } = require("express-validator");
// const conn = require('./../../config/db.config').promise();
var nodemailer = require("nodemailer");
const express = require("express");
const app = express();
app.use(express.json());
const sgMail = require("@sendgrid/mail");
const { v4: uuidv4 } = require("uuid");
const { poolPromise } = require("../../config/db.config");
const sql = require("mssql");
const CryptoJS = require("crypto-js");

exports.register = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    const name = req.body.Name;
    const email = req.body.Email;
    const phoneNo = req.body.Phone;
    const countryCode = req.body.Country_code;
    const password = req.body.Password;
    const is_term_condition = req.body.IsTermCondition;
    const is_company = req.body.IsCompany;
    
    if (!name || !email || !countryCode || !phoneNo || !password || !is_term_condition ) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

    const secretKey = 'XkhZG4fW2t2W';
    const encryptPassword = (password, secretKey) => {
      return new Promise((resolve, reject) => {
        try {
          const key = secretKey;
          const keyutf = CryptoJS.enc.Utf8.parse(key);
          const iv = CryptoJS.enc.Utf8.parse('XkhZG4fW2t2W');
          const enc = CryptoJS.AES.encrypt(password, keyutf, {iv: iv});
          const encStr = enc.toString();
          resolve(encStr);
        } catch (error) {
          reject(error);
        }
      });
    };
    let pool = await sql.connect(poolPromise);

    let result = await pool
      .request()
      .query("SELECT MAX(us_user_id) AS maxUserId FROM tbl_users_signup");

    let maxUserId = 0;
    if (
      result.recordsets.length > 0 &&
      result.recordsets[0].length > 0 &&
      result.recordsets[0][0].maxUserId !== null
    ) {
      maxUserId = parseInt(result.recordsets[0][0].maxUserId);
    }

    const userId = maxUserId + 1;
    const decrypted_password = await encryptPassword(req.body.Password,secretKey);
    let { recordset } = await pool
      .request()
      .input("userId", sql.BigInt, userId)
      .input("email", sql.VarChar, email)
      .input("name", sql.VarChar, name)
      .input("countryCode", sql.VarChar, countryCode)
      .input("phoneNo", sql.VarChar, phoneNo)
      .input("password", sql.VarChar, decrypted_password)
      .input("is_term_condition", sql.Bit, is_term_condition)
      .input("is_company", sql.Bit, is_company)
      .query(
        "EXEC USP_WP_USERS_SIGNUP @us_user_id = @userId, @us_email = @email, @us_first_name = @name, @us_country_code = @countryCode ,@us_phone_no = @phoneNo, @us_password = @password, @us_is_term_condition = @is_term_condition, @us_is_company = @is_company"
      );

      if(recordset[0].RESULT === 1){
        res.status(409).json({
          message: "User already exists.",
          error:true,
          success: false,
        });
      }
      else {
        res.status(201).json({
          message: "User has been created",
          data: recordset[0],
          success: true,
        });
      }
  } catch (err) {
    next(err);
  }
};

