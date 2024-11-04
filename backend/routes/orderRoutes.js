import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import { calcualteTotalSalesByDate, calculateTotalSales, countTotalOrders, createOrder, findOrderById, getAllOrders, getUserOrders, markOrderAsDelivered } from "../controllers/orderController.js";
import { authorizeAdmin } from "../middlewares/authorizeAdmin.js";
const router = express.Router();

router.post('/', authenticate, createOrder);
router.get("/", authenticate, authorizeAdmin, getAllOrders);
router.get("/mine", authenticate, getUserOrders);
router.get("/total-order", countTotalOrders)
router.get('/total-sales', calculateTotalSales)
router.get('/total-sales-by-date', calcualteTotalSalesByDate)
router.get("/:id", authenticate, findOrderById)
router.put("/:id/pay", authenticate, markOrderAsDelivered)
router.put("/:id/deliver", authenticate, authorizeAdmin, markOrderAsDelivered)


export default router;