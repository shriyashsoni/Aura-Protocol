import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export function GET() {
  return NextResponse.json({
contracts: config.programs,
sequence: [
"profile_registry/register_profile",
"data_market/create_listing",
"payment_router/create_payment_intent",
"access_ticketing/issue_ticket",
"inference_settlement/settle",
],
notes: [
"Use /v1/commitments/profile and /v1/commitments/query before generating payload templates.",
"Shield Wallet should sign and broadcast each payload transition.",
"Amounts are passed as Leo literals (e.g. 1000000u64, 100u32).",
],
});
}
