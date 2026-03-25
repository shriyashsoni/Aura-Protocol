import { NextResponse } from "next/server";
import { toField, toU32, toU64, hashToField } from "@/lib/commitments";
import { z } from "zod";

const Schema = z.object({
  listingId: z.string().min(1),
  profileId: z.string().min(1),
  profileRootCommitment: z.string().optional(),
  featureSchemaCommitment: z.string().optional(),
  accessPriceMicrocredits: z.union([z.string(), z.number()]),
  inferenceQuota: z.union([z.string(), z.number()]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    
    const d = parsed.data;
    const profileRootCommitment = d.profileRootCommitment ?? hashToField("root", d.profileId, d.listingId);
    const featureSchemaCommitment = d.featureSchemaCommitment ?? hashToField("schema", d.listingId);
    
    return NextResponse.json({
      ok: true,
      programId: "data_market.aleo",
      functionName: "create_listing",
      inputs: {
        listing_id: toField(d.listingId),
        profile_id: toField(d.profileId),
        profile_root_commitment: toField(profileRootCommitment),
        feature_schema_commitment: toField(featureSchemaCommitment),
        access_price_microcredits: toU64(d.accessPriceMicrocredits),
        inference_quota: toU32(d.inferenceQuota),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
