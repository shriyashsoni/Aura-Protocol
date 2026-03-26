import { NextResponse } from "next/server";

const PROGRAMS = [
  {
    id: "profile_registry",
    name: "profile_registry.aleo",
    description: "Zero-knowledge identity registry for Aura Protocol",
    address: "profile_registry.aleo",
    status: "active",
    deployedAt: "2025-01-01T00:00:00Z",
    functions: ["register_profile", "rotate_profile"],
    version: "1.0.0",
    network: "testnet",
  },
  {
    id: "data_market",
    name: "data_market.aleo",
    description: "Privacy-preserving data marketplace",
    address: "data_market.aleo",
    status: "active",
    deployedAt: "2025-01-01T00:00:00Z",
    functions: ["create_listing", "update_listing", "close_listing"],
    version: "1.0.0",
    network: "testnet",
  },
  {
    id: "access_ticketing",
    name: "access_ticketing.aleo",
    description: "ZK access ticket issuance and validation",
    address: "access_ticketing.aleo",
    status: "active",
    deployedAt: "2025-01-01T00:00:00Z",
    functions: ["issue_ticket", "mark_consumed", "mark_expired"],
    version: "1.0.0",
    network: "testnet",
  },
  {
    id: "inference_settlement",
    name: "inference_settlement.aleo",
    description: "On-chain AI compute settlement layer",
    address: "inference_settlement.aleo",
    status: "active",
    deployedAt: "2025-01-01T00:00:00Z",
    functions: ["settle", "attest_receipt"],
    version: "1.0.0",
    network: "testnet",
  },
  {
    id: "payment_router",
    name: "payment_router.aleo",
    description: "Escrow and payment routing for Aleo credits",
    address: "payment_router.aleo",
    status: "active",
    deployedAt: "2025-01-01T00:00:00Z",
    functions: ["create_payment_intent", "confirm_payment", "cancel_payment"],
    version: "1.0.0",
    network: "testnet",
  },
];

export async function GET() {
  return NextResponse.json({ ok: true, data: PROGRAMS });
}
