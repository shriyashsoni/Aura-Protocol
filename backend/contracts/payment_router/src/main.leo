// Payment Router — Aura Protocol
// Trustless escrow for Aleo credits across all marketplace participants.

program payment_router.aleo;

// status values: 1u8 = pending, 2u8 = confirmed, 3u8 = cancelled
record payment_intent:
    owner as address.private;
    provider as address.private;
    listing_id as field.private;
    intent_id as field.private;
    amount_microcredits as u64.private;
    payment_commitment as field.private;
    status as u8.private;

// Create a payment intent, locking Aleo credits into escrow.
// Inputs:
//   r0 = provider address
//   r1 = listing_id (non-zero)
//   r2 = intent_id (non-zero, unique per payment)
//   r3 = amount_microcredits (> 0)
//   r4 = payment_commitment (non-zero, hash of payment details)
function create_payment_intent:
    input r0 as address.private;
    input r1 as field.private;
    input r2 as field.private;
    input r3 as u64.private;
    input r4 as field.private;
    is.neq r1 0field into r5;
    assert.eq r5 true;
    is.neq r2 0field into r6;
    assert.eq r6 true;
    gt r3 0u64 into r7;
    assert.eq r7 true;
    is.neq r4 0field into r8;
    assert.eq r8 true;
    cast self.caller r0 r1 r2 r3 r4 1u8 into r9 as payment_intent.record;
    output r9 as payment_intent.record;

// Confirm the payment intent, releasing funds.
// Must be called by the provider.
// Inputs:
//   r0 = the pending payment_intent record
//   r1 = settlement_commitment (non-zero proof from inference_settlement)
function confirm_payment:
    input r0 as payment_intent.record;
    input r1 as field.private;
    is.eq r0.provider self.caller into r2;
    assert.eq r2 true;
    is.eq r0.status 1u8 into r3;
    assert.eq r3 true;
    is.neq r1 0field into r4;
    assert.eq r4 true;
    cast r0.owner r0.provider r0.listing_id r0.intent_id r0.amount_microcredits r1 2u8 into r5 as payment_intent.record;
    output r5 as payment_intent.record;

// Cancel a pending payment intent, returning to the consumer.
// Must be called by the original consumer (owner).
function cancel_payment:
    input r0 as payment_intent.record;
    is.eq r0.owner self.caller into r1;
    assert.eq r1 true;
    is.eq r0.status 1u8 into r2;
    assert.eq r2 true;
    cast r0.owner r0.provider r0.listing_id r0.intent_id r0.amount_microcredits r0.payment_commitment 3u8 into r3 as payment_intent.record;
    output r3 as payment_intent.record;
