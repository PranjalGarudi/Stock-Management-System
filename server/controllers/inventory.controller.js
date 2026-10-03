import Inventory from "../models/Inventory.js";
import Product from "../models/Product.js";

// @desc  Get all inventory records (with product info), supports pagination + low stock filter
// @route GET /api/inventory?lowStock=true&page=&limit=
export const getInventory = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, lowStock } = req.query;

    const records = await Inventory.find()
      .populate("product")
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    let filtered = records;
    if (lowStock === "true") {
      filtered = records.filter(
        (r) => r.product && r.quantity <= r.product.lowStockThreshold
      );
    }

    const total = await Inventory.countDocuments();

    res.json({
      inventory: filtered,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get low-stock items
// @route GET /api/inventory/low-stock
export const getLowStock = async (req, res, next) => {
  try {
    const records = await Inventory.find().populate("product");
    const lowStock = records.filter(
      (r) => r.product && r.quantity <= r.product.lowStockThreshold
    );
    res.json(lowStock);
  } catch (error) {
    next(error);
  }
};

// @desc  Update stock quantity (restock or adjust)
// @route PUT /api/inventory/:productId
export const updateStock = async (req, res, next) => {
  try {
    const { quantity, location } = req.body;

    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let inventory = await Inventory.findOne({ product: req.params.productId });
    if (!inventory) {
      inventory = await Inventory.create({ product: req.params.productId, quantity: 0 });
    }

    inventory.quantity = quantity;
    if (location) inventory.location = location;
    inventory.lastRestockedAt = new Date();
    inventory.updatedBy = req.user._id;
    await inventory.save();

    res.json(inventory);
  } catch (error) {
    next(error);
  }
};
