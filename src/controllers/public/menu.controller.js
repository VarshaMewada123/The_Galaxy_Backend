const Menu = require("../../models/dining/menuItem.model"); // apna model name use karna

exports.getMenuForUsers = async (req, res, next) => {
  try {
    const menu = await Menu.find({
      isAvailable: true,      // sirf available items
      isArchived: { $ne: true }
    })
      .populate("category", "name")
      .select(
        "name basePrice images isVeg description preparationTime spiceLevel category"
      )
      .lean();

    res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (err) {
    next(err);
  }
};