import axios, { AxiosRequestConfig, Method } from "axios";
import moment from "moment";
import { RSI, EMA } from "technicalindicators";
import {
  CandleData,
  TechnicalIndicators,
  AngleOneHistoryParams,
  ExchangeTypes,
  AngleOneHistoryIntervals,
  CustomTimeFormat,
} from "../types";
import { AngleOneAuthentication } from "../angle-one-auth";
import { getCommonHeaders } from "../common-headers";
import { ScripMasterService } from "./scripMasterService";

export class StockService {
  private readonly ANGLE_ONE_BASE_URL = "https://apiconnect.angelbroking.com";
  private readonly DEFAULT_PERIOD_MONTHS = 3;
  private scripMasterService: ScripMasterService;

  constructor() {
    this.scripMasterService = ScripMasterService.getInstance();
  }

  private getHistoryOptions(
    params: AngleOneHistoryParams,
    authToken: string
  ): AxiosRequestConfig {
    const historyData = JSON.stringify(params);
    return {
      method: "POST" as Method,
      url: `${this.ANGLE_ONE_BASE_URL}/rest/secure/angelbroking/historical/v1/getCandleData`,
      headers: {
        "X-PrivateKey": process.env.ANGLE_ONE_PUBLISHER_API_KEY as string,
        Authorization: `Bearer ${authToken}`,
        ...getCommonHeaders(),
      },
      data: historyData,
    };
  }

  private getDataPeriodMonths(): number {
    const periodMonths = parseInt(
      process.env.DATA_PERIOD_MONTHS || String(this.DEFAULT_PERIOD_MONTHS)
    );
    return isNaN(periodMonths) ? this.DEFAULT_PERIOD_MONTHS : periodMonths;
  }

  async getStockData(
    symbol: string,
    period: string = "6"
  ): Promise<{
    historicalData: CandleData[];
    indicators: TechnicalIndicators;
  }> {
    try {
      // Get token from scrip master
      let token = this.scripMasterService.getTokenBySymbol(symbol);
      if (!token) {
        console.log("Symbol not found by symbol");
        const tokenByName = this.scripMasterService.getTokenByName(symbol);
        if (!tokenByName) {
          console.log("Symbol not found by name");
          throw new Error(`Symbol ${symbol} not found in scrip master`);
        }
        token = tokenByName;
      }

      // Get historical data
      const historicalData = await this.getHistoricalData("3045", period);

      // Calculate indicators
      const indicators = this.calculateIndicators(historicalData);

      return {
        historicalData,
        indicators,
      };
    } catch (error) {
      console.error("Error in getStockData:", error);
      throw error;
    }
  }

  async getHistoricalData(
    symbol: string,
    period: string = "6"
  ): Promise<CandleData[]> {
    const angleOneAuth = new AngleOneAuthentication();
    const accessToken = await angleOneAuth.generateToken();

    if (!accessToken) {
      throw new Error("Access token not available");
    }

    const periodMonths = parseInt(period) || this.getDataPeriodMonths();
    const params: AngleOneHistoryParams = {
      exchange: ExchangeTypes.NSE,
      symboltoken: symbol,
      interval: AngleOneHistoryIntervals.ONE_DAY,
      fromdate: moment()
        .subtract(periodMonths, "months")
        .format("YYYY-MM-DD 09:00") as CustomTimeFormat,
      todate: moment().format("YYYY-MM-DD 15:30") as CustomTimeFormat,
    };

    try {
      const options = this.getHistoryOptions(params, accessToken.jwtToken);
      const response = await axios(options);

      return response.data.data.map((candle: any[]) => ({
        timestamp: candle[0],
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4],
        volume: candle[5],
      }));
    } catch (error) {
      console.error(
        "Error fetching historical data:",
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error;
    }
  }

  calculateIndicators(data: CandleData[]): TechnicalIndicators {
    const closes = data.map((candle) => candle.close);

    // RSI
    const rsi = new RSI({ values: closes, period: 14 });

    // EMA
    const ema20 = new EMA({ values: closes, period: 20 });
    const ema50 = new EMA({ values: closes, period: 50 });

    // Can add more indicators here

    return {
      rsi: rsi.getResult(),
      ema20: ema20.getResult(),
      ema50: ema50.getResult(),
    };
  }
}
