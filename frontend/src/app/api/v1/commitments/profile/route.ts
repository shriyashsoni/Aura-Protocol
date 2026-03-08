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
