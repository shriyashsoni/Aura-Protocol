import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: {
      contracts: [
        "profile_registry.aleo",
        "data_market.aleo",
        "access_ticketing.aleo",
        "inference_settlement.aleo",
        "payment_router.aleo",
      ],
      flow: [
        "User registers ZK profile via profile_registry.aleo",
        "Data provider creates listing via data_market.aleo",
        "Consumer pays via payment_router.aleo",
        "Access ticket issued via access_ticketing.aleo",
        "Inference settled on-chain via inference_settlement.aleo",
      ],
    },
  });
}
