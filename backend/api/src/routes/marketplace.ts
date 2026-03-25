import { Router, Request, Response } from "express";
import { buildProfileCommitments, hashToField, toField, toU32, toU64 } from "../lib/commitments.js";
import {
  ProfileCommitmentInputSchema,
  RegisterProfilePayloadSchema,
  CreateListingPayloadSchema,
  CreatePaymentIntentSchema,
  IssueTicketSchema,
  InferenceSettleSchema,
} from "../types/index.js";

export const marketplaceRouter = Router();

// ─── [POST] /v1/commitments/profile ──────────────────────────────────────────
// Hashes raw demographic values into Aleo field commitments.
marketplaceRouter.post("/profile", (req: Request, res: Response) => {
  const parsed = ProfileCommitmentInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const output = buildProfileCommitments(parsed.data);
  res.json({ ok: true, output });
});

// ─── [POST] /v1/payloads/profile/register ────────────────────────────────────
// Builds a transaction payload for profile_registry.aleo::register_profile
marketplaceRouter.post("/profile/register", (req: Request, res: Response) => {
  const parsed = RegisterProfilePayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const d = parsed.data;
  res.json({
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
});

// ─── [POST] /v1/payloads/market/create ───────────────────────────────────────
// Builds a transaction payload for data_market.aleo::create_listing
marketplaceRouter.post("/market/create", (req: Request, res: Response) => {
  const parsed = CreateListingPayloadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const d = parsed.data;
  const profileRootCommitment = d.profileRootCommitment ?? hashToField("root", d.profileId, d.listingId);
  const featureSchemaCommitment = d.featureSchemaCommitment ?? hashToField("schema", d.listingId);
  res.json({
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
});

// ─── [POST] /v1/payloads/payment/intent ──────────────────────────────────────
// Builds a transaction payload for payment_router.aleo::create_payment_intent
marketplaceRouter.post("/payment/intent", (req: Request, res: Response) => {
  const parsed = CreatePaymentIntentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const d = parsed.data;
  const paymentCommitment = d.paymentCommitment ?? hashToField("payment", d.intentId, d.listingId, d.amountMicrocredits);
  res.json({
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
});

// ─── [POST] /v1/payloads/ticket/issue ────────────────────────────────────────
// Builds a transaction payload for access_ticketing.aleo::issue_ticket
marketplaceRouter.post("/ticket/issue", (req: Request, res: Response) => {
  const parsed = IssueTicketSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const d = parsed.data;
  const queryCommitment = d.queryCommitment ?? hashToField("query", d.listingId, d.paymentIntentId);
  const expiresAtEpoch = d.expiresAtEpoch ?? 99999;
  res.json({
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
});

// ─── [POST] /v1/payloads/inference/settle ────────────────────────────────────
// Builds a transaction payload for inference_settlement.aleo::settle
marketplaceRouter.post("/inference/settle", (req: Request, res: Response) => {
  const parsed = InferenceSettleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
    return;
  }
  const d = parsed.data;
  const queryCommitment = d.queryCommitment ?? hashToField("query", d.listingId, d.ticketId);
  const outputCommitment = d.outputCommitment ?? hashToField("output", d.listingId, d.ticketId, Date.now());
  const settledEpoch = d.settledEpoch ?? 1;
  res.json({
    ok: true,
    programId: "inference_settlement.aleo",
    functionName: "settle",
    inputs: {
      owner: d.ownerAddress,
      listing_id: toField(d.listingId),
      ticket_id: toField(d.ticketId),
      query_commitment: toField(queryCommitment),
      output_commitment: toField(outputCommitment),
      settled_epoch: toU32(settledEpoch),
    },
  });
});
