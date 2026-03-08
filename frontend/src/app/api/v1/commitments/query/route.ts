import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { commitment } from '@/lib/commitments';

const querySchema = z.object({
digest: z.string().min(1),
nonce: z.string().min(1),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
    const parsed = querySchema.safeParse(body);
    if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query payload", issues: parsed.error.issues }, { status: 400 });
    }
    
    const queryCommitment = commitment("query", parsed.data);
    return NextResponse.json({ queryCommitment });
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}
