const express = require("express");
const router = express.Router();
const adminAuth = require("../../middleware/adminAuth");
const AnalyticsController = require("../../controllers/admin/analyticsController");

router.use(adminAuth);

router.get("/analytics/summary", AnalyticsController.getSummary);
router.get("/analytics/top-items", AnalyticsController.getTopItems);
router.get("/analytics/revenue", AnalyticsController.getRevenueByDateRange);
router.get("/analytics/revenue-by-category", AnalyticsController.getRevenueByCategory);
router.get("/analytics/monthly-revenue", AnalyticsController.getMonthlyRevenue);
router.get("/analytics/hourly-sales", AnalyticsController.getHourlySales);

module.exports = router;