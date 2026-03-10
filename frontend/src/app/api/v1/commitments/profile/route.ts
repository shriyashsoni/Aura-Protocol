// Demo: static profile for GET (replace with real data source in production)
const DEMO_PROFILE = {
    profileId: 'demo_profile_001',
    ageBucketCommitment: '0x1234567890abcdef',
    regionCommitment: '0xabcdef1234567890',
    behaviorCommitment: '0xdeadbeefcafebabe',
    kycCommitment: '0xfeedfacebadc0ffe',
    nonce: '0x1a2b3c4d',
    profileRootCommitment: '0xrootcommitment',
};

export async function GET() {
    // In production, fetch from DB or blockchain
    return NextResponse.json({
        success: true,
        data: DEMO_PROFILE,
    });
}
import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { commitment } from '@/lib/commitments';

const fieldLike = z.string().min(1);

const profileInputSchema = z.object({
profileId: fieldLike,
ageBucket: z.string().min(1),
region: z.string().min(1),
behaviorFingerprint: z.string().min(1),
kycTier: z.string().min(1),
nonce: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
      const body = await req.json();
      const parsed = profileInputSchema.safeParse(body);
      if (!parsed.success) {
          return NextResponse.json({ error: "Invalid profile payload", issues: parsed.error.issues }, { status: 400 });
      }

      const input = parsed.data;
      const ageBucketCommitment = commitment("age_bucket", { v: input.ageBucket, nonce: input.nonce });
      const regionCommitment = commitment("region", { v: input.region, nonce: input.nonce });
      const behaviorCommitment = commitment("behavior", { v: input.behaviorFingerprint, nonce: input.nonce });
      const kycCommitment = commitment("kyc", { v: input.kycTier, nonce: input.nonce });
      const profileRootCommitment = commitment("profile_root", {
          profileId: input.profileId,
          ageBucketCommitment,
          regionCommitment,
          behaviorCommitment,
          kycCommitment,
          nonce: input.nonce,
      });

      return NextResponse.json({
          profileId: input.profileId,
          ageBucketCommitment,
          regionCommitment,
          behaviorCommitment,
          kycCommitment,
          nonce: input.nonce,
          profileRootCommitment,
      });
  } catch (e) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
