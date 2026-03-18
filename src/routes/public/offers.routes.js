const express = require("express");
const router = express.Router();
const multer = require("multer");
const getOffers = require("../../controllers/offerController");
router.get("/", getOffers);
module.exports = router;
