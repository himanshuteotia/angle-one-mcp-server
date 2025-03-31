import { Router } from "express";
import { StockController } from "../controllers/stockController";

const router = Router();
const stockController = new StockController();

router.get("/:symbol", stockController.getStockData.bind(stockController));

export default router;
