const router = require("express").Router();
const controller = require("../../controllers/dailyRoster.controller");

// create / update roster
router.post("/", controller.upsertRoster);

// get roster by date
router.get("/", controller.getRosterByDate);

// calendar history
router.get("/range", controller.getRosterRange);

module.exports = router;