import Order from "../models/Order.js";
import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";

// @desc  Create order and deduct stock
// @route POST /api/orders
export const createOrder = async (req, res, next) => {
  try {
    const { items } = req.body; // [{ product, quantity }]

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must have at least one item" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }

      const inventory = await Inventory.findOne({ product: product._id });
      if (!inventory || inventory.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      inventory.quantity -= item.quantity;
      await inventory.save();

      orderItems.push({ product: product._id, quantity: item.quantity, price: product.price });
      totalAmount += product.price * item.quantity;
    }

    const orderNumber = `ORD-${Date.now()}`;

    const order = await Order.create({
      orderNumber,
      items: orderItems,
      totalAmount,
      createdBy: req.user._id,
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc  Get orders with pagination + status filter
// @route GET /api/orders?status=&page=&limit=
export const getOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate("items.product", "name sku price")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single order
// @route GET /api/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc  Update order status
// @route PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    next(error);
  }
};
