const { createOrderService } = require("../services/order.service");

const createOrder = async (req, res, next) => {
  try {
    const order = await createOrderService(req.user.id, req.body);

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrder,
};