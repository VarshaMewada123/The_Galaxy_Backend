const Inventory = require("../../models/dining/inventory.model");
const MenuItem = require("../../models/dining/menuItem.model");
const { AppError } = require("../../middleware/errorHandler");

class InventoryService {
  /* ===============================
     GET ALL INVENTORY
  =============================== */
  static async getAll() {
    return Inventory.find()
      .populate("menuItem", "name basePrice isAvailable")
      .sort({ createdAt: -1 });
  }

  /* ===============================
     GET LOW STOCK ITEMS
  =============================== */
  static async getLowStock() {
    return Inventory.find({
      $expr: { $lte: ["$currentStock", "$reorderLevel"] },
    }).populate("menuItem", "name basePrice isAvailable");
  }

  /* ===============================
     GET SINGLE INVENTORY
  =============================== */
  static async getByMenuItem(menuItemId) {
    const inventory = await Inventory.findOne({
      menuItem: menuItemId,
    }).populate("menuItem", "name basePrice isAvailable");

    if (!inventory) {
      throw new AppError("Inventory not found", 404);
    }

    return inventory;
  }

  /* ===============================
     RESTOCK
  =============================== */
  static async restock(menuItemId, quantity) {
    const inventory = await Inventory.findOne({
      menuItem: menuItemId,
    });

    if (!inventory) {
      throw new AppError("Inventory not found", 404);
    }

    inventory.currentStock += quantity;

    // Remove low stock flag
    if (inventory.currentStock > inventory.reorderLevel) {
      inventory.isLowStock = false;
    }

    await inventory.save();

    // Re-enable menu item if disabled
    const menuItem = await MenuItem.findById(menuItemId);

    if (menuItem && !menuItem.isAvailable && inventory.currentStock > 0) {
      menuItem.isAvailable = true;
      await menuItem.save();
    }

    return inventory;
  }
  
}

module.exports = InventoryService;
