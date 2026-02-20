const OfferService = require("../../services/dining/offer.service");

class OfferController {
  /* ===============================
     CREATE OFFER
  =============================== */
  static async create(req, res, next) {
    try {
      const offer = await OfferService.create(req.body);

      res.status(201).json({
        success: true,
        message: "Offer created successfully",
        data: offer,
      });
    } catch (err) {
      next(err);
    }
  }

  /* ===============================
     GET ALL OFFERS (ADMIN)
  =============================== */
  static async getAll(req, res, next) {
    try {
      const offers = await OfferService.getAll();

      res.json({
        success: true,
        data: offers,
      });
    } catch (err) {
      next(err);
    }
  }

  /* ===============================
     GET ACTIVE OFFERS
  =============================== */
  static async getActive(req, res, next) {
    try {
      const offers = await OfferService.getActiveOffers();

      res.json({
        success: true,
        data: offers,
      });
    } catch (err) {
      next(err);
    }
  }

  /* ===============================
     UPDATE OFFER
  =============================== */
  static async update(req, res, next) {
    try {
      const offer = await OfferService.update(req.params.id, req.body);

      res.json({
        success: true,
        message: "Offer updated successfully",
        data: offer,
      });
    } catch (err) {
      next(err);
    }
  }

  /* ===============================
     DELETE OFFER
  =============================== */
  static async delete(req, res, next) {
    try {
      await OfferService.delete(req.params.id);

      res.json({
        success: true,
        message: "Offer deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OfferController;
