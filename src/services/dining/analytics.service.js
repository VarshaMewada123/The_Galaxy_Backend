const Order = require("../../models/dining/order.model");

class AnalyticsService {
  static async getSummary() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const ordersToday = await Order.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const totalRevenueToday = ordersToday.reduce(
      (sum, order) => sum + order.grandTotal,
      0,
    );

    const totalOrdersToday = ordersToday.length;

    const pendingOrders = await Order.countDocuments({
      orderStatus: "PENDING",
    });

    const completedOrders = await Order.countDocuments({
      orderStatus: "DELIVERED",
    });

    return {
      totalRevenueToday,
      totalOrdersToday,
      pendingOrders,
      completedOrders,
    };
  }

  static async getTopItems(limit = 5) {
    return Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItemId",
          totalQuantity: { $sum: "$items.quantity" },
          name: { $first: "$items.nameSnapshot" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: limit },
    ]);
  }
  static async getRevenueByDateRange(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    return Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$grandTotal" },
          totalOrders: { $sum: 1 },
        },
      },
    ]);
  }
  static async getRevenueByCategory() {
    return Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "menuitems",
          localField: "items.menuItemId",
          foreignField: "_id",
          as: "menuData",
        },
      },
      { $unwind: "$menuData" },
      {
        $lookup: {
          from: "diningcategories",
          localField: "menuData.category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      { $unwind: "$categoryData" },
      {
        $group: {
          _id: "$categoryData.name",
          totalRevenue: {
            $sum: {
              $multiply: ["$items.quantity", "$items.priceSnapshot"],
            },
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);
  }
  static async getMonthlyRevenue() {
    return Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: { $sum: "$grandTotal" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
  }

  static async getHourlySales() {
    return Order.aggregate([
      {
        $group: {
          _id: { $hour: "$createdAt" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }
}

module.exports = AnalyticsService;
