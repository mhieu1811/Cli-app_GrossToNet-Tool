const express = require("express");
const controller = require("../controllers/index");
var router = express.Router();

router.get("/", controller.view);
router.post("/", controller.grossToNet);
module.exports = router;
