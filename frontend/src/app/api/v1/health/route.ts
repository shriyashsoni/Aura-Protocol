import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Aura Protocol API (Serverless)",
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
    environment: process.env.NODE_ENV,
  });
}
