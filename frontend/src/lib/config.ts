export const config = {
	chain: {
		id: Number(process.env.NEXT_PUBLIC_CHAIN_ID || 677),
		name: process.env.NEXT_PUBLIC_CHAIN_NAME || "Bot Chain",
		rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.botchain.ai",
		explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL || "https://scan.botchain.ai",
		nativeCurrency: process.env.NEXT_PUBLIC_NATIVE_CURRENCY || "BOT",
	},
programs: {
		auraProtocol: process.env.NEXT_PUBLIC_AURA_PROTOCOL_ADDRESS || "",
},
};
