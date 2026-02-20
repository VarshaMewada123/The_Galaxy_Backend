const OrderService = require("../../services/dining/order.service");

class OrderController {
  // static async create(req, res, next) {
  //   try {
  //     const order = await OrderService.createOrder(
  //       // req.user._id,
  //       req.admin._id,
  //       req.body.items
  //     );

  //     res.status(201).json({
  //       success: true,
  //       message: "Order placed successfully",
  //       data: order,
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // }
  static async create(req, res, next) {
  try {
    const order = await OrderService.createOrder(
      req.admin._id,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (err) {
    next(err);
  }
}

  static async getAll(req, res, next) {
  try {
    const orders = await OrderService.getAllOrders(req.query);

    res.json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
}

static async getById(req, res, next) {
  try {
    const order = await OrderService.getOrderById(req.params.id);

    res.json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
}

static async updateStatus(req, res, next) {
  try {
    const order = await OrderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (err) {
    next(err);
  }
}

static async cancel(req, res, next) {
  try {
    const order = await OrderService.cancelOrder(req.params.id);

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (err) {
    next(err);
  }
}

}

module.exports = OrderController;
