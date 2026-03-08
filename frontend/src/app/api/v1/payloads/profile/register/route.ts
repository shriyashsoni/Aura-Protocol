import { NextResponse, NextRequest } from 'next/server';
import { z } from 'zod';
import { config } from '@/lib/config';

const fieldLike = z.string().min(1);

const template = (programId: string, functionName: string, inputs: Record<string, string|number|boolean>) => {
return {
network: config.aleoNetwork,
programId,
functionName,
inputs,
};
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
    const parsed = z.object({
    profileId: fieldLike,
    ageBucketCommitment: fieldLike,
    regionCommitment: fieldLike,
    behaviorCommitment: fieldLike,
    kycCommitment: fieldLike,
    nonce: fieldLike,
    }).safeParse(body);
    
    if (!parsed.success) {
    return NextResponse.json({ error: "Invalid register profile payload", issues: parsed.error.issues }, { status: 400 });
    }
    
    return NextResponse.json(template(config.programs.profileRegistry, "register_profile", parsed.data));
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}
