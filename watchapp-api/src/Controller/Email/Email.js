// const dbConn = require('../../../config/db.config').promise();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require("express-validator");
const {verifyJwt} = require('../jwtAuth')



exports.GetTemplates = async (req, res, next) => {

  try {
    const userDetails = verifyJwt(req);
    console.log(userDetails)

    const [roleRow] = await dbConn.execute(
      "SELECT tmp.tem_id AS templateId ,tmp.tem_name as templateName,tmp.raw_html AS html, ru.ru_name AS name, tmp.tem_updated_at AS updatedAt from sqm_template tmp JOIN sqm_reg_users ru ON tmp.tem_updated_by=ru.ru_id WHERE tem_company_id=?",
      [userDetails.companyId]
    );

    if (roleRow.length == 0) {
      return res.status(400).send({
        message: "No Template Found!",
      });
    }
    
      return res.status(200).send({
        message: "Template Fetched!",
        data: roleRow,
      });

  } catch (err) {
    console.log("err...", err);
    return res.status(500).send({
      message: err.message
    });
  }
};



exports.GetTemplateById = async (req, res, next) => {

  try {
    const userDetails = verifyJwt(req);

    const [roleRow] = await dbConn.execute(
      "SELECT tem_id AS templateId ,tem_name as templateName,raw_html AS html from sqm_template WHERE tem_company_id=? and tem_id=?",
      [userDetails.companyId,req.body.templateId]
    );

    if (roleRow.length == 0) {
      return res.status(400).send({
        message: "No Template Found!",
      });
    }
    
      return res.status(200).send({
        message: "Template Fetched!",
        data: roleRow,
      });

  } catch (err) {
    console.log("err...", err);
    return res.status(500).send({
      message: err.message
    });
  }
};



exports.CreateTemplate = async (req, res, next) => {
  try {

    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Required fields missing!' });
  }

  const userDetails = verifyJwt(req);

  const [roleRow] = await dbConn.execute(
    `INSERT INTO sqm_template (tem_name, raw_html, tem_company_id,tem_created_by,tem_updated_by)
     SELECT ?, ?, ?, ?, ?
     FROM dual
     WHERE NOT EXISTS (
       SELECT 1
       FROM sqm_template
       WHERE tem_name = ? AND tem_company_id = ?
     )`,
    [req.body.templateName,req.body.html, userDetails.companyId, userDetails.user_id, userDetails.user_id, req.body.templateName, userDetails.companyId]
  );
    
  if (roleRow.affectedRows == 0) {
    return res.status(400).send({
      message: "Template with same name already exists!!",
    });
  }
    
  return res.status(200).send({
    message: "Template Added Successfully!"
  });

  } catch (err) {
    console.log("err...", err);
    return res.status(500).send({
      success: true,
      error: false,
      message: err.message
    });
  }
};



exports.CloneTemplate = async (req, res, next) => {
  try {

    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Required fields missing!' });
  }

  const userDetails = verifyJwt(req);

  const [existingTemplate] = await dbConn.execute(
    "SELECT tem_id AS templateId ,tem_name as templateName,raw_html AS html from sqm_template WHERE tem_company_id=? and tem_id=?",
    [userDetails.companyId,req.body.templateId]
  );

  if (existingTemplate.length == 0) {
    return res.status(400).send({
      message: "No Template Found!",
    });
  }

  const template = existingTemplate[0];

  console.log(template)

  const [roleRow] = await dbConn.execute(
    `INSERT INTO sqm_template (tem_name, raw_html, tem_company_id,tem_created_by,tem_updated_by)
     SELECT ?, ?, ?, ?, ?
     FROM dual
     WHERE NOT EXISTS (
       SELECT 1
       FROM sqm_template
       WHERE tem_name = ? AND tem_company_id = ?
     )`,
    [template.templateName+"_copy",template.html, userDetails.companyId, userDetails.user_id, userDetails.user_id, template.templateName+"_copy", userDetails.companyId]
  );
    
  if (roleRow.affectedRows == 0) {
    return res.status(400).send({
      message: "Template clone already exists!!",
    });
  }
    
  return res.status(200).send({
    message: "Template Cloned Successfully!"
  });

  } catch (err) {
    console.log("err...", err);
    return res.status(500).send({
      success: true,
      error: false,
      message: err.message
    });
  }
};



exports.UpdateTemplate = async (req, res, next) => {
  try {

    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Required fields missing!' });
  }

  const userDetails = verifyJwt(req);

  const [roleRow] = await dbConn.execute(
    `UPDATE sqm_template SET tem_name=?,raw_html=?,tem_updated_by=?,tem_updated_at=NOW() WHERE tem_id=? AND tem_company_id=?`,
    [req.body.templateName,req.body.html,userDetails.user_id,req.body.templateId, userDetails.companyId]
  );
    
  if (roleRow.affectedRows == 0) {
    return res.status(400).send({
      message: "No Such Template Exists!!",
    });
  }
    
  return res.status(200).send({
    message: "Template Updated Successfully!"
  });

  } catch (err) {
    console.log("err...", err);
    return res.status(500).send({
      message: err.message
    });
  }
};




exports.DeleteTemplate = async (req, res, next) => {
  try {

    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Required fields missing!' });
  }

  const userDetails = verifyJwt(req);

  const [roleRow] = await dbConn.execute(
    `DELETE FROM sqm_template WHERE tem_id=? AND tem_company_id=?`,
    [req.body.templateId, userDetails.companyId]
  );
    
  if (roleRow.affectedRows == 0) {
    return res.status(400).send({
      message: "No such Template Exists!!",
    });
  }
    
  return res.status(200).send({
    message: "Template Deleted Successfully!"
  });

  } catch (err) {
    console.log("err...", err);
    return res.status(500).send({
      message: err.message
    });
  }
};
