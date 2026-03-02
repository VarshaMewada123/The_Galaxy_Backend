const MenuService = require("../../services/dining/menu.service");
const uploadToCloudinary = require("../../utils/cloudUpload");

const create = async (req, res, next) => {
  try {
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, "menu_items");
        imageUrls.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }
    const item = await MenuService.create({
      ...req.body,
      images: imageUrls,
      isVeg: req.body.isVeg === "false" ? false : true,
      basePrice: Number(req.body.basePrice),
      preparationTime: Number(req.body.preparationTime || 15),
    });

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

const getAll = async (req, res, next) => {
  try {
    const items = await MenuService.getAll(req.query);
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const item = await MenuService.getById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    let imageUrls = [];
    const updatedData = { ...req.body };

    // New images upload
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, "menu_items");
        imageUrls.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
      updatedData.images = imageUrls;
    }

    // Convert numeric/boolean strings from FormData
    if (req.body.basePrice) updatedData.basePrice = Number(req.body.basePrice);
    if (req.body.isVeg !== undefined)
      updatedData.isVeg = req.body.isVeg === "false" ? false : true;

    const item = await MenuService.update(req.params.id, updatedData);

    res.json({
      success: true,
      message: "Menu updated successfully",
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await MenuService.delete(req.params.id);
    res.json({
      success: true,
      message: "Menu item removed successfully",
    });
  } catch (err) {
    next(err);
  }
};

const restore = async (req, res, next) => {
  try {
    const item = await MenuService.restore(req.params.id);
    res.json({
      success: true,
      message: "Menu restored successfully",
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

const toggleAvailability = async (req, res, next) => {
  try {
    const { isAvailable, reason } = req.body;
    const item = await MenuService.toggleAvailability(
      req.params.id,
      isAvailable,
      reason,
    );
    res.json({ success: true, message: "Availability updated", data: item });
  } catch (err) {
    next(err);
  }
};

const bulkUpdate = async (req, res, next) => {
  try {
    const result = await MenuService.bulkUpdate(req.body);
    res.json({ success: true, message: "Bulk update completed", data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  restore,
  toggleAvailability,
  bulkUpdate,
};
