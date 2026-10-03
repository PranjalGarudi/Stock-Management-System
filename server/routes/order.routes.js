import express from "express";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getOrders)
  .post(protect, authorize("admin", "manager", "staff"), createOrder);

router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, authorize("admin", "manager"), updateOrderStatus);

export default router;
