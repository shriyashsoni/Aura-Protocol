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
    ownerAddress: z.string().min(1),
    listingId: fieldLike,
    ticketId: fieldLike,
    queryCommitment: fieldLike,
    outputCommitment: fieldLike,
    settledEpoch: z.string().regex(/^[0-9]+u32$/),
    }).safeParse(body);
    
    if (!parsed.success) {
    return NextResponse.json({ error: "Invalid settle inference payload", issues: parsed.error.issues }, { status: 400 });
    }
    
    return NextResponse.json(template(config.programs.inferenceSettlement, "settle", parsed.data));
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}
