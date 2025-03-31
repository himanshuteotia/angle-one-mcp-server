import { AngleOneErrorCodes } from "./error-codes";

export interface CandleData {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BollingerBandsData {
  upperBand: number[];
  middleBand: number[];
  lowerBand: number[];
}

export interface MACDData {
  macdLine: number[];
  signalLine: number[];
  histogram: number[];
}

export interface TechnicalIndicators {
  rsi: number[];
  ema20: number[];
  ema50: number[];
}

export interface StockResponse {
  historicalData: CandleData[];
  indicators: TechnicalIndicators;
}

export interface CommonHeaders {
  "Content-Type": string;
  Accept: string;
  "X-UserType": string;
  "X-SourceID": string;
  "X-ClientLocalIP": string;
  "X-ClientPublicIP": string;
  "X-MACAddress": string;
  "X-PrivateKey"?: string;
  Authorization?: string;
}

export type CustomTimeFormat = `${string} ${string}`; // Example: '2021-02-08 09:00'

export interface AngleOneHistoryQueryParams {
  onlyMomentum?: boolean;
}

export interface AngleOneGenerateTokenResponse {
  jwtToken: string;
  refreshToken: string;
  feedToken: string;
}

export interface AngleOneTokenGenerateResponse {
  data: AngleOneGenerateTokenResponse;
  status: boolean;
  message: string;
  errorcode: keyof typeof AngleOneErrorCodes;
}

// [timestamp, open, high, low, close, volume].
export type AngleOneHistoryOneCandleData = [
  string,
  number,
  number,
  number,
  number,
  number
];

export interface AngleOneHistoryResponse {
  status: boolean;
  message: string;
  errorcode: keyof typeof AngleOneErrorCodes;
  data: AngleOneHistoryOneCandleData[];
}

export interface AngleOneGenerateTokenResponse {
  jwtToken: string;
  refreshToken: string;
  feedToken: string;
}

export enum ExchangeTypes {
  NSE = "NSE",
  BSE = "BSE",
}

export enum AngleOneHistoryIntervals {
  ONE_DAY = "ONE_DAY",
  FIFTEEN_MINUTE = "FIFTEEN_MINUTE",
  THIRTY_MINUTE = "THIRTY_MINUTE",
  ONE_HOUR = "ONE_HOUR",
}

export interface AngleOneHistoryParams {
  exchange: ExchangeTypes;
  symboltoken: string;
  interval: AngleOneHistoryIntervals;
  fromdate: CustomTimeFormat;
  todate: CustomTimeFormat;
}
