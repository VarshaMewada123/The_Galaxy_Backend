const express = require("express");
const router = express.Router();

// Middlewares
const adminAuth = require("../../middleware/adminAuth");
const validate = require("../../middleware/validate");

// Controller
const addonController = require("../../controllers/admin/addonController");

// Validations (Agar aapne banayi hai, varna ise comment kar sakte hain)
const { createAddonValidation } = require("../../validations/dining/addon.validation");

// Auth Middleware Apply
router.use(adminAuth);

// Menu Addon Routes
router.route("/addons")
  .post(
    createAddonValidation, 
    validate, 
    addonController.create
  );

// Agar aapko baaki routes (getAll, update, delete) bhi chahiye toh wo yahan add honge:
// router.get("/addons", addonController.getAll);
// router.route("/addons/:id")
//   .patch(validate, addonController.update)
//   .delete(addonController.remove);

module.exports = router;