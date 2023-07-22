const express = require("express");
const router = express.Router();
const { showTrains } = require("../controllers/showTrains.js");

router.route("/trains").get(showTrains);

module.exports = router;
