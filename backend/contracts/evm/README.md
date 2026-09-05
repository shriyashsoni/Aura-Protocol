# Aura Protocol EVM deployment

Bot Chain configuration:

- RPC: `https://rpc.botchain.ai`
- Chain ID: `677`
- Explorer: `https://scan.botchain.ai`

## Generate a deployer wallet

Run these commands locally. Never commit the private key or send it to anyone:

```bash
npm install
npm run wallet
```

Fund the printed address with BOT, then create `backend/contracts/evm/.env`:

```env
BOTCHAIN_RPC_URL=https://rpc.botchain.ai
BOTCHAIN_CHAIN_ID=677
DEPLOYER_PRIVATE_KEY=0x...
```

Deploy:

```bash
npm run deploy
```

Copy the returned contract address into `NEXT_PUBLIC_AURA_PROTOCOL_ADDRESS` and
`AURA_PROTOCOL_ADDRESS` in the application environment files.