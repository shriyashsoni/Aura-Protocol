program inference_settlement.aleo {
    @noupgrade
    async constructor() {}

    record inference_receipt {
        owner: address,
        provider: address,
        listing_id: field,
        ticket_id: field,
        query_commitment: field,
        output_commitment: field,
        settled_epoch: u32,
    }

    transition settle(
        owner: address,
        listing_id: field,
        ticket_id: field,
        query_commitment: field,
        output_commitment: field,
        settled_epoch: u32
    ) -> inference_receipt {
        assert(listing_id != 0field);
        assert(ticket_id != 0field);
        assert(query_commitment != 0field);
        assert(output_commitment != 0field);

        let receipt: inference_receipt = inference_receipt {
            owner: owner,
            provider: self.caller,
            listing_id: listing_id,
            ticket_id: ticket_id,
            query_commitment: query_commitment,
            output_commitment: output_commitment,
            settled_epoch: settled_epoch,
        };

        return receipt;
    }

    transition attest_receipt(receipt: inference_receipt, verifier_note: field) -> field {
        assert(receipt.owner == self.caller || receipt.provider == self.caller);
        assert(verifier_note != 0field);

        return verifier_note;
    }
}
