const express = require("express");
const router = express.Router();

const AdminAuth = require("../app/modules/Admin/Routes");

router.get("/", (req, res) => {
  res.send("Hello World");
});

router.use("/admin", AdminAuth);

module.exports = router;
