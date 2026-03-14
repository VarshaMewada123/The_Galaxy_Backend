const Offer = require("../models/Offer");
const MenuItem = require("../models/dining/menuItemmodel");
const Combo = require("../models/dining/combomodel");

const cloudinary = require("../config/cloudinary");

const { getFinalPrice } = require("../services/price.service");
const uploadToCloudinary = require("../utils/cloudUpload");


// ===============================
// GET MENU ITEMS WITH OFFER
// ===============================
const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find();

    const result = [];

    for (let item of items) {
      const finalPrice = await getFinalPrice(item);

      result.push({
        ...item.toObject(),
        finalPrice,
      });
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// GET COMBOS WITH OFFER
// ===============================
const getCombos = async (req, res) => {
  try {
    const combos = await Combo.find();

    const result = [];

    for (let combo of combos) {
      const finalPrice = await getFinalPrice(combo);

      result.push({
        ...combo.toObject(),
        finalPrice,
      });
    }

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// CREATE OFFER
// ===============================
const createOffer = async (req, res) => {
  try {
    let imageData = {};

    if (req.file) {
      const uploaded = await uploadToCloudinarys(req.file.buffer, "offers");

      imageData = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }

    const offer = await Offer.create({
      ...req.body,
      image: imageData,
    });

    res.status(201).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// GET ALL OFFERS
// ===============================
const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find()
      .populate("items")
      .populate("combos")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: offers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// GET SINGLE OFFER
// ===============================
const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate("items")
      .populate("combos");

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    res.json({
      success: true,
      data: offer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// UPDATE OFFER
// ===============================
const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // If new image uploaded
    if (req.file) {
      // delete old image
      if (offer.image?.public_id) {
        await cloudinary.uploader.destroy(offer.image.public_id);
      }

      const uploaded = await uploadToCloudinary(req.file.buffer, "offers");

      req.body.image = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }

    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      data: updatedOffer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// DELETE OFFER
// ===============================
const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // delete image from cloudinary
    if (offer.image?.public_id) {
      await cloudinary.uploader.destroy(offer.image.public_id);
    }

    await offer.deleteOne();

    res.json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
module.exports = {
  getMenuItems,
  getCombos,
  createOffer,
  getOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
};