// const dbConn = require('../../../config/db.config').promise();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const { verifyJwt } = require("../jwtAuth");
const sql = require("mssql");
// const { poolPromise } = require("../../../config/db.config");
const { poolPromise } = require('../../../config/db.config');
const CryptoJS = require("crypto-js");

exports.GetRoles = async (req, res, next) => {
  try {
    const userDetails = verifyJwt(req);
    console.log(userDetails);

    const [roleRow] = await dbConn.execute(
      "SELECT rm_id AS roleId ,rm_name as roleName from sqm_role_master WHERE `rm_is_active`=1 AND companyId=?",
      [userDetails.companyId]
    );
    if (roleRow.length == 0) {
      return res.status(400).send({
        message: "No Roles Found!",
      });
    }

    return res.status(200).send({
      message: "Roles Fetched!",
      data: roleRow,
    });
  } catch (err) {
    console.log("err...", err);
    return res.status(500).send({
      message: err.message,
    });
  }
};

exports.GetRoleById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "Required fields missing!" });
  }

  try {
    // userDetails = verifyJwt(req);

    const [roleRow] = await dbConn.execute(
      "SELECT rm_id AS roleId ,rm_name as roleName from sqm_role_master WHERE `rm_id`=? AND `rm_is_active`=1 AND companyId=?",
      [req.body.roleId, userDetails.companyId]
    );
    if (roleRow.length == 0) {
      return res.status(400).send({
        message: "No Roles Found!",
      });
    }

    return res.status(200).send({
      message: "Roles Fetched!",
      data: roleRow[0],
    });
  } catch (err) {
    console.log("err...", err);
    return res.status(500).send({
      message: err.message,
    });
  }
};

exports.CreateRoles = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: "Required fields missing!" });
    }

    const userDetails = verifyJwt(req);

    const [roleRow] = await dbConn.execute(
      `INSERT INTO sqm_role_master (rm_name, companyId, description)
     SELECT ?, ?, ?
     FROM dual
     WHERE NOT EXISTS (
       SELECT 1
       FROM sqm_role_master
       WHERE rm_name = ? AND companyId = ?
     )`,
      [
        req.body.roleName,
        userDetails.companyId,
        req.body.description,      
        req.body.roleName,
        userDetails.companyId,
      ]
    );

    if (roleRow.affectedRows == 0) {
      return res.status(400).send({
        message: "Role Already Exists!!",
      });
    }

    return res.status(200).send({
      message: "Role Added Successfully!",
    });
  } catch (err) {      
    console.log("err...", err);
    return res.status(500).send({
      success: true,
      error: false,
      message: err.message,
    });
  }
};

exports.UpdateRoles = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: "Required fields missing!" });
    }

    const userDetails = verifyJwt(req);

    const [roleRow] = await dbConn.execute(
      `UPDATE sqm_role_master SET rm_name=?,description=? WHERE rm_id=? AND companyId=?`,
      [
        req.body.roleName,
        req.body.description,
        req.body.roleId,
        userDetails.companyId,
      ]
    );dbConndbConn

    if (roleRow.affectedRows == 0) {
      return res.status(400).send({
        message: "No Role Exists!!",      
      })
     // message: "Role Updated Successfully!",
    }
    
  } catch (err) {
    console.log("err...", err);
    return res.status(500).send({
      message: err.message,
    });
  }      
};

exports.DeleteRoles = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: "Required fields missing!" });
    }

    const userDetails = verifyJwt(req);

    const [roleRow] = await dbConn.execute(
      `DELETE FROM sqm_role_master WHERE rm_id=? AND companyId=?`,
      [req.body.roleId, userDetails.companyId]
    );

    if (roleRow.affectedRows == 0) {
      return res.status(400).send({
        message: "No such Role Exists!!",
      });
    }

    return res.status(200).send({
      message: "Role Deleted Successfully!",
    });
  } catch (err) {
    console.log("err...", err);
    return res.status(500).send({
      message: err.message,
    });
  }
};

exports.CreateUser = async (req, res, next) => {

  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  token = req.headers.authorization.split(" ")[1];
  
  const {
    Admin_id,
    user_name,
    mobile_no,
    role_type,
    email,
    Password,
    reporting_manager
  } = req.body;
  try {
    const pool = await sql.connect(poolPromise);
    const result = await pool.request()
      .input('Admin_id', sql.Int, Admin_id)
      .input('user_name', sql.NVarChar(sql.MAX), user_name)
      .input('mobile_no', sql.BigInt, mobile_no)
      .input('role_type', sql.Int, role_type)
      .input('email', sql.NVarChar(100), email)
      .input('Password', sql.NVarChar(255), Password)
      .input('reporting_manager', sql.NVarChar(255), reporting_manager)
      .execute('dbo.USP_ADD_USER_DETAILS');

    const responseMessage = result.recordset[0].result;

    res.status(200).json({
      success: true,
      message: responseMessage
    });

  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  } finally {
    sql.close(); 
  }
    
};

// exports.GetUserByCompany = async (req, res, next) => {
//   // let token = null;
//   // let userDetails = null;

//   // if (!req.headers.authorization) {
//   //   return res.status(401).json({
//   //     success: true,
//   //     message: "Token not present",
//   //   });
//   // }

//   // token = req.headers.authorization.split(" ")[1];

//   try {
//    // userDetails = jwt.verify(token, process.env.SECRET_KEY);
//   } catch (error) {  // let token = null;
//     // let userDetails = null;
  
//     // if (!req.headers.authorization) {
//     //   return res.status(401).json({
//     //     success: true,
//     //     message: "Token not present",
//     //   });
//     // }
  
//     // token = req.headers.authorization.split(" ")[1];
//     return res.status(401).json({
//       success: true,
//       message: "Invalid token 2",
//     });
//   }
    
   


//   const [rowFindUsername] = await poolPromise.execute(
//     "SELECT ru.ru_id as userId,ru.ru_name AS username,ru.ru_email AS userEmail,ru.ru_designation AS designationId, ru.ru_role_id AS roleId, ru.ru_is_active AS isActive, r.rm_name AS roleName, sdm.dm_name AS designation FROM `sqm_reg_users` ru JOIN `sqm_role_master` r ON ru.ru_role_id = r.rm_id JOIN sqm_designation_master sdm ON dm_id=ru.ru_designation WHERE ru.ru_ref_company_Id = ? AND ru.ru_id != ?",
//     [userDetails.companyId, userDetails.user_id]
//   );

//   return res.status(200).json({
//     message: "User list fetched!",
//     data: rowFindUsername,
//   });
// };

exports.GetUserByCompany = async (req, res, next) => {
  const body = req.body;
  // const userId = body.userId;
  // console.log(body,"body")

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
      // .input('UserId', sql.Int, userId)
      .query(' select * from tbl_user_management');
      
      const rowCount = result.recordset.length;
      // console.log(result,"data from db")
    return res.status(200).json({
      success: true,
      message: "The User Management details have been successfully retrieved.",
      data: result.recordset,
      rowCount: rowCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting User Management details",
      data: err.message,
    });
  }
};

exports.UpdatePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let token = null;
  let userDetails = null;

  if (!req.headers.authorization) {
    return res.status(401).json({
      success: true,
      message: "Token not present",
    });
  }

  token = req.headers.authorization.split(" ")[1];

  try {
    userDetails = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return res.status(401).json({
      success: true,
      message: "Invalid token",
    });
  }

  console.log(userDetails);

  const hashPass = await bcrypt.hashSync(req.body.password, 12);

  await dbConn.execute(
    "UPDATE `sqm_reg_users` SET ru_password=? WHERE ru_id=? AND ru_ref_company_Id=?",
    [hashPass, req.body.userId, userDetails.companyId]
  );

  return res.status(200).json({
    message: "User Password updated!",
  });
};

exports.GetUserInfoByUserId = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let token = null;
  if (!req.headers.authorization) {
    return res.status(401).json({
      success: true,
      message: "Token not present",
    });
  }

  token = req.headers.authorization.split(" ")[1];

  try {
    userDetails = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return res.status(401).json({
      success: true,
      message: "Invalid token",
    });
  }

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

    const result = await pool.request()
    .input("UserId", sql.Int, userId)
    .execute('dbo.USP_WP_GET_USER_INFORMATION');
    
    if (result.recordset.length === 0) {
      return res.status(400).json({
        success: true,
        message: "No user found for the given user-id.",
        data: [],
      });
    }

    return res.status(201).json({
      success: true,
      message: "User information successfully retrived.",
      data: result.recordset[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting User information",
      data: err.message,
    });
  }

  return res.status(200).json({
    message: "User fetched!",
    data: rowFindUser,
  });
};

exports.UpdateUser = async (req, res, next) => {
  let token = null;

  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Token not present",
    });
  }

  token = req.headers.authorization.split(" ")[1];

  const {
    user_id,
    about_user,
    phone_no,
    country,
    user_job,
    physical_adress,
    user_twitter_profile,
    user_facebook_profile,
    user_instagram_profile,
    user_linkedin_profile 
  } = req.body;

  try {
    const pool = await sql.connect(poolPromise);

    // Add timestamp to the profile picture filename
    const profile =
      req.file && req.file.originalname
        ? `${Date.now()}_${req.file.originalname}`  // <-- Timestamp added here
        : null;

    const result = await pool.request()
      .input('us_user_id', sql.Int, user_id)
      .input('ud_about_user', sql.NVarChar(sql.MAX), about_user)
      .input('us_phone_no', sql.BigInt, phone_no)
      .input('ucd_country', sql.NVarChar(100), country)
      .input('ud_user_job', sql.NVarChar(100), user_job)
      .input('physicalAddress', sql.NVarChar(255), physical_adress)
      .input('ud_user_twitter_profile', sql.NVarChar(255), user_twitter_profile)
      .input('ud_user_facebook_profile', sql.NVarChar(255), user_facebook_profile)
      .input('ud_user_instagram_profile', sql.NVarChar(255), user_instagram_profile)
      .input('ud_user_linkedin_profile', sql.NVarChar(255), user_linkedin_profile)
      .input('ud_profile_picture', sql.NVarChar(255), profile)
      .execute('dbo.USP_WP_UPDATE_USER_PROFILE');

    const responseMessage = result.recordset[0].result;

    res.status(200).json({
      success: true,
      message: responseMessage
    });

  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.DeleteUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let token = null;
  let userDetails = null;

  if (!req.headers.authorization) {
    return res.status(401).json({
      success: true,
      message: "Token not present",
    });
  }

  token = req.headers.authorization.split(" ")[1];

  try {
    userDetails = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return res.status(401).json({
      success: true,
      message: "Invalid token",
    });
  }

  try {
    await dbConn.execute(
      "DELETE FROM `sqm_reg_users` WHERE ru_id=? AND ru_ref_company_Id=?",
      [req.body.userId, userDetails.companyId]
    );

    res.status(201).send({
      message: "User has been deleted",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// exports.UpdateSelfPassword = async (req, res, next) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { userId, oldPassword, newPassword } = req.body;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID required" });
//     }

//     if (!oldPassword) {
//       return res.status(400).json({ message: "Old password required" });
//     }

//     if (!newPassword) {
//       return res.status(400).json({ message: "New password required" });
//     }

//     const pool = await sql.connect(poolPromise);

//     // Retrieve the old encrypted password from the database
//     const oldPwdResult = await pool
//       .request()
//       .input("userId", sql.Int, userId)
//       .output("oldPassword", sql.NVarChar(50))
//       .execute("USP_WP_GET_OLD_PWD");

//     const encryptedOldPassword = oldPwdResult.output.oldPassword;
//     console.log(encryptedOldPassword,"old");

//     const secretKey = "XkhZG4fW2t2W"; 
//     const decryptPassword = (encryptedPassword, key) => {
//       const keyutf = CryptoJS.enc.Utf8.parse(key);
//       const iv = CryptoJS.enc.Utf8.parse(key);
//       const decrypted = CryptoJS.AES.decrypt(encryptedPassword, keyutf, { iv: iv });
//       return decrypted.toString(CryptoJS.enc.Utf8);
//     };

//     const decryptedOldPassword = decryptPassword(encryptedOldPassword, secretKey);
//     console.log(decryptedOldPassword,"decold");
//     if (decryptedOldPassword !== oldPassword) {
//       return res.status(400).json({
//         message: "Old password is incorrect. Please try again.",
//       });
//     }

//     // Encrypt the new password
//     const encryptPassword = (password, key) => {
//       const keyutf = CryptoJS.enc.Utf8.parse(key);
//       const iv = CryptoJS.enc.Utf8.parse(key);
//       const encrypted = CryptoJS.AES.encrypt(password, keyutf, { iv: iv });
//       return encrypted.toString();
//     };

//     const encryptedNewPassword = encryptPassword(newPassword, secretKey);

//     // Update the password in the database
//     const updateResult = await pool
//       .request()
//       .input("userId", sql.Int, userId)
//       .input("newPassword", sql.NVarChar(50), encryptedNewPassword)
//       .output("result", sql.Int)
//       .execute("USP_WP_CHECK_OLD_PWD_UPDATE");

//       console.log(updateResult.output.result);
//     const queryResult = updateResult.output.result;
    
//     if (queryResult === 0) {
//       return res.status(400).json({
//         message: "Failed to update the password.",
//       });
//     }

//     res.status(200).json({ message: "Password has been changed successfully." });
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

exports.UpdateSelfPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, oldPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    if (!oldPassword) {
      return res.status(400).json({ message: "Old password required" });
    }

    if (!newPassword) {
      return res.status(400).json({ message: "New password required" });
    }

    const pool = await sql.connect(poolPromise);

    // Retrieve the old encrypted password from the database
    const oldPwdResult = await pool
      .request()
      .input("userId", sql.Int, userId)
      .output("oldPassword", sql.NVarChar(50))
      .execute("USP_WP_GET_OLD_PWD");

    const encryptedOldPassword = oldPwdResult.output.oldPassword;
    console.log(encryptedOldPassword, "old");

    // Decrypt the old password
    const secretKey = "XkhZG4fW2t2W";
    const decryptPassword = (encryptedPassword, key) => {
      const keyutf = CryptoJS.enc.Utf8.parse(key);
      const iv = CryptoJS.enc.Utf8.parse(key);
      const decrypted = CryptoJS.AES.decrypt(encryptedPassword, keyutf, { iv: iv });
      return decrypted.toString(CryptoJS.enc.Utf8);
    };

    const decryptedOldPassword = decryptPassword(encryptedOldPassword, secretKey);
    console.log(decryptedOldPassword, "decold");

    if (decryptedOldPassword !== oldPassword) {
      return res.status(400).json({
        message: "Old password is incorrect. Please try again.",
      });
    }

    // Encrypt the new password
    const encryptPassword = (password, key) => {
      const keyutf = CryptoJS.enc.Utf8.parse(key);
      const iv = CryptoJS.enc.Utf8.parse(key);
      const encrypted = CryptoJS.AES.encrypt(password, keyutf, { iv: iv });
      return encrypted.toString();
    };

    const encryptedNewPassword = encryptPassword(newPassword, secretKey);

    // Update the password in the database
    const updateResult = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("newPassword", sql.NVarChar(50), encryptedNewPassword)
      .output("result", sql.Int)
      .execute("USP_WP_CHECK_OLD_PWD_UPDATE");

    const queryResult = updateResult.output.result;
    console.log(queryResult, "result");

    if (queryResult === 0) {
      return res.status(400).json({
        message: "Failed to update the password.",
      });
    }

    res.status(200).json({ message: "Password has been changed successfully." });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const sendMailVerificationMail = async (to, description, userId, name) => {
  try {
    const currentUrl = process.env.URL;
    const uniqueString = uuidv4() + userId;

    console.log(currentUrl);

    bcrypt.hash(uniqueString, 10, async function (err, hashedString) {
      await dbConn.execute(
        "INSERT INTO `sqm_user_verification`(`user_verification_refUserId`,`user_verification_uniqueString`,`user_verification_expiresIn`) VALUES (?,?,?)",
        [userId, hashedString, Date.now() + 21600000]
      );
    });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: to, // Change to your recipient
      from: "sqm.client.master@gmail.com", // Change to your verified sender
      subject: `${description}`,
      text: `${description}`,
      html: `<strong>
      Dear ${name}, </strong>
      <br>
      <p>Thank you for registering with us. To complete your registration, please click on the link below to verify your email address:
      <br>
      <a href="${currentUrl}user/verify/${userId}/${uniqueString}">here</a> to proceed</p>
        <br>
        Thank you,<br>
        Send Quick Mail
      `,
    };

    await sgMail.send(msg);
  } catch (error) {
    throw error;
  }
};

// exports.GetProfileInfoByUserId = async (req, res, next) => {
//   const { user_id } = req.body;

//   try {
//     const pool = await sql.connect(poolPromise);
//     const result = await pool.request()
//       .input("UserID", sql.Int, user_id)
//       .execute('dbo.USP_WP_GET_USER_DETAILS');

//     if (result.recordset.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No user found for the given user-id.",
//         data: [],
//       });
//     } else {
//       const imageFileNames = result.recordset[0].ProfilePicture;
//       const protocol = "https";
//       const basePath = `${protocol}://${req.get("host")}/uploads`;
//       const imagePaths = imageFileNames
//         ? imageFileNames
//             .split(", ")
//             .map((fileName) => `${basePath}/${fileName.trim()}`)
//         : [];
//       result.recordset[0].ProfilePicture = imagePaths.map(addTimestampToFileName); // Apply timestamp to each file name

//       return res.status(200).json({
//         success: true,
//         message: "Profile information successfully retrieved.",
//         data: result.recordset[0],
//       });
//     }

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       message: "Error while getting user information.",
//       data: err.message,
//     });
//   }
// };

exports.GetProfileInfoByUserId = async (req, res, next) => {
  const { user_id } = req.body;

  try {
    const pool = await sql.connect(poolPromise);
    const result = await pool.request()
      .input("UserID", sql.Int, user_id)
      .execute('dbo.USP_WP_GET_USER_DETAILS');

    if (result.recordset.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No user found for the given user-id.",
        data: [],
      });
    } else {
      const imageFileNames = result.recordset[0].ProfilePicture;
      const protocol = "https";
      const basePath = `${protocol}://${req.get("host")}/uploads`;
      const imagePaths = imageFileNames
        ? imageFileNames
            .split(", ")
            .map((fileName) => `${basePath}/${fileName.trim()}`)
        : [];
      result.recordset[0].ProfilePicture = imagePaths.map(addTimestampToFileName); // Apply timestamp to each file name

      return res.status(200).json({
        success: true,
        message: "Profile information successfully retrieved.",
        data: result.recordset[0],
      });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error while getting user information.",
      data: err.message,
    });
  }
};



// Function to append timestamp to each file name
function addTimestampToFileName(fileName) {
  const timestamp = Date.now(); // Get current timestamp
  const extension = fileName.split('.').pop(); // Extract file extension
  const fileNameWithTimestamp = `${uuidv4()}-${timestamp}.${extension}`; // Generate unique filename
  return fileNameWithTimestamp;
}

