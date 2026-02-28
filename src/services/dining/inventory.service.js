const Inventory = require("../../models/dining/inventory.model");
const MenuItem = require("../../models/dining/menuItemmodel");
const { AppError } = require("../../middleware/errorHandler");

class InventoryService {
  static async getAll() {
    return Inventory.find()
      .populate("menuItem", "name basePrice isAvailable")
      .sort({ createdAt: -1 });
  }

  static async getLowStock() {
    return Inventory.find({
      $expr: { $lte: ["$currentStock", "$reorderLevel"] },
    }).populate("menuItem", "name basePrice isAvailable");
  }

  static async getByMenuItem(menuItemId) {
    const inventory = await Inventory.findOne({
      menuItem: menuItemId,
    }).populate("menuItem", "name basePrice isAvailable");

    if (!inventory) {
      throw new AppError("Inventory not found", 404);
    }

    return inventory;
  }

  static async restock(menuItemId, quantity) {
    const inventory = await Inventory.findOne({
      menuItem: menuItemId,
    });

    if (!inventory) {
      throw new AppError("Inventory not found", 404);
    }

    inventory.currentStock += quantity;

    if (inventory.currentStock > inventory.reorderLevel) {
      inventory.isLowStock = false;
    }

    await inventory.save();

    const menuItem = await MenuItem.findById(menuItemId);

    if (menuItem && !menuItem.isAvailable && inventory.currentStock > 0) {
      menuItem.isAvailable = true;
      await menuItem.save();
    }

    return inventory;
  }
}

module.exports = InventoryService;
