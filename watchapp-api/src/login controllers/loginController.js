
require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const { poolPromise } = require('../../config/db.config');
const sql = require('mssql');

exports.login = async (req, res, next) => {
	console.log(req.body.Email);
	console.log(req.body.Pas);


	try {
		let pool = await sql.connect(poolPromise);
		let result = await pool.request()
			.input('email', sql.VarChar, req.body.Email)
			.query(
				"SELECT us_user_id AS userId, us_pwd AS pwdHash, us_email AS email FROM tbl_user_signup WHERE us_email=@email AND us_is_active=1"
			);
		let user = result.recordset[0];
		console.log(user, "user");


		// if (!user || !user.userId) {
		//     return res.status(401).send({
		//         message: "Invalid Email address. No User found",
		//         success: false,
		//     });
		// }

		// const passMatch = await bcrypt.compare(req.body.Pas, user.pwdHash);
		// console.log(passMatch,"pass");
		// if (!passMatch) {
		//     return res.status(400).json({
		//         message: "Incorrect password. Please check the passphrase you have entered.",
		//         success: false,
		//     });
		// }

		if (req.body.Pas !== user.pwdHash) {
			return res.status(400).json({
				message: "Incorrect password. Please check the passphrase you have entered.",
				success: false,
			});
		}


		// const theToken = jwt.sign({ user_id: user.userId }, process.env.SECRET_KEY, { expiresIn: '10h' });
		const theToken = jwt.sign({ user_id: user.userId }, process.env.SECRET_KEY, { expiresIn: '10h' });
		return res.json({
			success: true,
			message: "User Login Successfully",
			data: {
				userId: user.userId,
				userEmail: user.email
			},
			token: theToken,
		});
	} catch (err) {
		next(err);
	}
};

