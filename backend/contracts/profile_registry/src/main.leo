// Profile Registry — Aura Protocol
// Stores zero-knowledge demographic commitments for user identities.

program profile_registry.aleo;

record profile_commitment:
    owner as address.private;
    profile_id as field.private;
    age_bucket_commitment as field.private;
    region_commitment as field.private;
    behavior_commitment as field.private;
    kyc_commitment as field.private;
    nonce as field.private;

// Register a new ZK identity profile on-chain.
// Inputs:
//   r0 = profile_id (non-zero field)
//   r1 = age_bucket_commitment
//   r2 = region_commitment
//   r3 = behavior_commitment
//   r4 = kyc_commitment
//   r5 = nonce (non-zero field, acts as anti-replay)
function register_profile:
    input r0 as field.private;
    input r1 as field.private;
    input r2 as field.private;
    input r3 as field.private;
    input r4 as field.private;
    input r5 as field.private;
    is.neq r0 0field into r6;
    assert.eq r6 true;
    is.neq r5 0field into r7;
    assert.eq r7 true;
    cast self.caller r0 r1 r2 r3 r4 r5 into r8 as profile_commitment.record;
    output r8 as profile_commitment.record;

// Rotate the commitments on an existing identity (re-key).
// Inputs:
//   r0 = existing profile_commitment record
//   r1..r4 = new commitment values
//   r5 = new nonce (must differ from old nonce)
function rotate_profile:
    input r0 as profile_commitment.record;
    input r1 as field.private;
    input r2 as field.private;
    input r3 as field.private;
    input r4 as field.private;
    input r5 as field.private;
    is.eq r0.owner self.caller into r6;
    assert.eq r6 true;
    is.neq r5 r0.nonce into r7;
    assert.eq r7 true;
    cast self.caller r0.profile_id r1 r2 r3 r4 r5 into r8 as profile_commitment.record;
    output r8 as profile_commitment.record;
