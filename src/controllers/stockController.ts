import { Request, Response } from "express";
import { StockService } from "../services/stockService";
import { StockResponse } from "../types";

export class StockController {
  private stockService: StockService;

  constructor() {
    this.stockService = new StockService();
  }

  async getStockData(req: Request, res: Response): Promise<void> {
    try {
      const { symbol } = req.params;
      console.log("Fetching data for symbol:", symbol);

      const historicalData = await this.stockService.getHistoricalData(symbol);
      const indicators = this.stockService.calculateIndicators(historicalData);

      const response: StockResponse = {
        historicalData,
        indicators,
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
