const express = require("express");
const router = express.Router();
const adminAuth = require("../../middleware/adminAuth");
const InventoryController = require("../../controllers/admin/inventoryController");

router.use(adminAuth);

router.get("/inventory", InventoryController.getAll);
router.get("/inventory/low-stock", InventoryController.getLowStock);
router.get("/inventory/:menuItemId", InventoryController.getByMenuItem);
router.patch("/inventory/:menuItemId/restock", InventoryController.restock);

module.exports = router;
