const express = require("express");
const router = express.Router();
const adminAuth = require("../../middleware/adminAuth");
const validate = require("../../middleware/validate");
const OfferController = require("../../controllers/admin/offerController");
const { createOfferValidation, updateOfferValidation } = require("../../validations/dining/offer.validation");

// Base path usually defined in server.js (e.g., /api/v1/admin/dining)
router.use(adminAuth);

// Routes for /offers
router.route("/offers")
  .get(OfferController.getAll)
  .post(createOfferValidation, validate, OfferController.create);

// Active offers route
router.get("/offers/active", OfferController.getActive);

// Routes for /offers/:id
router.route("/offers/:id")
  .get(OfferController.getById) // Added getById
  .patch(updateOfferValidation, validate, OfferController.update)
  .delete(OfferController.remove); // ✅ FIXED: Changed .delete to .remove

module.exports = router;