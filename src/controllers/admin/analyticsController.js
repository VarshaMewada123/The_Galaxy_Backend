const AnalyticsService = require("../../services/dining/analytics.service");

const getSummary = async (req, res, next) => {
  try {
    const data = await AnalyticsService.getSummary();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getTopItems = async (req, res, next) => {
  try {
    const data = await AnalyticsService.getTopItems();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getRevenueByDateRange = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const data = await AnalyticsService.getRevenueByDateRange(start, end);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getRevenueByCategory = async (req, res, next) => {
  try {
    const data = await AnalyticsService.getRevenueByCategory();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getMonthlyRevenue = async (req, res, next) => {
  try {
    const data = await AnalyticsService.getMonthlyRevenue();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getHourlySales = async (req, res, next) => {
  try {
    const data = await AnalyticsService.getHourlySales();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSummary,
  getTopItems,
  getRevenueByDateRange,
  getRevenueByCategory,
  getMonthlyRevenue,
  getHourlySales,
};
