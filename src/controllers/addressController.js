const mongoose = require("mongoose");
const Address = require("../models/User/address");

exports.addAddress = async (req, res, next) => {
  try {
    console.log("ADD ADDRESS REQUEST");
    console.log("User:", req.user);
    console.log("Body:", req.body);

    const { street, landmark, city, pincode, label, isDefault } = req.body;

    if (isDefault) {
      console.log("Removing previous default address");

      await Address.updateMany(
        { user: req.user.id },
        { $set: { isDefault: false } },
      );
    }

    const address = await Address.create({
      user: req.user.id,
      street,
      landmark,
      // city,
      // pincode,
      label,
      isDefault,
    });

    console.log("Address Created:", address._id);

    res.status(201).json({
      success: true,
      address,
    });
  } catch (err) {
    console.error("ADD ADDRESS ERROR:", err);

    next(err);
  }
};

exports.getAddresses = async (req, res, next) => {
  try {
    console.log("GET ADDRESSES");
    console.log("User:", req.user.id);

    const addresses = await Address.find({
      user: req.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    console.log("Addresses Found:", addresses.length);

    res.status(200).json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (err) {
    console.error("GET ADDRESS ERROR:", err);

    next(err);
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    console.log("DELETE ADDRESS");
    console.log("AddressId:", addressId);
    console.log("User:", req.user.id);

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address id",
      });
    }

    const address = await Address.findOneAndDelete({
      _id: addressId,
      user: req.user.id,
    });

    if (!address) {
      console.log("Address not found for user");

      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    console.log("Address deleted:", addressId);

    res.status(200).json({
      success: true,
      message: "Address removed",
    });
  } catch (err) {
    console.error("DELETE ADDRESS ERROR:", err);

    next(err);
  }
};

exports.updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    console.log("UPDATE ADDRESS");
    console.log("AddressId:", addressId);
    console.log("User:", req.user.id);
    console.log("Body:", req.body);

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address id",
      });
    }

    const address = await Address.findOneAndUpdate(
      {
        _id: addressId,
        user: req.user.id,
      },
      {
        street: req.body.street,
        landmark: req.body.landmark,
        // city: req.body.city,
        // pincode: req.body.pincode,
        label: req.body.label,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!address) {
      console.log("Address not found for update");

      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    console.log("Address updated:", addressId);

    res.status(200).json({
      success: true,
      address,
    });
  } catch (err) {
    console.error("UPDATE ADDRESS ERROR:", err);

    next(err);
  }
};

exports.setDefaultAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    console.log("SET DEFAULT ADDRESS");
    console.log("AddressId:", addressId);
    console.log("User:", req.user.id);

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address id",
      });
    }

    await Address.updateMany(
      { user: req.user.id },
      { $set: { isDefault: false } },
    );

    const address = await Address.findOneAndUpdate(
      {
        _id: addressId,
        user: req.user.id,
      },
      {
        $set: { isDefault: true },
      },
      { new: true },
    );

    if (!address) {
      console.log("Address not found for default");

      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    console.log("Default address set:", addressId);

    res.status(200).json({
      success: true,
      address,
    });
  } catch (err) {
    console.error("SET DEFAULT ADDRESS ERROR:", err);

    next(err);
  }
};
