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

## TypeScript

The project is written in TypeScript and includes type definitions for:
- API responses
- Technical indicators
- Request/Response objects
- Environment variables 