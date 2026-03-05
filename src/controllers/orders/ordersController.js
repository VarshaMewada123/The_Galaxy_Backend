const Order = require("../../models/User/ordersModel");
const MenuItem = require("../../models/dining/menuItemmodel");

exports.createOrder = async (req, res, next) => {
  try {
    console.log("[ORDER] createOrder API called");
    console.log("Authenticated User ID:", req.user?.id);
    console.log("Request Body:", JSON.stringify(req.body, null, 2));

    const { items, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items provided",
      });
    }

    let subtotal = 0;
    const orderItems = [];

    console.log("🛒 Processing", items.length, "items");

    for (const item of items) {
      console.log("Fetching menu item:", item.menuItem);

      const menuItem = await MenuItem.findById(item.menuItem);

      if (!menuItem) {
        console.log("❌ Menu item not found:", item.menuItem);

        return res.status(404).json({
          success: false,
          message: "Menu item not found",
        });
      }

      const price = menuItem.basePrice;
      const total = price * item.quantity;

      subtotal += total;

      console.log(`Item calculation → ${price} x ${item.quantity} = ${total}`);

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: price,
        quantity: item.quantity,
        total: total,
      });
    }

    console.log("Subtotal calculated:", subtotal);

    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    console.log("Tax (5%):", tax);
    console.log("Final Total:", total);

    const orderData = {
      orderNumber: "ORD-" + Date.now(),
      user: req.user.id,
      items: orderItems,
      pricing: {
        subtotal,
        tax,
        total,
      },
      address,
    };

    console.log(
      "Order object prepared:",
      JSON.stringify(orderData, null, 2),
    );

    const order = await Order.create(orderData);

    console.log("✅ Order successfully created with ID:", order._id);

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("ERROR in createOrder:", error);
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    console.log("[ORDER] getMyOrders API called");
    console.log("User requesting orders:", req.user?.id);

    const orders = await Order.find({ user: req.user.id })
      .populate("items.menuItem", "name basePrice images")
      .sort({ createdAt: -1 });

    console.log("Orders fetched:", orders.length);

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("ERROR in getMyOrders:", error);
    next(error);
  }
};
