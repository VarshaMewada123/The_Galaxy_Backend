const AnalyticsService = require("../../services/dining/analytics.service");

class AnalyticsController {
  static async getSummary(req, res, next) {
    try {
      const data = await AnalyticsService.getSummary();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getTopItems(req, res, next) {
    try {
      const data = await AnalyticsService.getTopItems();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getRevenueByDateRange(req, res, next) {
    try {
      const { start, end } = req.query;
      const data = await AnalyticsService.getRevenueByDateRange(start, end);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getRevenueByCategory(req, res, next) {
    try {
      const data = await AnalyticsService.getRevenueByCategory();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getMonthlyRevenue(req, res, next) {
    try {
      const data = await AnalyticsService.getMonthlyRevenue();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  static async getHourlySales(req, res, next) {
    try {
      const data = await AnalyticsService.getHourlySales();
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AnalyticsController;
