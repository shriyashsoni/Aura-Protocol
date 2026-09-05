import { Router, Request, Response } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "Aura Protocol API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    contracts: {
      aura_protocol: process.env.AURA_PROTOCOL_ADDRESS || null,
    },
    network: "bot-chain",
    rpc: process.env.BOTCHAIN_RPC_URL || "https://rpc.botchain.ai",
    explorer: "https://scan.botchain.ai",
  });
});
