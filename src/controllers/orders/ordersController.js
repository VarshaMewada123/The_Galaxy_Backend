const Order = require("../../models/User/ordersModel");
const MenuItem = require("../../models/dining/menuItemmodel");
const DailyRoster = require("../../models/dining/DailyRoster");
const Combo = require("../../models/dining/combomodel");

exports.createOrder = async (req, res, next) => {
  try {
    const { items, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items provided",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      if (item.menuItem) {
        const menuItem = await MenuItem.findById(item.menuItem);

        if (!menuItem) {
          return res.status(404).json({
            success: false,
            message: "Menu item not found",
          });
        }

        const price = menuItem.basePrice;
        const total = price * item.quantity;

        subtotal += total;

        const updatedRoster = await DailyRoster.findOneAndUpdate(
          {
            date: today,
            "items.id": item.menuItem,
            "items.quantity": { $gte: item.quantity },
          },
          {
            $inc: { "items.$.quantity": -item.quantity },
          },
          { new: true },
        );

        if (!updatedRoster) {
          return res.status(400).json({
            success: false,
            message: `${menuItem.name} is out of stock`,
          });
        }

        orderItems.push({
          menuItem: menuItem._id,
          name: menuItem.name,
          price,
          quantity: item.quantity,
          total,
        });
      }

      /* ===== COMBO ===== */

      if (item.combo) {
        const combo = await Combo.findById(item.combo).populate("items.item");

        if (!combo) {
          return res.status(404).json({
            success: false,
            message: "Combo not found",
          });
        }

        const price = combo.price;
        const total = price * item.quantity;

        subtotal += total;

        for (const comboItem of combo.items) {
          const requiredQty = comboItem.quantity * item.quantity;

          const updatedRoster = await DailyRoster.findOneAndUpdate(
            {
              date: today,
              "items.id": comboItem.item._id,
              "items.quantity": { $gte: requiredQty },
            },
            {
              $inc: { "items.$.quantity": -requiredQty },
            },
            { new: true },
          );

          if (!updatedRoster) {
            return res.status(400).json({
              success: false,
              message: `${comboItem.item.name} is out of stock`,
            });
          }
        }

        orderItems.push({
          combo: combo._id,
          name: combo.name,
          price,
          quantity: item.quantity,
          total,
        });
      }
    }

    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    const order = await Order.create({
      orderNumber: "ORD-" + Date.now(),
      user: req.user.id,
      items: orderItems,
      pricing: {
        subtotal,
        tax,
        total,
      },
      address,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.menuItem", "name basePrice images")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.menuItem",
      "name basePrice images",
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    const cancellableStatuses = ["pending", "confirmed"];

    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage",
      });
    }

    if (order.rider) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled because rider is already assigned",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
