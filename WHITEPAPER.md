# Aura Protocol: Confidential AI Marketplace
## An In-Depth Whitepaper & Technical Documentation

---

## 1. Abstract
The **Aura Protocol** is a decentralized, zero-knowledge marketplace built on the **Aleo Network** that aims to revolutionize the intersection of Artificial Intelligence and blockchain technology. By leveraging zero-knowledge proofs (ZKPs), Aura provides an uncompromised environment where private data sets, inference requests, and decentralized compute validation can occur entirely on-chain without revealing sensitive underlying data.

Aura separates the monolithic constraints of traditional smart contracts into a modular, microservice-based architecture comprised of five distinct Leo smart contracts. This allows data providers, compute nodes, and AI consumers to interact via a trustless escrow, ensuring secure payments, access management, and verifiable machine learning inferences.

---

## 2. Core Architecture

The Aura architecture is divided into three layers:
1. **Blockchain Layer (Aleo):** 5 modular zero-knowledge smart contracts written in Leo, deployed on the Aleo Testnet.
2. **Backend API (Node.js/Express):** A payload compiler and relayer that packages user requests into ZK-compatible commitments and interacts with Aleo network APIs.
3. **Frontend Application (Next.js):** A sleek, black-and-white Web3 minimal interface communicating with Aleo-compatible wallets (e.g., Leo Wallet) to sign zero-knowledge transitions locally.

---

## 3. Smart Contract Infrastructure

The protocol suite is decentralized into 5 interoperable Leo smart contracts.

### 3.1 Profile Registry (\profile_registry.aleo\)
* **Purpose:** Handles ZK identity mapping and demographic commitments.
* **Mechanism:** Users register roles (Data Provider, Consumer, Compute Node) and store cryptographic hashes (commitments) of their KYC or demographic profiles on-chain. Actual data remains strictly off-chain and private.

### 3.2 Data Market (\data_market.aleo\)
* **Purpose:** The cataloging of private datasets for machine learning.
* **Mechanism:** Data providers list their dataset identifiers (hashes) alongside a base price (in Aleo credits) and maximum total access quotas. Pricing dynamics and sell caps are tracked transparently, while the dataset content is hidden.

### 3.3 Access Ticketing (\ccess_ticketing.aleo\)
* **Purpose:** Proof-of-purchase authorization.
* **Mechanism:** Upon valid payment, this contract mints bounded or perpetual "Access Tickets." A record allows node runners to cryptographically verify if a consumer holds the rights to prompt a model using a specific dataset.

### 3.4 Inference Settlement (\inference_settlement.aleo\)
* **Purpose:** Bridges off-chain ML inference generation with on-chain cryptographic receipts.
* **Mechanism:** When an AI model completes a specific task, the Compute Node submits an inference result hash and the original request hash to this contract. This generates a verifiably true "Settlement Receipt," confirming the compute occurred correctly before funds are released.

### 3.5 Payment Router (\payment_router.aleo\)
* **Purpose:** Secure, dynamic escrow bridging all actors natively in Aleo credits.
* **Mechanism:** Lock and release mechanisms. Users deposit Aleo credits into the pool. Upon successful issuance of an Access Ticket or verification of an Inference Settlement, the router routes micro-payments to the Data Provider and the Node Runner respectively.

---

## 4. Deployment Information & On-Chain Addresses

All 5 contracts have been successfully compiled and fully deployed to the **Aleo Testnet**. 

* **Consensus Network:** Aleo Testnet (V12)
* **API Explorer Base Endpoint:** \https://api.explorer.provable.com/v1/testnet/\
* **Official Provable Explorer UI:** \https://testnet.provable.tools/\

### Verified Aleo Program Links 🔗
The following programs have been deployed to the testnet successfully and exist permanently. You can view their raw source code and transition history directly via these Provable API links:

| Contract Module | Aleo Program ID | Provable Network Explorer API Link |
| :--- | :--- | :--- |
| **Profile Registry** | \profile_registry.aleo\ | [View on Provable API](https://api.explorer.provable.com/v1/testnet/program/profile_registry.aleo) |
| **Data Market** | \data_market.aleo\ | [View on Provable API](https://api.explorer.provable.com/v1/testnet/program/data_market.aleo) |
| **Access Ticketing** | \ccess_ticketing.aleo\ | [View on Provable API](https://api.explorer.provable.com/v1/testnet/program/access_ticketing.aleo) |
| **Inference Settlement** | \inference_settlement.aleo\ | [View on Provable API](https://api.explorer.provable.com/v1/testnet/program/inference_settlement.aleo) |
| **Payment Router** | \payment_router.aleo\ | [View on Provable API](https://api.explorer.provable.com/v1/testnet/program/payment_router.aleo) |

*(Note: Because Aleo Program IDs are unique system-wide strings that end in \.aleo\, they function identically to hexadecimal contract addresses found on Ethereum. You can query these IDs directly into the \Provable Explorer\ frontend search bar).*

---

## 5. Tokenomics & Escrow Flow

1. **Listing:** A Data Provider lists an asset on \data_market\.
2. **Funding:** AI Consumer deposits requested amount into \payment_router\. 
3. **Minting:** \payment_router\ validates deposit and signals \ccess_ticketing\ to mint a ticket to the Consumer's Aleo address.
4. **Inference:** The Consumer requests AI generation using the ticket. Modeler performs inference and submits proof to \inference_settlement\.
5. **Settlement:** The validation of the settlement triggers the \payment_router\ to disburse the locked Aleo credits to both the Modeler and Data Provider.

---

## 6. Technical Stack Summary
* **Smart Contracts:** Leo, snarkOS, Aleo CLI
* **Middleware/API:** TypeScript, Node.js, Express, Zod, Provable API
* **Frontend:** Next.js 15, Tailwind CSS, Framer Motion, Lucide React
* **Scripting:** PowerShell orchestration for batch ZK builds and RPC requests

## 7. Future Roadmap
* Integration with **Leo Wallet Adapters** on the frontend for browser-based ZKP generation.
* Connecting the Node.js API with direct LLM bridges (e.g., OpenAI / Anthropic) to respond to validated Settlement events in real-time.
