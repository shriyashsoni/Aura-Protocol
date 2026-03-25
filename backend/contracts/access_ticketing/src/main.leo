// Access Ticketing — Aura Protocol
// Mints proof-of-purchase tickets that grant rights to query a specific dataset.

program access_ticketing.aleo;

// state values: 1u8 = active, 2u8 = consumed, 3u8 = expired
record ticket:
    owner as address.private;
    provider as address.private;
    listing_id as field.private;
    payment_intent_id as field.private;
    query_commitment as field.private;
    paid_microcredits as u64.private;
    expires_at_epoch as u32.private;
    state as u8.private;

// Issue a new access ticket to a consumer.
// Called by the data provider after payment is verified.
// Inputs:
//   r0 = consumer address (ticket owner)
//   r1 = listing_id (non-zero)
//   r2 = payment_intent_id (non-zero)
//   r3 = query_commitment (non-zero)
//   r4 = paid_microcredits (> 0)
//   r5 = expires_at_epoch
function issue_ticket:
    input r0 as address.private;
    input r1 as field.private;
    input r2 as field.private;
    input r3 as field.private;
    input r4 as u64.private;
    input r5 as u32.private;
    is.neq r1 0field into r6;
    assert.eq r6 true;
    is.neq r2 0field into r7;
    assert.eq r7 true;
    is.neq r3 0field into r8;
    assert.eq r8 true;
    gt r4 0u64 into r9;
    assert.eq r9 true;
    cast self.caller r0 r1 r2 r3 r4 r5 1u8 into r10 as ticket.record;
    output r10 as ticket.record;

// Mark a ticket as consumed after the compute node runs inference.
// Must be called by the provider (self.caller == provider).
function mark_consumed:
    input r0 as ticket.record;
    is.eq r0.provider self.caller into r1;
    assert.eq r1 true;
    is.eq r0.state 1u8 into r2;
    assert.eq r2 true;
    cast r0.owner r0.provider r0.listing_id r0.payment_intent_id r0.query_commitment r0.paid_microcredits r0.expires_at_epoch 2u8 into r3 as ticket.record;
    output r3 as ticket.record;

// Mark a ticket as expired when the epoch has passed.
// Must be called by the ticket owner with current epoch proof.
function mark_expired:
    input r0 as ticket.record;
    input r1 as u32.private;
    is.eq r0.owner self.caller into r2;
    assert.eq r2 true;
    gt r1 r0.expires_at_epoch into r3;
    assert.eq r3 true;
    is.eq r0.state 1u8 into r4;
    assert.eq r4 true;
    cast r0.owner r0.provider r0.listing_id r0.payment_intent_id r0.query_commitment r0.paid_microcredits r0.expires_at_epoch 3u8 into r5 as ticket.record;
    output r5 as ticket.record;
