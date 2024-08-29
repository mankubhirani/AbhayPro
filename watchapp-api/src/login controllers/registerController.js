const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
// const conn = require('./../../config/db.config').promise();
var nodemailer = require("nodemailer");
const express = require("express");
const app = express();
app.use(express.json());
const sgMail = require("@sendgrid/mail");
const { v4: uuidv4 } = require("uuid");
const { poolPromise } = require("../../config/db.config");
const sql = require("mssql");

exports.register = async (req, res, next) => {
  const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   return res.status(422).json({ errors: errors.array() });
  // }

  try {
    const name = req.body.Name;
    const email = req.body.Email;
    const phoneNo = req.body.Phone;
    const password = req.body.Password;
    const is_term_condition = req.body.IsTermCondition;
    const is_privacy_policy = req.body.IsPrivacyPolicy;
    const is_company = req.body.IsCompany;

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

    let { recordset } = await pool
      .request()
      .input("userId", sql.BigInt, userId)
      .input("email", sql.VarChar, email)
      .input("name", sql.VarChar, name)
      .input("phoneNo", sql.VarChar, phoneNo)
      .input("password", sql.VarChar, password)
      .input("is_term_condition", sql.Bit, is_term_condition)
      .input("is_privacy_policy", sql.Bit, is_privacy_policy)
      .input("is_company", sql.Bit, is_company)
      .query(
        "EXEC USP_WP_USERS_SIGNUP @us_user_id = @userId, @us_email = @email, @us_first_name = @name, @us_phone_no = @phoneNo, @us_password = @password, @us_is_term_condition = @is_term_condition, @us_is_privacy_policy = @is_privacy_policy, @us_is_company = @is_company"
      );

    res.status(201).json({
      message: "User has been created",
      // data: recordset[0],
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

// exports.verifyMail = async (req, res, next) => {

//   try {

//     let {userId,uniqueString} = req.params;

//     const [rowFindUser] = await conn.execute('SELECT * FROM `sqm_user_verification` WHERE user_verification_refUserId = ?', [userId])

//     if (rowFindUser?.length > 0) {

//       console.log(rowFindUser[0])

//       const {user_verification_expiresIn} = rowFindUser[0];

//       console.log(user_verification_expiresIn)
//       console.log(Date.now())

//       if(Date.now() < user_verification_expiresIn){

//         console.log('not expired!')

//         await conn.execute('DELETE FROM `sqm_user_verification` WHERE user_verification_refUserId = ?', [userId])

//         await conn.execute('UPDATE `sqm_reg_users` SET ru_is_active=1 WHERE ru_id = ?', [userId])

//         res.status(400).send(`<p>Account Verified Successfully!</p>`);

//       }else{
//          res.status(400).send(`<p>Verification Link Expired</p>`);
//       }

//     }else{
//       return res.status(400).send(`<p>Link Not Valid!</p>`);
//     }

//   }
//   catch (err) {
//     next(err);
//   }

// }

// const sendMailVerificationMail = async(to,description,userId,name)=>{
//   try{

//     const currentUrl = process.env.URL;
//     const uniqueString = uuidv4()+userId;

//     bcrypt.hash(uniqueString, saltRounds, async function(err, hashedString) {

//       const [rows] = await conn.execute('INSERT INTO `sqm_user_verification`(`user_verification_refUserId`,`user_verification_uniqueString`,`user_verification_expiresIn`) VALUES (?,?,?)',
//       [
//         userId,
//         hashedString,
//         Date.now()+21600000
//       ]);
//     });

//     sgMail.setApiKey(process.env.SENDGRID_API_KEY)
//     const msg = {
//       to: to, // Change to your recipient
//       from: 'sqm.client.master@gmail.com', // Change to your verified sender
//       subject: `${description}`,
//       text: `${description}`,
//       html: `<strong>
//       Dear ${name}, </strong>
//       <br>
//       <p>Thank you for registering with us. To complete your registration, please click on the link below to verify your email address:
//       <br>
//       <a href="${currentUrl}user/verify/${userId}/${uniqueString}">here</a> to proceed</p>
//         <br>
//         Thank you,<br>
//         Send Quick Mail
//       `
//     }

//     await sgMail.send(msg);

//   }catch(error){
//     throw err
//   }
// }
