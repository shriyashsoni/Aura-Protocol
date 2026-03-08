program confidential_ai_marketplace.aleo {
	@noupgrade
	async constructor() {}

	record demographic_profile {
		owner: address,
		age_bucket_commitment: field,
		region_commitment: field,
		behavior_commitment: field,
		kyc_commitment: field,
		profile_nonce: field,
	}

	record data_listing {
		owner: address,
		listing_id: field,
		profile_root_commitment: field,
		feature_schema_commitment: field,
		access_price_microcredits: u64,
		inference_quota: u32,
		status: u8,
	}

	record access_ticket {
		owner: address,
		provider: address,
		listing_id: field,
		query_commitment: field,
		paid_microcredits: u64,
		expires_at_epoch: u32,
	}

	record inference_receipt {
		owner: address,
		provider: address,
		listing_id: field,
		query_commitment: field,
		output_commitment: field,
		settled_epoch: u32,
	}

	transition register_profile(
		age_bucket_commitment: field,
		region_commitment: field,
		behavior_commitment: field,
		kyc_commitment: field,
		profile_nonce: field
	) -> demographic_profile {
		let profile: demographic_profile = demographic_profile {
			owner: self.caller,
			age_bucket_commitment: age_bucket_commitment,
			region_commitment: region_commitment,
			behavior_commitment: behavior_commitment,
			kyc_commitment: kyc_commitment,
			profile_nonce: profile_nonce,
		};

		return profile;
	}

	transition create_listing(
		profile: demographic_profile,
		listing_id: field,
		profile_root_commitment: field,
		feature_schema_commitment: field,
		access_price_microcredits: u64,
		inference_quota: u32
	) -> data_listing {
		assert(profile.owner == self.caller);
		assert(access_price_microcredits > 0u64);
		assert(inference_quota > 0u32);

		let listing: data_listing = data_listing {
			owner: self.caller,
			listing_id: listing_id,
			profile_root_commitment: profile_root_commitment,
			feature_schema_commitment: feature_schema_commitment,
			access_price_microcredits: access_price_microcredits,
			inference_quota: inference_quota,
			status: 1u8,
		};

		return listing;
	}

	transition buy_listing(
		listing: data_listing,
		payment_proof_commitment: field,
		query_commitment: field,
		expires_at_epoch: u32
	) -> access_ticket {
		assert(listing.status == 1u8);
		assert(payment_proof_commitment != 0field);

		let ticket: access_ticket = access_ticket {
			owner: self.caller,
			provider: listing.owner,
			listing_id: listing.listing_id,
			query_commitment: query_commitment,
			paid_microcredits: listing.access_price_microcredits,
			expires_at_epoch: expires_at_epoch,
		};

		return ticket;
	}

	transition settle_inference(
		ticket: access_ticket,
		output_commitment: field,
		settled_epoch: u32
	) -> inference_receipt {
		assert(ticket.provider == self.caller);

		let receipt: inference_receipt = inference_receipt {
			owner: ticket.owner,
			provider: self.caller,
			listing_id: ticket.listing_id,
			query_commitment: ticket.query_commitment,
			output_commitment: output_commitment,
			settled_epoch: settled_epoch,
		};

		return receipt;
	}
}
