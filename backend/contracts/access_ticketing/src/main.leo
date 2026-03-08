program access_ticketing.aleo {
    @noupgrade
    async constructor() {}

    record ticket {
        owner: address,
        provider: address,
        listing_id: field,
        payment_intent_id: field,
        query_commitment: field,
        paid_microcredits: u64,
        expires_at_epoch: u32,
        state: u8,
    }

    transition issue_ticket(
        provider: address,
        listing_id: field,
        payment_intent_id: field,
        query_commitment: field,
        paid_microcredits: u64,
        expires_at_epoch: u32
    ) -> ticket {
        assert(listing_id != 0field);
        assert(payment_intent_id != 0field);
        assert(query_commitment != 0field);
        assert(paid_microcredits > 0u64);

        let t: ticket = ticket {
            owner: self.caller,
            provider: provider,
            listing_id: listing_id,
            payment_intent_id: payment_intent_id,
            query_commitment: query_commitment,
            paid_microcredits: paid_microcredits,
            expires_at_epoch: expires_at_epoch,
            state: 1u8,
        };

        return t;
    }

    transition mark_consumed(t: ticket) -> ticket {
        assert(t.provider == self.caller);
        assert(t.state == 1u8);

        let consumed: ticket = ticket {
            owner: t.owner,
            provider: t.provider,
            listing_id: t.listing_id,
            payment_intent_id: t.payment_intent_id,
            query_commitment: t.query_commitment,
            paid_microcredits: t.paid_microcredits,
            expires_at_epoch: t.expires_at_epoch,
            state: 2u8,
        };

        return consumed;
    }

    transition mark_expired(t: ticket, current_epoch: u32) -> ticket {
        assert(t.owner == self.caller);
        assert(current_epoch > t.expires_at_epoch);
        assert(t.state == 1u8);

        let expired: ticket = ticket {
            owner: t.owner,
            provider: t.provider,
            listing_id: t.listing_id,
            payment_intent_id: t.payment_intent_id,
            query_commitment: t.query_commitment,
            paid_microcredits: t.paid_microcredits,
            expires_at_epoch: t.expires_at_epoch,
            state: 3u8,
        };

        return expired;
    }
}
