import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";

// @desc  Create product (also creates an inventory record at 0 qty)
// @route POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create({ ...req.body, createdBy: req.user._id });
    await Inventory.create({ product: product._id, quantity: 0 });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc  Get products with search, filtering, pagination
// @route GET /api/products?search=&category=&page=&limit=
export const getProducts = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 10 } = req.query;

    const query = {};
    if (search) query.$text = { $search: search };
    if (category) query.category = category;

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single product
// @route GET /api/products/:id
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc  Update product
// @route PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc  Delete product
// @route DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await Inventory.findOneAndDelete({ product: product._id });
    res.json({ message: "Product removed" });
  } catch (error) {
    next(error);
  }
};
