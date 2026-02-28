const OfferService = require("../../services/dining/offer.service");

const create = async (req, res, next) => {
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
};

const getAll = async (req, res, next) => {
  try {
    const offers = await OfferService.getAll();
    res.json({
      success: true,
      data: offers,
    });
  } catch (err) {
    next(err);
  }
};


const getById = async (req, res, next) => {
  try {
    const offer = await OfferService.getById(req.params.id);
    res.json({
      success: true,
      data: offer,
    });
  } catch (err) {
    next(err);
  }
};

const getActive = async (req, res, next) => {
  try {
    const offers = await OfferService.getActiveOffers();
    res.json({
      success: true,
      data: offers,
    });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
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
};

const remove = async (req, res, next) => {
  try {
    await OfferService.delete(req.params.id);
    res.json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  getActive,
  update,
  remove, // Exported as 'remove'
};