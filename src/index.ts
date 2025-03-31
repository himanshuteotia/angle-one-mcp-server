import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import stockRoutes from "./routes/stockRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/stock", stockRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
