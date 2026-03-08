program profile_registry.aleo {
    @noupgrade
    async constructor() {}

    record profile_commitment {
        owner: address,
        profile_id: field,
        age_bucket_commitment: field,
        region_commitment: field,
        behavior_commitment: field,
        kyc_commitment: field,
        nonce: field,
    }

    transition register_profile(
        profile_id: field,
        age_bucket_commitment: field,
        region_commitment: field,
        behavior_commitment: field,
        kyc_commitment: field,
        nonce: field
    ) -> profile_commitment {
        assert(profile_id != 0field);
        assert(nonce != 0field);

        let profile: profile_commitment = profile_commitment {
            owner: self.caller,
            profile_id: profile_id,
            age_bucket_commitment: age_bucket_commitment,
            region_commitment: region_commitment,
            behavior_commitment: behavior_commitment,
            kyc_commitment: kyc_commitment,
            nonce: nonce,
        };

        return profile;
    }

    transition rotate_profile(
        current: profile_commitment,
        next_age_bucket_commitment: field,
        next_region_commitment: field,
        next_behavior_commitment: field,
        next_kyc_commitment: field,
        next_nonce: field
    ) -> profile_commitment {
        assert(current.owner == self.caller);
        assert(next_nonce != current.nonce);

        let next: profile_commitment = profile_commitment {
            owner: self.caller,
            profile_id: current.profile_id,
            age_bucket_commitment: next_age_bucket_commitment,
            region_commitment: next_region_commitment,
            behavior_commitment: next_behavior_commitment,
            kyc_commitment: next_kyc_commitment,
            nonce: next_nonce,
        };

        return next;
    }
}
