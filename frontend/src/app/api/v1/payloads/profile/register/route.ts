import { NextResponse } from "next/server";
import { toField } from "@/lib/commitments";
import { z } from "zod";

const Schema = z.object({
  profileId: z.string(),
  ageBucketCommitment: z.string(),
  regionCommitment: z.string(),
  behaviorCommitment: z.string(),
  kycCommitment: z.string(),
  nonce: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    
    const d = parsed.data;
    return NextResponse.json({
      ok: true,
      programId: "profile_registry.aleo",
      functionName: "register_profile",
      inputs: {
        profile_id: toField(d.profileId),
        age_bucket_commitment: toField(d.ageBucketCommitment),
        region_commitment: toField(d.regionCommitment),
        behavior_commitment: toField(d.behaviorCommitment),
        kyc_commitment: toField(d.kycCommitment),
        nonce: toField(d.nonce),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
