const express = require("express");
const router = express.Router();
const adminAuth = require("../../middleware/adminAuth");
const validate = require("../../middleware/validate");
const OfferController = require("../../controllers/admin/offerController");
const {
  createOfferValidation,
  updateOfferValidation,
} = require("../../validations/dining/offerValidation");

router.use(adminAuth);
router
  .route("/offers")
  .get(OfferController.getAll)
  .post(createOfferValidation, validate, OfferController.create);

router.get("/offers/active", OfferController.getActive);
router
  .route("/offers/:id")
  .get(OfferController.getById)
  .patch(updateOfferValidation, validate, OfferController.update)
  .delete(OfferController.remove);

module.exports = router;
