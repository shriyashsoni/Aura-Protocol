import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});

// Marketplace endpoint (placeholder)

import { config } from "./lib/config";
import { queryAleoProgram } from "./lib/aleo-rpc";

app.get("/marketplace/listings", async (req, res) => {
  try {
    // Example: Query all listings from the data_market contract
    const result = await queryAleoProgram(config.programs.dataMarket, "state");
    res.json({ success: true, data: result });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Add more endpoints for tickets, payments, inference, etc.

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
