import axios from "axios";

interface ScripMasterData {
  token: string;
  symbol: string;
  name: string;
  expiry: string;
  strike: string;
  lotsize: string;
  instrumenttype: string;
  exch_seg: string;
  tick_size: string;
}

export class ScripMasterService {
  private static instance: ScripMasterService;
  private scripMasterData: ScripMasterData[] = [];
  private readonly SCRIP_MASTER_URL =
    "https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json";

  public constructor() {}

  public static getInstance(): ScripMasterService {
    if (!ScripMasterService.instance) {
      ScripMasterService.instance = new ScripMasterService();
    }
    return ScripMasterService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      const response = await axios.get<ScripMasterData[]>(
        this.SCRIP_MASTER_URL
      );
      this.scripMasterData = response.data;
      console.log(`Loaded ${this.scripMasterData.length} scrip master records`);
    } catch (error) {
      console.error("Error loading scrip master data:", error);
      throw error;
    }
  }

  public getTokenBySymbol(symbol: string): string | null {
    const scrip = this.scripMasterData.find(
      (item) => item.symbol.toLowerCase() === symbol.toLowerCase()
    );
    return scrip?.token || null;
  }

  public getTokenByName(name: string): string | null {
    const scrip = this.scripMasterData.find(
      (item) => item.name.toLowerCase() === name.toLowerCase()
    );
    return scrip?.token || null;
  }

  public getScripDetails(symbol: string): ScripMasterData | null {
    return (
      this.scripMasterData.find(
        (item) => item.symbol.toLowerCase() === symbol.toLowerCase()
      ) || null
    );
  }

  public getAllScrips(): ScripMasterData[] {
    return this.scripMasterData;
  }
}
