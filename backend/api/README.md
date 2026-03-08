# Confidential AI Marketplace API

Backend service that generates privacy commitments and transition payload templates
for the 5 deployed Aleo contracts.

## Contracts wired

- `profile_registry.aleo`
- `data_market.aleo`
- `access_ticketing.aleo`
- `inference_settlement.aleo`
- `payment_router.aleo`

## Endpoints

- `GET /health`
- `GET /v1/programs`
- `GET /v1/flow/architecture`
- `POST /v1/commitments/profile`
- `POST /v1/commitments/query`
- `POST /v1/payloads/profile/register`
- `POST /v1/payloads/market/create-listing`
- `POST /v1/payloads/payment/create-intent`
- `POST /v1/payloads/ticket/issue`
- `POST /v1/payloads/inference/settle`

## Run

```bash
cd backend/api
npm install
npm run dev
```

## Flow

1. Build commitments with `/v1/commitments/profile` and `/v1/commitments/query`.
2. Create payload templates from `/v1/payloads/*` routes.
3. Sign and broadcast each payload with Shield Wallet frontend.
