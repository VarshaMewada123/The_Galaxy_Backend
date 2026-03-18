const Offer = require("../../models/dining/offer.model");
const { AppError } = require("../../middleware/errorHandler");

class OfferService {
  static async create(data) {
    return Offer.create(data);
  }

  static async getActiveOffers() {
    const now = new Date();

    return Offer.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });
  }

  static async getAll() {
    return Offer.find().sort({ createdAt: -1 });
  }

  static async update(id, data) {
    const offer = await Offer.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!offer) {
      throw new AppError("Offer not found", 404);
    }

    return offer;
  }

  static async delete(id) {
    const offer = await Offer.findByIdAndDelete(id);

    if (!offer) {
      throw new AppError("Offer not found", 404);
    }

    return offer;
  }
}

module.exports = OfferService;
