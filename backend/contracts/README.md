# Confidential AI Marketplace - 5 Contract Architecture

This folder splits the backend into 5 Leo smart contracts:

1. `profile_registry.aleo`
- Private demographic commitment registration and rotation.

2. `data_market.aleo`
- Confidential listing lifecycle (create, update, close).

3. `access_ticketing.aleo`
- Private access ticket issuance and state transitions.

4. `inference_settlement.aleo`
- Provider settlement receipts for private inference outputs.

5. `payment_router.aleo`
- Payment intent records for credits-linked settlement workflows.

## Build all

```powershell
cd backend/contracts
pwsh ./scripts/build-all.ps1
```

## Deploy all

```powershell
cd backend/contracts
cp .env.example .env
# add PRIVATE_KEY in .env
pwsh ./scripts/deploy-all.ps1
```

## Deploy only missing programs

If some contracts are already on-chain and you only want the remaining ones:

```powershell
cd backend/contracts
pwsh ./scripts/deploy-remaining.ps1
```
