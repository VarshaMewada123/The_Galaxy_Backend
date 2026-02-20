const mongoose = require("mongoose");
const Order = require("../../models/dining/order.model");
const MenuItem = require("../../models/dining/menuItem.model");
const Inventory = require("../../models/dining/inventory.model");
const { AppError } = require("../../middleware/errorHandler");
const { v4: uuidv4 } = require("uuid");

const PricingService = require("./pricing.service");

class OrderService {

  static async createOrder(userId, orderData) {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        items,
        paymentMethod,
        deliveryType,
        roomNumber,
        tableNumber,
        notes,
      } = orderData;

      let subtotal = 0;
      const orderItems = [];


      for (const item of items) {

        const menuItem = await MenuItem.findById(item.menuItemId).session(session);

        if (!menuItem || !menuItem.isAvailable) {
          throw new AppError("Menu item not available", 400);
        }

        /* ⭐ CENTRAL PRICING ENGINE */
        const pricing = await PricingService.calculatePrice({
          menuItemId: item.menuItemId,
          variantId: item.variantId,
          addonIds: item.addonIds || [],
          quantity: item.quantity,
        });

        subtotal += pricing.subtotal;

        /* ===============================
           INVENTORY CHECK
        =============================== */
        const inventory = await Inventory.findOne({
          menuItem: menuItem._id,
        }).session(session);

        if (!inventory || inventory.currentStock < item.quantity) {
          throw new AppError("Insufficient stock", 400);
        }

        /* deduct stock */
        inventory.currentStock -= item.quantity;

        if (inventory.currentStock <= inventory.reorderLevel) {
          inventory.isLowStock = true;
        }

        if (inventory.currentStock === 0) {
          menuItem.isAvailable = false;
          await menuItem.save({ session });
        }

        await inventory.save({ session });

        /* ===============================
           ORDER SNAPSHOT
        =============================== */
        orderItems.push({
          menuItemId: menuItem._id,
          nameSnapshot: menuItem.name,
          variantSnapshot: pricing.variantSnapshot,
          addonSnapshot: pricing.addonSnapshot,
          priceSnapshot: pricing.unitPrice,
          quantity: item.quantity,
          subtotal: pricing.subtotal,
        });
      }

      /* ===============================
         ORDER LEVEL TAX / DISCOUNT
      =============================== */

      // (pricing engine already applied item discounts)
      const tax = subtotal * 0.05;
      const discount = 0; // future: coupon engine here
      const grandTotal = subtotal + tax - discount;

      /* ===============================
         CREATE ORDER
      =============================== */
      const order = await Order.create(
        [
          {
            orderNumber: uuidv4(),
            user: userId,
            items: orderItems,
            subtotal,
            tax,
            discount,
            grandTotal,
            paymentMethod,
            deliveryType,
            roomNumber,
            tableNumber,
            notes,
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return order[0];

    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /* =====================================================
     GET ALL ORDERS
  ===================================================== */
  static async getAllOrders(query) {

    const filter = {};

    if (query.status) {
      filter.orderStatus = query.status;
    }

    if (query.paymentStatus) {
      filter.paymentStatus = query.paymentStatus;
    }

    return Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });
  }

  /* =====================================================
     GET SINGLE ORDER
  ===================================================== */
  static async getOrderById(orderId) {

    const order = await Order.findById(orderId)
      .populate("user", "name email");

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    return order;
  }

  /* =====================================================
     UPDATE STATUS
  ===================================================== */
  static async updateOrderStatus(orderId, newStatus) {

    const order = await Order.findById(orderId);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    const validTransitions = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["PREPARING", "CANCELLED"],
      PREPARING: ["READY"],
      READY: ["OUT_FOR_DELIVERY"],
      OUT_FOR_DELIVERY: ["DELIVERED"],
      DELIVERED: [],
      CANCELLED: [],
    };

    if (!validTransitions[order.orderStatus].includes(newStatus)) {
      throw new AppError(
        `Cannot change status from ${order.orderStatus} to ${newStatus}`,
        400
      );
    }

    order.orderStatus = newStatus;
    await order.save();

    return order;
  }

  /* =====================================================
     CANCEL ORDER
  ===================================================== */
  static async cancelOrder(orderId) {

    const order = await Order.findById(orderId);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (!["PENDING", "CONFIRMED"].includes(order.orderStatus)) {
      throw new AppError("Order cannot be cancelled at this stage", 400);
    }

    order.orderStatus = "CANCELLED";
    await order.save();

    return order;
  }
}

module.exports = OrderService;
