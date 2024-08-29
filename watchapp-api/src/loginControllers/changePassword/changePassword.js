const bcrypt = require("bcryptjs");
// const dbConn = require("../../../config/db.config").promise();
const { poolPromise } = require("../../../config/db.config");
const sql = require("mssql");
const nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");
const otpStore = {};

exports.SendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    const pool = await sql.connect(poolPromise);

    const checkUserResult = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .output("result", sql.Int)
      .execute("USP_WP_CHECK_USER_BY_EMAIL");

    const userExists = checkUserResult.output.result === 1;

    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    await pool
      .request()
      .input("us_email", sql.VarChar, email)
      .input("om_otp", sql.VarChar, otp.toString())
      .execute("USP_WP_SEND_OTP");

      otpStore[email] = otp.toString();

    const transporter = nodemailer.createTransport({
      host: "smtp.outlook.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        ciphers: "TLS_AES_256_GCM_SHA384",
        minVersion: "TLSv1.2",
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error("Failed to send OTP:", error);
        return res.status(500).json({ error: "Failed to send OTP" });
      }

      res.status(200).json({ message: "OTP sent successfully" });
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

exports.ChangePassword = async (req, res, next) => {
  try {
  
    const { otp, newPassword } = req.body;

    const email = Object.keys(otpStore).find(key => otpStore[key] === otp);

    console.log(otp, email, newPassword);


    if (!email) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "Otp, and New password are required." });
    }

    const pool = await sql.connect(poolPromise);

    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .output("otp", sql.NVarChar(50))
      .output("result", sql.Int)
      .execute("USP_WP_CHECK_OTP_EMAIL");

    const retrievedOtp = result.output.otp;
    const queryResult = result.output.result;
    console.log(retrievedOtp ,"ro");
    console.log(queryResult, "qr");

    if (otp !== retrievedOtp) {
      return res.status(400).json({
        message: "OTP do not match. Please enter a valid one.",
      });
    }

    // Handle the stored procedure result
    if (queryResult === 0) {
      return res.status(400).json({
        message: "Email or OTP do not match. Please enter a valid one.",
      });
    }

   

    console.log(result.output.result, "ressss");

    const secretKey = "XkhZG4fW2t2W";

    const encryptPassword = (password, key) => {
      return new Promise((resolve, reject) => {
        try {
          const keyutf = CryptoJS.enc.Utf8.parse(key);
          const iv = CryptoJS.enc.Utf8.parse(key);
          const encrypted = CryptoJS.AES.encrypt(password, keyutf, { iv: iv });
          const encStr = encrypted.toString();
          console.log("Encrypted Password:", encStr);
          resolve(encStr);
        } catch (error) {
          reject(error);
        }
      });
    };

    const encryptedPassword = await encryptPassword(newPassword, secretKey);
    console.log(encryptedPassword, "Encrypted Password");

    const updateResult = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .input("newPassword", sql.NVarChar, encryptedPassword)
      .query(
        "UPDATE tbl_users_signup SET us_password = @newPassword WHERE us_email = @email;"
      );

    if (updateResult.rowsAffected[0] === 0) {
      return res.status(500).json({ message: "Failed to update password." });
    }

    res.status(200).json({ message: "Password has been changed." });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
