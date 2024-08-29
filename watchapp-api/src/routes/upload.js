const multer = require("multer");
const { storage } = require("./routes.js");

const upload = multer({ storage: storage });
