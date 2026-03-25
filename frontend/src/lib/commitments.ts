/**
 * Aura Protocol — Commitment Helpers
 * Generated deterministic Aleo-compatible field commitments.
 */

const FIELD_PRIME = BigInt(
  "8444461749428370424248824938781546531375899335154063827935233455917409239041"
);

export function hashToField(...parts: (string | number)[]): string {
  const combined = parts.join("|");
  let hash = BigInt(0);
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * BigInt(31) + BigInt(combined.charCodeAt(i))) % FIELD_PRIME;
  }
  if (hash === BigInt(0)) hash = BigInt(1);
  return `${hash}field`;
}

export function toField(value: string | number): string {
  const raw = String(value).replace(/field$/i, "").trim();
  const n = BigInt(raw) % FIELD_PRIME;
  return `${n === BigInt(0) ? BigInt(1) : n}field`;
}

export function toU32(value: number | string): string {
  return `${Math.max(1, Math.floor(Number(value)))}u32`;
}

export function toU64(value: number | string): string {
  return `${Math.max(1, Math.floor(Number(value)))}u64`;
}

export function buildProfileCommitments(data: {
  profileId: string;
  ageBucket: string | number;
  region: string | number;
  behaviorFingerprint: string | number;
  kycTier: string | number;
  nonce: string | number;
}) {
  return {
    ageBucketCommitment: hashToField("age", data.ageBucket, data.profileId),
    regionCommitment: hashToField("region", data.region, data.profileId),
    behaviorCommitment: hashToField("behavior", data.behaviorFingerprint, data.profileId),
    kycCommitment: hashToField("kyc", data.kycTier, data.profileId),
    nonce: hashToField("nonce", data.nonce, data.profileId),
    profileId: toField(String(data.profileId).replace(/field$/i, "")),
  };
}
