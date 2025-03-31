import { Request, Response } from "express";
import { StockService } from "../services/stockService";

export class StockController {
  private stockService: StockService;

  constructor() {
    this.stockService = new StockService();
  }

  async getStockData(req: Request, res: Response): Promise<void> {
    try {
      const { symbol } = req.params;
      const { period } = req.query;
      console.log("symbol", symbol, "period", period);
      if (!symbol) {
        res.status(400).json({ error: "Symbol is required" });
        return;
      }

      const result = await this.stockService.getStockData(
        symbol,
        period as string
      );
      res.json(result);
    } catch (error) {
      console.error("Error in getStockData controller:", error);
      res.status(500).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch stock data",
      });
    }
  }
}
