import { NextResponse } from "next/server";
import { toField, toU64, hashToField } from "@/lib/commitments";
import { z } from "zod";

const Schema = z.object({
  providerAddress: z.string().min(1),
  listingId: z.string().min(1),
  intentId: z.string().min(1),
  amountMicrocredits: z.union([z.string(), z.number()]),
  paymentCommitment: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    
    const d = parsed.data;
    const paymentCommitment = d.paymentCommitment ?? hashToField("payment", d.intentId, d.listingId, d.amountMicrocredits);
    
    return NextResponse.json({
      ok: true,
      programId: "payment_router.aleo",
      functionName: "create_payment_intent",
      inputs: {
        provider: d.providerAddress,
        listing_id: toField(d.listingId),
        intent_id: toField(d.intentId),
        amount_microcredits: toU64(d.amountMicrocredits),
        payment_commitment: toField(paymentCommitment),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
