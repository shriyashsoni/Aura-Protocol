import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { config } from '@/lib/config';

const fieldLike = z.string().min(1);
const template = (programId: string, functionName: string, inputs: Record<string, string|number|boolean>) => {
return { network: config.aleoNetwork, programId, functionName, inputs };
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
    const parsed = z.object({
    providerAddress: z.string().min(1),
    listingId: fieldLike,
    intentId: fieldLike,
    amountMicrocredits: z.string().regex(/^[0-9]+u64$/),
    paymentCommitment: fieldLike,
    }).safeParse(body);
    
    if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payment intent payload", issues: parsed.error.issues }, { status: 400 });
    }
    
    return NextResponse.json(template(config.programs.paymentRouter, "create_payment_intent", parsed.data));
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}
