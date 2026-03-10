const Order = require("../../models/User/ordersModel");

exports.getAllOrders = async (req, res, next) => {
  try {

    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.menuItem", "name basePrice images")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    next(error);
  }
};


exports.updateOrderStatus = async (req, res, next) => {
  try {

    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.status = status;

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    next(error);
  }
};


exports.cancelOrder = async (req, res, next) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.status = "cancelled";

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    next(error);
  }
};