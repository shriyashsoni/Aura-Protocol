import express from "express";
import cors from "cors";
import "dotenv/config";
import { healthRouter } from "./routes/health.js";
import { marketplaceRouter } from "./routes/marketplace.js";

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: "*" }));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/v1/health", healthRouter);
app.use("/v1/commitments", marketplaceRouter);
app.use("/v1/payloads", marketplaceRouter);

// ─── 404 Fallback ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🟢 Aura Protocol API running on http://localhost:${PORT}`);
  console.log(`   Health:  GET  /v1/health`);
  console.log(`   Profile: POST /v1/commitments/profile`);
  console.log(`   Profile: POST /v1/payloads/profile/register`);
  console.log(`   Market:  POST /v1/payloads/market/create`);
  console.log(`   Payment: POST /v1/payloads/payment/intent`);
  console.log(`   Ticket:  POST /v1/payloads/ticket/issue`);
  console.log(`   Infer:   POST /v1/payloads/inference/settle\n`);
});

export default app;
