import { z } from "zod";

// ─── Profile ─────────────────────────────────────────────────────────────────
export const ProfileCommitmentInputSchema = z.object({
  profileId: z.string().min(1),
  ageBucket: z.union([z.string(), z.number()]),
  region: z.union([z.string(), z.number()]),
  behaviorFingerprint: z.union([z.string(), z.number()]),
  kycTier: z.union([z.string(), z.number()]),
  nonce: z.union([z.string(), z.number()]),
});

export const RegisterProfilePayloadSchema = z.object({
  profileId: z.string(),
  ageBucketCommitment: z.string(),
  regionCommitment: z.string(),
  behaviorCommitment: z.string(),
  kycCommitment: z.string(),
  nonce: z.string(),
});

// ─── Data Market ──────────────────────────────────────────────────────────────
export const CreateListingPayloadSchema = z.object({
  listingId: z.string().min(1),
  profileId: z.string().min(1),
  profileRootCommitment: z.string().optional(),
  featureSchemaCommitment: z.string().optional(),
  accessPriceMicrocredits: z.union([z.string(), z.number()]),
  inferenceQuota: z.union([z.string(), z.number()]),
});

// ─── Payment Router ───────────────────────────────────────────────────────────
export const CreatePaymentIntentSchema = z.object({
  providerAddress: z.string().min(1),
  listingId: z.string().min(1),
  intentId: z.string().min(1),
  amountMicrocredits: z.union([z.string(), z.number()]),
  paymentCommitment: z.string().optional(),
});

// ─── Access Ticketing ─────────────────────────────────────────────────────────
export const IssueTicketSchema = z.object({
  consumerAddress: z.string().min(1),
  listingId: z.string().min(1),
  paymentIntentId: z.string().min(1),
  queryCommitment: z.string().optional(),
  paidMicrocredits: z.union([z.string(), z.number()]),
  expiresAtEpoch: z.union([z.string(), z.number()]).optional(),
});

// ─── Inference Settlement ─────────────────────────────────────────────────────
export const InferenceSettleSchema = z.object({
  ownerAddress: z.string().min(1),
  listingId: z.string().min(1),
  ticketId: z.string().min(1),
  queryCommitment: z.string().optional(),
  outputCommitment: z.string().optional(),
  settledEpoch: z.union([z.string(), z.number()]).optional(),
});
