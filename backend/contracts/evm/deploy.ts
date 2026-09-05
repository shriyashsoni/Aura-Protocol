import fs from "node:fs";
import path from "node:path";
import solc from "solc";
import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { defineChain } from "viem";

const rpcUrl = process.env.BOTCHAIN_RPC_URL || "https://rpc.botchain.ai";
const chainId = Number(process.env.BOTCHAIN_CHAIN_ID);
const privateKey = process.env.DEPLOYER_PRIVATE_KEY as `0x${string}`;
if (!chainId || !privateKey) throw new Error("Set BOTCHAIN_CHAIN_ID and DEPLOYER_PRIVATE_KEY");

const chain = defineChain({ id: chainId, name: "Bot Chain", nativeCurrency: { name: "BOT", symbol: "BOT", decimals: 18 }, rpcUrls: { default: { http: [rpcUrl] } } });
const source = fs.readFileSync(path.resolve(process.cwd(), "AuraProtocol.sol"), "utf8");
const output = JSON.parse(solc.compile(JSON.stringify({ language: "Solidity", sources: { "AuraProtocol.sol": { content: source } }, settings: { outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } } } })));
const artifact = output.contracts["AuraProtocol.sol"].AuraProtocol;
const account = privateKeyToAccount(privateKey);
const wallet = createWalletClient({ account, chain, transport: http(rpcUrl) });
const publicClient = createPublicClient({ chain, transport: http(rpcUrl) });

async function deploy() {
	const hash = await wallet.deployContract({ abi: artifact.abi, bytecode: `0x${artifact.evm.bytecode.object}` as `0x${string}` });
	const address = await publicClient.waitForTransactionReceipt({ hash }).then((receipt) => receipt.contractAddress);
	console.log(JSON.stringify({ address, explorer: address ? `https://scan.botchain.ai/address/${address}` : null }, null, 2));
}

void deploy();