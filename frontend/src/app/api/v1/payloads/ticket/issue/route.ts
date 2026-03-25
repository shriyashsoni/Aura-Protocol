import { NextResponse } from "next/server";
import { toField, toU32, toU64, hashToField } from "@/lib/commitments";
import { z } from "zod";

const Schema = z.object({
  consumerAddress: z.string().min(1),
  listingId: z.string().min(1),
  paymentIntentId: z.string().min(1),
  queryCommitment: z.string().optional(),
  paidMicrocredits: z.union([z.string(), z.number()]),
  expiresAtEpoch: z.union([z.string(), z.number()]).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    
    const d = parsed.data;
    const queryCommitment = d.queryCommitment ?? hashToField("query", d.listingId, d.paymentIntentId);
    const expiresAtEpoch = d.expiresAtEpoch ?? 99999;
    
    return NextResponse.json({
      ok: true,
      programId: "access_ticketing.aleo",
      functionName: "issue_ticket",
      inputs: {
        consumer: d.consumerAddress,
        listing_id: toField(d.listingId),
        payment_intent_id: toField(d.paymentIntentId),
        query_commitment: toField(queryCommitment),
        paid_microcredits: toU64(d.paidMicrocredits),
        expires_at_epoch: toU32(expiresAtEpoch),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
