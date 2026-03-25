import { Router, Request, Response } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "Aura Protocol API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    contracts: {
      profile_registry: "profile_registry.aleo",
      data_market: "data_market.aleo",
      access_ticketing: "access_ticketing.aleo",
      inference_settlement: "inference_settlement.aleo",
      payment_router: "payment_router.aleo",
    },
    network: "aleo-testnet",
    explorer: "https://api.explorer.provable.com/v1/testnet",
  });
});
