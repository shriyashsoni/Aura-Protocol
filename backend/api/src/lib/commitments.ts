/**
 * Aura Protocol — Commitment Helpers
 *
 * Generates deterministic Aleo-compatible field commitments from raw values.
 * Uses a simple but deterministic approach: BigInt arithmetic hashed into
 * the Aleo BLS12-377 scalar field modulus.
 */

// Aleo BLS12-377 scalar field prime (used as modulus for field elements)
const FIELD_PRIME = BigInt(
  "8444461749428370424248824938781546531375899335154063827935233455917409239041"
);

/** Produces a deterministic field element string from multiple input strings. */
export function hashToField(...parts: (string | number)[]): string {
  const combined = parts.join("|");
  let hash = BigInt(0);
  for (let i = 0; i < combined.length; i++) {
    hash = (hash * BigInt(31) + BigInt(combined.charCodeAt(i))) % FIELD_PRIME;
  }
  if (hash === BigInt(0)) hash = BigInt(1);
  return `${hash}field`;
}

/** Parses a raw input (e.g. "42" or "42field") into a clean "<value>field" string. */
export function toField(value: string | number): string {
  const raw = String(value).replace(/field$/i, "").trim();
  const n = BigInt(raw) % FIELD_PRIME;
  return `${n === BigInt(0) ? BigInt(1) : n}field`;
}

/** Converts a number into "<value>u32" Aleo format. */
export function toU32(value: number | string): string {
  return `${Math.max(1, Math.floor(Number(value)))}u32`;
}

/** Converts a number into "<value>u64" Aleo format. */
export function toU64(value: number | string): string {
  return `${Math.max(1, Math.floor(Number(value)))}u64`;
}

/** Generates profile commitments from raw demographic values. */
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
