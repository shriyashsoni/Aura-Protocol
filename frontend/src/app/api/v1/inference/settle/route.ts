import { NextResponse } from "next/server";
import { toField, toU32, hashToField } from "@/lib/commitments";
import { z } from "zod";

const Schema = z.object({
  ownerAddress: z.string().min(1),
  listingId: z.string().min(1),
  ticketId: z.string().min(1),
  queryCommitment: z.string().optional(),
  outputCommitment: z.string().optional(),
  settledEpoch: z.union([z.string(), z.number()]).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    const d = parsed.data;
    const queryCommitment = d.queryCommitment ?? hashToField("query", d.listingId, d.ticketId);
    const outputCommitment = d.outputCommitment ?? hashToField("output", d.listingId, d.ticketId, Date.now());
    return NextResponse.json({
      ok: true,
      programId: "inference_settlement.aleo",
      functionName: "settle",
      inputs: {
        owner: d.ownerAddress,
        listing_id: toField(d.listingId),
        ticket_id: toField(d.ticketId),
        query_commitment: toField(queryCommitment),
        output_commitment: toField(outputCommitment),
        settled_epoch: toU32(d.settledEpoch || 1),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
