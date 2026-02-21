const router = require("express").Router();
const controller = require("../../controllers/public/menu.controller");

router.get("/", controller.getMenuForUsers);

module.exports = router;