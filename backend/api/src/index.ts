import cors from "cors";
import express from "express";
import { config } from "./lib/config.js";
import { healthRouter } from "./routes/health.js";
import { marketplaceRouter } from "./routes/marketplace.js";

const app = express();

app.use(cors({ origin: config.corsOrigin === "*" ? true : config.corsOrigin }));
app.use(express.json({ limit: "1mb" }));

app.use(healthRouter);
app.use(marketplaceRouter);

app.listen(config.port, () => {
	console.log(`Confidential Marketplace API listening on :${config.port}`);
	console.log(`Aleo network: ${config.aleoNetwork}`);
	console.log(`RPC endpoint: ${config.aleoRpcUrl}`);
});
