import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);

console.log(`Address: ${account.address}`);
console.log("Private key: [shown once; store it in a password manager]");
console.log(`DEPLOYER_PRIVATE_KEY=${privateKey}`);
console.log("\nFund the address with BOT on Bot Chain, then place the private key in a local .env file.");