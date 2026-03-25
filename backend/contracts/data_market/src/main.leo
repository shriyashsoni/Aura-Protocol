// Data Market — Aura Protocol
// Catalogues private dataset listings. Content is hidden; only identifiers and pricing are on-chain.

program data_market.aleo;

// status values: 1u8 = active, 2u8 = sold-out, 3u8 = closed
record listing:
    owner as address.private;
    listing_id as field.private;
    profile_id as field.private;
    profile_root_commitment as field.private;
    feature_schema_commitment as field.private;
    access_price_microcredits as u64.private;
    inference_quota as u32.private;
    status as u8.private;

// Create a new dataset listing.
// Inputs:
//   r0 = listing_id (non-zero)
//   r1 = profile_id (non-zero — must correspond to a registered profile)
//   r2 = profile_root_commitment
//   r3 = feature_schema_commitment
//   r4 = access_price_microcredits (> 0)
//   r5 = inference_quota (> 0)
function create_listing:
    input r0 as field.private;
    input r1 as field.private;
    input r2 as field.private;
    input r3 as field.private;
    input r4 as u64.private;
    input r5 as u32.private;
    is.neq r0 0field into r6;
    assert.eq r6 true;
    is.neq r1 0field into r7;
    assert.eq r7 true;
    gt r4 0u64 into r8;
    assert.eq r8 true;
    gt r5 0u32 into r9;
    assert.eq r9 true;
    cast self.caller r0 r1 r2 r3 r4 r5 1u8 into r10 as listing.record;
    output r10 as listing.record;

// Update the price or quota on an existing active listing.
function update_listing:
    input r0 as listing.record;
    input r1 as field.private;
    input r2 as u64.private;
    input r3 as u32.private;
    is.eq r0.owner self.caller into r4;
    assert.eq r4 true;
    is.eq r0.status 1u8 into r5;
    assert.eq r5 true;
    gt r2 0u64 into r6;
    assert.eq r6 true;
    gt r3 0u32 into r7;
    assert.eq r7 true;
    cast r0.owner r0.listing_id r0.profile_id r0.profile_root_commitment r1 r2 r3 r0.status into r8 as listing.record;
    output r8 as listing.record;

// Permanently close a listing (status → 3).
function close_listing:
    input r0 as listing.record;
    is.eq r0.owner self.caller into r1;
    assert.eq r1 true;
    is.eq r0.status 1u8 into r2;
    assert.eq r2 true;
    cast r0.owner r0.listing_id r0.profile_id r0.profile_root_commitment r0.feature_schema_commitment r0.access_price_microcredits r0.inference_quota 3u8 into r3 as listing.record;
    output r3 as listing.record;
