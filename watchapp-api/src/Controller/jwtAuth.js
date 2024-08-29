const jwt = require("jsonwebtoken");


exports.verifyJwt = (req)=>{
  let token = null;
  let userDetails = null;

  if (!req.headers.authorization) {
    throw {message:'Authorization header not present!',code:400}
  }

  token = req.headers.authorization.split(" ")[1];

  try{
    userDetails = jwt.verify(token, process.env.SECRET_KEY);

    return userDetails
  }catch(error){
    throw error
  }
}

