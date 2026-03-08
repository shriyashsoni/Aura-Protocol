import crypto from "node:crypto";

// Deterministic scaffolding helper. Replace with circuit-aligned commitments for production.
export const commitment = (label: string, payload: unknown): string => {
	const serialized = JSON.stringify(payload);
	const digest = crypto.createHash("sha256").update(`${label}:${serialized}`).digest("hex");
	return `0x${digest}`;
};
