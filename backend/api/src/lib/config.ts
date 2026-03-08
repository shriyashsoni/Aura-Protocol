import dotenv from "dotenv";

dotenv.config();

const parsePort = (value: string | undefined): number => {
	if (!value) return 8080;
	const parsed = Number(value);
	if (!Number.isInteger(parsed) || parsed <= 0) {
		throw new Error("Invalid PORT environment value");
	}
	return parsed;
};

const required = (name: string, fallback?: string): string => {
	const value = process.env[name] ?? fallback;
	if (!value || value.trim().length === 0) {
		throw new Error(`Missing required environment variable: ${name}`);
	}
	return value;
};

export const config = {
	port: parsePort(process.env.PORT),
	corsOrigin: process.env.CORS_ORIGIN ?? "*",
	aleoNetwork: required("ALEO_NETWORK", "testnet"),
	aleoRpcUrl: required("ALEO_RPC_URL", "https://api.explorer.provable.com/v1"),
	programs: {
		profileRegistry: required("PROGRAM_PROFILE_REGISTRY", "profile_registry.aleo"),
		dataMarket: required("PROGRAM_DATA_MARKET", "data_market.aleo"),
		accessTicketing: required("PROGRAM_ACCESS_TICKETING", "access_ticketing.aleo"),
		inferenceSettlement: required("PROGRAM_INFERENCE_SETTLEMENT", "inference_settlement.aleo"),
		paymentRouter: required("PROGRAM_PAYMENT_ROUTER", "payment_router.aleo"),
	},
};
