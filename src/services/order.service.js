const Order = require("../models/order.model");

const createOrderService = async (userId, data) => {
  const order = await Order.create({
    user: userId,
    ...data,
  });

  return order;
};

module.exports = {
  createOrderService,
};