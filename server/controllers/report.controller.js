import Product from "../models/Product.js";
import Inventory from "../models/Inventory.js";
import Order from "../models/Order.js";

// @desc  Aggregated stats for the dashboard
// @route GET /api/reports/summary
export const getDashboardSummary = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = (await Product.distinct("category")).length;
    const totalOrders = await Order.countDocuments();

    const inventoryDocs = await Inventory.countDocuments();

    // Sold quantity per product (sum across all order items)
    const soldAgg = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          sold: { $sum: "$items.quantity" },
        },
      },
    ]);
    const soldMap = {};
    soldAgg.forEach((s) => {
      soldMap[s._id.toString()] = s.sold;
    });

    // Remaining quantity per product (from inventory)
    const inventory = await Inventory.find().populate("product", "name category");

    const salesReport = inventory
      .filter((inv) => inv.product)
      .map((inv) => ({
        name: inv.product.name,
        remaining: inv.quantity,
        sold: soldMap[inv.product._id.toString()] || 0,
      }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    // Category-wise revenue %
    const orders = await Order.find().populate("items.product", "category");
    const categoryRevenue = {};
    let totalRevenue = 0;

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const category = item.product?.category || "Uncategorized";
        const revenue = item.price * item.quantity;
        categoryRevenue[category] = (categoryRevenue[category] || 0) + revenue;
        totalRevenue += revenue;
      });
    });

    const categoryWiseSales = Object.entries(categoryRevenue).map(([category, revenue]) => ({
      category,
      revenue,
      percentage: totalRevenue > 0 ? Number(((revenue / totalRevenue) * 100).toFixed(1)) : 0,
    }));

    // Recent orders (purchase details table)
    const recentOrders = await Order.find()
      .populate("items.product", "name category price")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    const purchaseDetails = [];
    recentOrders.forEach((order) => {
      order.items.forEach((item) => {
        purchaseDetails.push({
          orderNumber: order.orderNumber,
          category: item.product?.category || "-",
          product: item.product?.name || "-",
          quantity: item.quantity,
          price: item.price,
        });
      });
    });

    res.json({
      totalProducts,
      totalCategories,
      totalOrders,
      totalInventoryRecords: inventoryDocs,
      salesReport,
      categoryWiseSales,
      purchaseDetails: purchaseDetails.slice(0, 10),
    });
  } catch (error) {
    next(error);
  }
};