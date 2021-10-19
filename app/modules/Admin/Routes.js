var express = require("express");
var router = express.Router();
const { signup } = require("./Controller");

router.post("/signup", signup);
module.exports = router;
