const MenuItem = require("../../models/dining/menuItemmodel");
const slugify = require("slugify");
const { AppError } = require("../../middleware/errorHandler");

class MenuService {
  static async create(data) {
    const slug = slugify(data.name, { lower: true, strict: true });

    const exists = await MenuItem.findOne({ slug });
    if (exists) throw new AppError("Menu item already exists", 400);

    return MenuItem.create({ ...data, slug });
  }
  static async getAll(filters = {}) {
    return MenuItem.find({
      ...filters,
      isDeleted: false,
    })
      .populate("category")
      .sort({ createdAt: -1 });
  }

  static async getById(id) {
    const item = await MenuItem.findOne({
      _id: id,
      isDeleted: false,
    }).populate("category");
    if (!item) throw new AppError("Menu item not found", 404);
    return item;
  }

  static async update(id, data) {
    if (data.name) {
      data.slug = slugify(data.name, { lower: true, strict: true });
    }

    const item = await MenuItem.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!item) throw new AppError("Menu item not found", 404);
    return item;
  }

  static async toggleAvailability(menuId, isAvailable, reason = "MANUAL") {
    const item = await MenuItem.findById(menuId);

    if (!item) {
      throw new AppError("Menu item not found", 404);
    }

    item.isAvailable = isAvailable;
    item.availabilityReason = reason;

    await item.save();

    return item;
  }

  static async delete(id) {
    const item = await MenuItem.findById(id);

    if (!item || item.isDeleted) {
      throw new AppError("Menu item not found", 404);
    }

    item.isDeleted = true;
    item.isAvailable = false;

    await item.save();

    return item;
  }
  static async restore(menuId) {
    const item = await MenuItem.findById(menuId);

    if (!item) {
      throw new AppError("Menu item not found", 404);
    }

    item.isDeleted = false;

    await item.save();

    return item;
  }

  static async bulkUpdate(payload) {
    const { ids, action, value, isAvailable, categoryId } = payload;

    if (!ids || !ids.length) {
      throw new AppError("No menu items selected", 400);
    }

    const items = await MenuItem.find({
      _id: { $in: ids },
      isDeleted: false,
    });

    if (!items.length) {
      throw new AppError("Menu items not found", 404);
    }

    if (action === "increasePrice") {
      for (const item of items) {
        item.basePrice += (item.basePrice * value) / 100;
        await item.save();
      }
    } else if (action === "decreasePrice") {
      for (const item of items) {
        item.basePrice -= (item.basePrice * value) / 100;
        if (item.basePrice < 0) item.basePrice = 0;
        await item.save();
      }
    } else if (action === "toggleAvailability") {
      await MenuItem.updateMany(
        { _id: { $in: ids } },
        {
          isAvailable,
          availabilityReason: "MANUAL",
        },
      );
    } else if (action === "changeCategory") {
      await MenuItem.updateMany(
        { _id: { $in: ids } },
        { category: categoryId },
      );
    } else {
      throw new AppError("Invalid bulk action", 400);
    }

    return { updatedCount: ids.length };
  }
}

module.exports = MenuService;
