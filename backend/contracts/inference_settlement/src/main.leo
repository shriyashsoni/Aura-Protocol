// Inference Settlement — Aura Protocol
// Bridges off-chain ML inference with on-chain verifiable receipts.

program inference_settlement.aleo;

record inference_receipt:
    owner as address.private;
    provider as address.private;
    listing_id as field.private;
    ticket_id as field.private;
    query_commitment as field.private;
    output_commitment as field.private;
    settled_epoch as u32.private;

// Settle an inference task on-chain, producing a verifiable receipt.
// Called by the compute node (self.caller = provider) with the user's address as r0.
// Inputs:
//   r0 = consumer address (receipt owner)
//   r1 = listing_id (non-zero)
//   r2 = ticket_id (non-zero)
//   r3 = query_commitment (non-zero)
//   r4 = output_commitment (non-zero, hash of model output)
//   r5 = settled_epoch
function settle:
    input r0 as address.private;
    input r1 as field.private;
    input r2 as field.private;
    input r3 as field.private;
    input r4 as field.private;
    input r5 as u32.private;
    is.neq r1 0field into r6;
    assert.eq r6 true;
    is.neq r2 0field into r7;
    assert.eq r7 true;
    is.neq r3 0field into r8;
    assert.eq r8 true;
    is.neq r4 0field into r9;
    assert.eq r9 true;
    cast r0 self.caller r1 r2 r3 r4 r5 into r10 as inference_receipt.record;
    output r10 as inference_receipt.record;

// Attest to a receipt by returning a commitment field value.
// Callable by either the consumer (owner) or the provider.
function attest_receipt:
    input r0 as inference_receipt.record;
    input r1 as field.private;
    is.eq r0.owner self.caller into r2;
    is.eq r0.provider self.caller into r3;
    or r2 r3 into r4;
    assert.eq r4 true;
    is.neq r1 0field into r5;
    assert.eq r5 true;
    output r1 as field.private;
