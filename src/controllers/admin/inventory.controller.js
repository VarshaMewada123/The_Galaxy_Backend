const InventoryService = require("../../services/dining/inventory.service");

class InventoryController {
  /* ===============================
     GET ALL
  =============================== */
  static async getAll(req, res, next) {
    try {
      const data = await InventoryService.getAll();

      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /* ===============================
     GET LOW STOCK
  =============================== */
  static async getLowStock(req, res, next) {
    try {
      const data = await InventoryService.getLowStock();

      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /* ===============================
     GET SINGLE
  =============================== */
  static async getByMenuItem(req, res, next) {
    try {
      const data = await InventoryService.getByMenuItem(
        req.params.menuItemId
      );

      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  /* ===============================
     RESTOCK
  =============================== */
  static async restock(req, res, next) {
    try {
      const data = await InventoryService.restock(
        req.params.menuItemId,
        Number(req.body.quantity)
      );

      res.json({
        success: true,
        message: "Stock updated successfully",
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = InventoryController;
