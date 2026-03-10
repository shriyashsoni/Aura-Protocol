import dotenv from "dotenv";
dotenv.config();

export const config = {
	aleoNetwork: process.env.ALEO_NETWORK || "testnet",
	aleoRpcUrl: process.env.ALEO_RPC_URL || "https://api.explorer.provable.com/v1",
	programs: {
		profileRegistry: process.env.PROGRAM_PROFILE_REGISTRY || "profile_registry.aleo",
		dataMarket: process.env.PROGRAM_DATA_MARKET || "data_market.aleo",
		accessTicketing: process.env.PROGRAM_ACCESS_TICKETING || "access_ticketing.aleo",
		inferenceSettlement: process.env.PROGRAM_INFERENCE_SETTLEMENT || "inference_settlement.aleo",
		paymentRouter: process.env.PROGRAM_PAYMENT_ROUTER || "payment_router.aleo",
	},
};
