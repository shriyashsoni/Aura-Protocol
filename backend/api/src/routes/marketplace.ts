import { Router } from "express";
import { z } from "zod";
import { commitment } from "../lib/commitments.js";
import { config } from "../lib/config.js";
import type { PayloadTemplate, ProfileCommitments } from "../types/aleo.js";

export const marketplaceRouter = Router();

const fieldLike = z.string().min(1);

const profileInputSchema = z.object({
	profileId: fieldLike,
	ageBucket: z.string().min(1),
	region: z.string().min(1),
	behaviorFingerprint: z.string().min(1),
	kycTier: z.string().min(1),
	nonce: z.string().min(1),
});

marketplaceRouter.post("/v1/commitments/profile", (req, res) => {
	const parsed = profileInputSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ error: "Invalid profile payload", issues: parsed.error.issues });
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

	const output: ProfileCommitments = {
		profileId: input.profileId,
		ageBucketCommitment,
		regionCommitment,
		behaviorCommitment,
		kycCommitment,
		nonce: input.nonce,
		profileRootCommitment,
	};

	return res.json(output);
});

const querySchema = z.object({
	digest: z.string().min(1),
	nonce: z.string().min(1),
});

marketplaceRouter.post("/v1/commitments/query", (req, res) => {
	const parsed = querySchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ error: "Invalid query payload", issues: parsed.error.issues });
	}

	const queryCommitment = commitment("query", parsed.data);
	return res.json({ queryCommitment });
});

const template = (programId: string, functionName: string, inputs: PayloadTemplate["inputs"]): PayloadTemplate => {
	return {
		network: config.aleoNetwork,
		programId,
		functionName,
		inputs,
	};
};

marketplaceRouter.get("/v1/programs", (_req, res) => {
	return res.json(config.programs);
});

marketplaceRouter.post("/v1/payloads/profile/register", (req, res) => {
	const parsed = z.object({
		profileId: fieldLike,
		ageBucketCommitment: fieldLike,
		regionCommitment: fieldLike,
		behaviorCommitment: fieldLike,
		kycCommitment: fieldLike,
		nonce: fieldLike,
	}).safeParse(req.body);

	if (!parsed.success) {
		return res.status(400).json({ error: "Invalid register profile payload", issues: parsed.error.issues });
	}

	return res.json(template(config.programs.profileRegistry, "register_profile", parsed.data));
});

marketplaceRouter.post("/v1/payloads/market/create-listing", (req, res) => {
	const parsed = z.object({
		listingId: fieldLike,
		profileId: fieldLike,
		profileRootCommitment: fieldLike,
		featureSchemaCommitment: fieldLike,
		accessPriceMicrocredits: z.string().regex(/^[0-9]+u64$/),
		inferenceQuota: z.string().regex(/^[0-9]+u32$/),
	}).safeParse(req.body);

	if (!parsed.success) {
		return res.status(400).json({ error: "Invalid create listing payload", issues: parsed.error.issues });
	}

	return res.json(template(config.programs.dataMarket, "create_listing", parsed.data));
});

marketplaceRouter.post("/v1/payloads/payment/create-intent", (req, res) => {
	const parsed = z.object({
		providerAddress: z.string().min(1),
		listingId: fieldLike,
		intentId: fieldLike,
		amountMicrocredits: z.string().regex(/^[0-9]+u64$/),
		paymentCommitment: fieldLike,
	}).safeParse(req.body);

	if (!parsed.success) {
		return res.status(400).json({ error: "Invalid payment intent payload", issues: parsed.error.issues });
	}

	return res.json(template(config.programs.paymentRouter, "create_payment_intent", parsed.data));
});

marketplaceRouter.post("/v1/payloads/ticket/issue", (req, res) => {
	const parsed = z.object({
		providerAddress: z.string().min(1),
		listingId: fieldLike,
		paymentIntentId: fieldLike,
		queryCommitment: fieldLike,
		paidMicrocredits: z.string().regex(/^[0-9]+u64$/),
		expiresAtEpoch: z.string().regex(/^[0-9]+u32$/),
	}).safeParse(req.body);

	if (!parsed.success) {
		return res.status(400).json({ error: "Invalid issue ticket payload", issues: parsed.error.issues });
	}

	return res.json(template(config.programs.accessTicketing, "issue_ticket", parsed.data));
});

marketplaceRouter.post("/v1/payloads/inference/settle", (req, res) => {
	const parsed = z.object({
		ownerAddress: z.string().min(1),
		listingId: fieldLike,
		ticketId: fieldLike,
		queryCommitment: fieldLike,
		outputCommitment: fieldLike,
		settledEpoch: z.string().regex(/^[0-9]+u32$/),
	}).safeParse(req.body);

	if (!parsed.success) {
		return res.status(400).json({ error: "Invalid settle inference payload", issues: parsed.error.issues });
	}

	return res.json(template(config.programs.inferenceSettlement, "settle", parsed.data));
});

marketplaceRouter.get("/v1/flow/architecture", (_req, res) => {
	return res.json({
		contracts: config.programs,
		sequence: [
			"profile_registry/register_profile",
			"data_market/create_listing",
			"payment_router/create_payment_intent",
			"access_ticketing/issue_ticket",
			"inference_settlement/settle",
		],
		notes: [
			"Use /v1/commitments/profile and /v1/commitments/query before generating payload templates.",
			"Shield Wallet should sign and broadcast each payload transition.",
			"Amounts are passed as Leo literals (e.g. 1000000u64, 100u32).",
		],
	});
});
