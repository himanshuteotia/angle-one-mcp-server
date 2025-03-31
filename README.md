# Angle One Stock MCP

A generic MCP (Model Control Protocol) for fetching stock data and technical analysis from Angle One API. This MCP can be used with any platform that supports MCP protocol (Cursor, Copilot, Claude AI, etc.).

## Features

- Fetches historical stock data (configurable period)
- Calculates technical indicators (RSI, EMA-20, EMA-50)
- RESTful API endpoints
- CORS enabled
- Written in TypeScript
- Generic MCP Integration

## Prerequisites

- Node.js (v14 or higher)
- Angle One API credentials
- Any MCP-supporting platform (Cursor, Copilot, etc.)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your Angle One credentials:
   ```
   ANGLE_ONE_PUBLISHER_API_KEY=your_api_key_here
   ANGLE_ONE_CLIENT_ID=your_client_id_here
   ANGLE_ONE_PIN=your_pin_here
   ANGLE_ONE_TOTP=your_totp_secret_here
   PORT=3000
   DATA_PERIOD_MONTHS=6  # Optional: Number of months of historical data to fetch (default: 6)
   ```

## Running the Server

Development mode (with hot reload):
```bash
npm run dev
```

Build and run in production:
```bash
npm run build
npm start
```

Watch mode (for development):
```bash
npm run watch
```

## API Endpoints

### Get Stock Data and Analysis
```
GET /api/stock/:symbol
```

Example:
```
GET http://localhost:3000/api/stock/RELIANCE
```

Response includes:
- Historical data (OHLCV)
- Technical indicators (RSI, EMA-20, EMA-50)

## Technical Indicators

The server calculates the following technical indicators:
- RSI (Relative Strength Index) - 14 periods
- EMA (Exponential Moving Average) - 20 and 50 periods

## Configuration

### Data Period
You can configure how many months of historical data you want to fetch by setting the `DATA_PERIOD_MONTHS` environment variable. The default is 6 months.

Example:
```
DATA_PERIOD_MONTHS=12  # Fetch 1 year of data
DATA_PERIOD_MONTHS=3   # Fetch 3 months of data
```

## MCP Integration

This API is available as a generic MCP that can be used with any platform supporting the MCP protocol.

### Platform-Specific Setup

#### Cursor IDE Integration

1. **Prepare the MCP Package**
   ```bash
   # Create a zip file of your MCP
   zip -r angle-one-stock-mcp.zip mcp.json src/ dist/ package.json
   ```

2. **Add to Cursor IDE**
   - Open Cursor IDE
   - Go to Settings > Extensions > MCP
   - Click "Add Custom MCP"
   - Upload the `angle-one-stock-mcp.zip` file
   - Configure the base URL (default: http://localhost:3000)

3. **Using in Cursor IDE**
   ```typescript
   // Example usage in Cursor IDE
   const stockData = await cursor.mcp.getStockData({ 
     symbol: "RELIANCE",
     // Optional parameters
     period: "6M" // 6 months of data
   });

   // Access the data
   console.log(stockData.indicators.rsi);
   console.log(stockData.historicalData);
   ```

4. **Environment Setup**
   - Make sure your server is running
   - Configure environment variables in Cursor IDE settings
   - Test the connection using the test button in Cursor IDE MCP settings

5. **Features in Cursor IDE**
   - Auto-completion for API calls
   - TypeScript type checking
   - Inline documentation
   - Error handling with detailed messages
   - Quick access through command palette (Cmd/Ctrl + Shift + P)

#### Copilot Integration

1. **Prepare the MCP Package**
   ```bash
   # Create a zip file of your MCP
   zip -r angle-one-stock-mcp.zip mcp.json src/ dist/ package.json
   ```

2. **Add to Copilot**
   - Open Copilot settings
   - Go to "Extensions" or "MCP" section
   - Click "Add Custom MCP"
   - Upload the `angle-one-stock-mcp.zip` file
   - Configure the base URL (default: http://localhost:3000)

3. **Using in Copilot**
   ```typescript
   // Example usage in Copilot
   const stockData = await copilot.mcp.getStockData({ 
     symbol: "RELIANCE",
     // Optional parameters
     period: "6M" // 6 months of data
   });

   // Access the data
   console.log(stockData.indicators.rsi);
   console.log(stockData.historicalData);
   ```

4. **Environment Setup**
   - Make sure your server is running
   - Configure environment variables in Copilot settings
   - Test the connection using the test button in Copilot MCP settings

#### Claude AI Integration

1. **Prepare the MCP Package**
   ```bash
   # Create a zip file of your MCP
   zip -r angle-one-stock-mcp.zip mcp.json src/ dist/ package.json
   ```

2. **Add to Claude AI**
   - Open Claude AI settings
   - Go to "Extensions" or "MCP" section
   - Click "Add Custom MCP"
   - Upload the `angle-one-stock-mcp.zip` file
   - Configure the base URL (default: http://localhost:3000)

3. **Using in Claude AI**
   ```typescript
   // Example usage in Claude AI
   const stockData = await claude.mcp.getStockData({ 
     symbol: "RELIANCE",
     // Optional parameters
     period: "6M" // 6 months of data
   });

   // Access the data
   console.log(stockData.indicators.rsi);
   console.log(stockData.historicalData);
   ```

4. **Environment Setup**
   - Make sure your server is running
   - Configure environment variables in Claude AI settings
   - Test the connection using the test button in Claude AI MCP settings

### Using the MCP

You can use the stock API in any MCP-supporting platform:

```typescript
// Example usage
const stockData = await mcp.getStockData({ symbol: "RELIANCE" });
console.log(stockData.indicators.rsi);
```

The MCP provides:
- Type-safe API calls
- Auto-completion
- Documentation
- Error handling
- Platform-agnostic interface

## TypeScript

The project is written in TypeScript and includes type definitions for:
- API responses
- Technical indicators
- Request/Response objects
- Environment variables 