program payment_router.aleo {
    @noupgrade
    async constructor() {}

    // Payment intent records let buyer and provider coordinate an offchain/private
    // credits transfer while preserving a verifiable onchain intent trail.
    record payment_intent {
        owner: address,
        provider: address,
        listing_id: field,
        intent_id: field,
        amount_microcredits: u64,
        payment_commitment: field,
        status: u8,
    }

    transition create_payment_intent(
        provider: address,
        listing_id: field,
        intent_id: field,
        amount_microcredits: u64,
        payment_commitment: field
    ) -> payment_intent {
        assert(listing_id != 0field);
        assert(intent_id != 0field);
        assert(amount_microcredits > 0u64);
        assert(payment_commitment != 0field);

        let intent: payment_intent = payment_intent {
            owner: self.caller,
            provider: provider,
            listing_id: listing_id,
            intent_id: intent_id,
            amount_microcredits: amount_microcredits,
            payment_commitment: payment_commitment,
            status: 1u8,
        };

        return intent;
    }

    transition confirm_payment(intent: payment_intent, settlement_commitment: field) -> payment_intent {
        assert(intent.provider == self.caller);
        assert(intent.status == 1u8);
        assert(settlement_commitment != 0field);

        let confirmed: payment_intent = payment_intent {
            owner: intent.owner,
            provider: intent.provider,
            listing_id: intent.listing_id,
            intent_id: intent.intent_id,
            amount_microcredits: intent.amount_microcredits,
            payment_commitment: settlement_commitment,
            status: 2u8,
        };

        return confirmed;
    }

    transition cancel_payment(intent: payment_intent) -> payment_intent {
        assert(intent.owner == self.caller);
        assert(intent.status == 1u8);

        let canceled: payment_intent = payment_intent {
            owner: intent.owner,
            provider: intent.provider,
            listing_id: intent.listing_id,
            intent_id: intent.intent_id,
            amount_microcredits: intent.amount_microcredits,
            payment_commitment: intent.payment_commitment,
            status: 3u8,
        };

        return canceled;
    }
}
