const express = require("express");
const router = express.Router();

const adminAuth = require("../middleware/adminAuth");
const validate = require("../middleware/validate");
const upload = require("../middleware/upload");

const AnalyticsController = require("../controllers/admin/analytics.controller");
const DiningCategoryController = require("../controllers/admin/diningCategory.controller");
const MenuController = require("../controllers/admin/menu.controller");
const OfferController = require("../controllers/admin/offer.controller");
const OrderController = require("../controllers/admin/order.controller");
const InventoryController = require("../controllers/admin/inventory.controller");
const controller = require("../controllers/admin/dailyRoster.controller");
const {
  createCategoryValidation,
  updateCategoryValidation,
} = require("../validations/dining/category.validation");

const {
  createMenuValidation,
  updateMenuValidation,
} = require("../validations/dining/menu.validation");

const {
  createOfferValidation,
  updateOfferValidation,
} = require("../validations/dining/offer.validation");

const {
  createOrderValidation,
} = require("../validations/dining/order.validation");

router.use(adminAuth);

router.post(
  "/categories",
  createCategoryValidation,
  validate,
  DiningCategoryController.create
);

router.patch(
  "/categories/:id",
  updateCategoryValidation,
  validate,
  DiningCategoryController.update
);

router.get("/categories", DiningCategoryController.getAll);

router.get("/categories/:id", DiningCategoryController.getById);

router.delete(
  "/categories/:id",
  DiningCategoryController.delete
);

router.post("/dailyroster", controller.upsertRoster);

 
router.get("/getrosterbydate", controller.getRosterByDate);
 
router.get("/range", controller.getRosterRange);

 

router.post(
  "/menu",
  upload.array("images", 5),
  createMenuValidation,
  validate,
  MenuController.create
);


router.patch("/menu/bulk", MenuController.bulkUpdate);


router.patch(
  "/menu/:id/availability",
  MenuController.toggleAvailability
);

router.patch(
  "/menu/:id/restore",
  MenuController.restore
);

router.patch(
  "/menu/:id",
  upload.array("images", 5),
  updateMenuValidation,
  validate,
  MenuController.update
);

router.get("/menu", MenuController.getAll);
router.get("/menu/:id", MenuController.getById);

router.delete("/menu/:id", MenuController.delete);



router.get("/offers", OfferController.getAll);

router.get("/offers/active", OfferController.getActive);

router.post(
  "/offers",
  createOfferValidation,
  validate,
  OfferController.create
);

router.patch(
  "/offers/:id",
  updateOfferValidation,
  validate,
  OfferController.update
);

router.delete("/offers/:id", OfferController.delete);



router.post(
  "/orders",
  createOrderValidation,
  validate,
  OrderController.create
);

router.get("/orders", OrderController.getAll);

router.get("/orders/:id", OrderController.getById);

router.patch("/orders/:id/status", OrderController.updateStatus);

router.patch("/orders/:id/cancel", OrderController.cancel);

router.get("/inventory", InventoryController.getAll);

router.get("/inventory/low-stock", InventoryController.getLowStock);

router.get(
  "/inventory/:menuItemId",
  InventoryController.getByMenuItem
);

router.patch(
  "/inventory/:menuItemId/restock",
  InventoryController.restock
);

router.get(
  "/analytics/summary",
  AnalyticsController.getSummary
);

router.get(
  "/analytics/top-items",
  AnalyticsController.getTopItems
);

router.get(
  "/analytics/revenue",
  AnalyticsController.getRevenueByDateRange
);

router.get(
  "/analytics/revenue-by-category",
  AnalyticsController.getRevenueByCategory
);

router.get(
  "/analytics/monthly-revenue",
  AnalyticsController.getMonthlyRevenue
);

router.get(
  "/analytics/hourly-sales",
  AnalyticsController.getHourlySales
);

module.exports = router;


