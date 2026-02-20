// const express = require("express");
// const router = express.Router();

// const adminAuth = require("../middleware/adminAuth");
// const validate = require("../middleware/validate");
// const upload = require("../middleware/upload");
// const AnalyticsController = require("../controllers/admin/analytics.controller");

// /* ===============================
//    CONTROLLERS
// ================================= */
// const DiningCategoryController = require("../controllers/admin/diningCategory.controller");
// const MenuController = require("../controllers/admin/menu.controller");
// const OfferController = require("../controllers/admin/offer.controller");
// const OrderController = require("../controllers/admin/order.controller");
// const InventoryController = require("../controllers/admin/inventory.controller");

// /* ===============================
//    VALIDATIONS
// ================================= */
// const {
//   createCategoryValidation,
//   updateCategoryValidation,
// } = require("../validations/dining/category.validation");

// const {
//   createMenuValidation,
//   updateMenuValidation,
// } = require("../validations/dining/menu.validation");

// const {
//   createOfferValidation,
//   updateOfferValidation,
// } = require("../validations/dining/offer.validation");

// const {
//   createOrderValidation,
// } = require("../validations/dining/order.validation");


// router.use(adminAuth);

// /* ===============================
//    CATEGORY ROUTES
// ================================= */
// router.post(
//   "/categories",
//   createCategoryValidation,
//   validate,
//   DiningCategoryController.create
// );


// router.patch(
//   "/categories/:id",
//   updateCategoryValidation,
//   validate,
//   DiningCategoryController.update
// );

// router.get(
//   "/categories",
//   DiningCategoryController.getAll
// );


// router.get(
//   "/categories/:id",
//   DiningCategoryController.getById
// );

// router.delete(
//   "/categories/:id",
//   DiningCategoryController.delete
// );

// module.exports = router;
// /* ===============================
//    MENU ROUTES
// ================================= */

// router.post(
//   "/menu",
//   upload.array("images", 5),
//   createMenuValidation,
//   validate,
//   MenuController.create
// );
// router.patch(
//   "/menu/bulk",
//   MenuController.bulkUpdate
// );

// /* ⭐ SPECIFIC ROUTES FIRST */
// router.patch(
//   "/menu/:id/availability",
//   MenuController.toggleAvailability
// );

// router.patch(
//   "/menu/:id/restore",
//   MenuController.restore
// );

// /* NORMAL UPDATE */
// router.patch(
//   "/menu/:id",
//   upload.array("images", 5),
//   updateMenuValidation,
//   validate,
//   MenuController.update
// );

// /* GET ROUTES */
// router.get("/menu", MenuController.getAll);
// router.get("/menu/:id", MenuController.getById);

// /* DELETE (SOFT DELETE) */
// router.delete("/menu/:id", MenuController.delete);

// /* ===============================
//    OFFER ROUTES
// ================================= */
// router.get("/offers", OfferController.getAll);

// router.get("/offers/active", OfferController.getActive);

// router.post(
//   "/offers",
//   createOfferValidation,
//   validate,
//   OfferController.create
// );

// router.patch(
//   "/offers/:id",
//   updateOfferValidation,
//   validate,
//   OfferController.update
// );

// router.delete("/offers/:id", OfferController.delete);

// /* ===============================
//    ORDER ROUTES
// ================================= */
// router.post(
//   "/orders",
//   createOrderValidation,
//   validate,
//   OrderController.create
// );

// router.get("/orders", OrderController.getAll);

// router.get("/orders/:id", OrderController.getById);

// router.patch("/orders/:id/status", OrderController.updateStatus);

// router.patch("/orders/:id/cancel", OrderController.cancel);

// /* ===============================
//    INVENTORY ROUTES
// ================================= */
// router.get("/inventory", InventoryController.getAll);

// router.get("/inventory/low-stock", InventoryController.getLowStock);

// router.get(
//   "/inventory/:menuItemId",
//   InventoryController.getByMenuItem
// );

// router.patch(
//   "/inventory/:menuItemId/restock",
//   InventoryController.restock
// );

// /* ===============================
//    ANALYTICS ROUTES
// ================================= */
// router.get(
//   "/analytics/summary",
//   AnalyticsController.getSummary
// );

// router.get(
//   "/analytics/top-items",
//   AnalyticsController.getTopItems
// );

// router.get(
//   "/analytics/revenue",
//   AnalyticsController.getRevenueByDateRange
// );

// router.get(
//   "/analytics/revenue-by-category",
//   AnalyticsController.getRevenueByCategory
// );

// router.get(
//   "/analytics/monthly-revenue",
//   AnalyticsController.getMonthlyRevenue
// );

// router.get(
//   "/analytics/hourly-sales",
//   AnalyticsController.getHourlySales
// );



// module.exports = router;


const express = require("express");
const router = express.Router();

/* ===============================
   MIDDLEWARES
================================= */
const adminAuth = require("../middleware/adminAuth");
const validate = require("../middleware/validate");
const upload = require("../middleware/upload");

/* ===============================
   CONTROLLERS
================================= */
const AnalyticsController = require("../controllers/admin/analytics.controller");
const DiningCategoryController = require("../controllers/admin/diningCategory.controller");
const MenuController = require("../controllers/admin/menu.controller");
const OfferController = require("../controllers/admin/offer.controller");
const OrderController = require("../controllers/admin/order.controller");
const InventoryController = require("../controllers/admin/inventory.controller");

/* ===============================
   VALIDATIONS
================================= */
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

/* ===============================
   GLOBAL ADMIN PROTECTION
================================= */
router.use(adminAuth);





/* =========================================================
   CATEGORY ROUTES
========================================================= */

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

/* SOFT DELETE CATEGORY */
router.delete(
  "/categories/:id",
  DiningCategoryController.delete
);





/* =========================================================
   MENU ROUTES
========================================================= */

router.post(
  "/menu",
  upload.array("images", 5),
  createMenuValidation,
  validate,
  MenuController.create
);

/* BULK UPDATE */
router.patch("/menu/bulk", MenuController.bulkUpdate);

/* SPECIFIC ROUTES FIRST */
router.patch(
  "/menu/:id/availability",
  MenuController.toggleAvailability
);

router.patch(
  "/menu/:id/restore",
  MenuController.restore
);

/* NORMAL UPDATE */
router.patch(
  "/menu/:id",
  upload.array("images", 5),
  updateMenuValidation,
  validate,
  MenuController.update
);

/* GET ROUTES */
router.get("/menu", MenuController.getAll);
router.get("/menu/:id", MenuController.getById);

/* SOFT DELETE */
router.delete("/menu/:id", MenuController.delete);





/* =========================================================
   OFFER ROUTES
========================================================= */

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





/* =========================================================
   ORDER ROUTES
========================================================= */

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





/* =========================================================
   INVENTORY ROUTES
========================================================= */

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





/* =========================================================
   ANALYTICS ROUTES
========================================================= */

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





/* =========================================================
   EXPORT ROUTER (ONLY ONCE — IMPORTANT)
========================================================= */
module.exports = router;
