program data_market.aleo {
    @noupgrade
    async constructor() {}

    record listing {
        owner: address,
        listing_id: field,
        profile_id: field,
        profile_root_commitment: field,
        feature_schema_commitment: field,
        access_price_microcredits: u64,
        inference_quota: u32,
        status: u8,
    }

    transition create_listing(
        listing_id: field,
        profile_id: field,
        profile_root_commitment: field,
        feature_schema_commitment: field,
        access_price_microcredits: u64,
        inference_quota: u32
    ) -> listing {
        assert(listing_id != 0field);
        assert(profile_id != 0field);
        assert(access_price_microcredits > 0u64);
        assert(inference_quota > 0u32);

        let row: listing = listing {
            owner: self.caller,
            listing_id: listing_id,
            profile_id: profile_id,
            profile_root_commitment: profile_root_commitment,
            feature_schema_commitment: feature_schema_commitment,
            access_price_microcredits: access_price_microcredits,
            inference_quota: inference_quota,
            status: 1u8,
        };

        return row;
    }

    transition update_listing(
        row: listing,
        next_feature_schema_commitment: field,
        next_access_price_microcredits: u64,
        next_inference_quota: u32
    ) -> listing {
        assert(row.owner == self.caller);
        assert(row.status == 1u8);
        assert(next_access_price_microcredits > 0u64);
        assert(next_inference_quota > 0u32);

        let next: listing = listing {
            owner: row.owner,
            listing_id: row.listing_id,
            profile_id: row.profile_id,
            profile_root_commitment: row.profile_root_commitment,
            feature_schema_commitment: next_feature_schema_commitment,
            access_price_microcredits: next_access_price_microcredits,
            inference_quota: next_inference_quota,
            status: row.status,
        };

        return next;
    }

    transition close_listing(row: listing) -> listing {
        assert(row.owner == self.caller);
        assert(row.status == 1u8);

        let closed: listing = listing {
            owner: row.owner,
            listing_id: row.listing_id,
            profile_id: row.profile_id,
            profile_root_commitment: row.profile_root_commitment,
            feature_schema_commitment: row.feature_schema_commitment,
            access_price_microcredits: row.access_price_microcredits,
            inference_quota: row.inference_quota,
            status: 3u8,
        };

        return closed;
    }
}
