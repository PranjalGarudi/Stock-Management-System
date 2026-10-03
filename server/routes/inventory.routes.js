import express from "express";
import {
  getInventory,
  getLowStock,
  updateStock,
} from "../controllers/inventory.controller.js";
import { protect } from "../middleware/auth.js";
import { authorize } from "../middleware/role.js";

const router = express.Router();

router.get("/", protect, getInventory);
router.get("/low-stock", protect, getLowStock);
router.put("/:productId", protect, authorize("admin", "manager", "staff"), updateStock);

export default router;
