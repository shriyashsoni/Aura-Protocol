import { NextResponse } from "next/server";
import { buildProfileCommitments } from "@/lib/commitments";
import { z } from "zod";

const Schema = z.object({
  profileId: z.string().min(1),
  ageBucket: z.union([z.string(), z.number()]),
  region: z.union([z.string(), z.number()]),
  behaviorFingerprint: z.union([z.string(), z.number()]),
  kycTier: z.union([z.string(), z.number()]),
  nonce: z.union([z.string(), z.number()]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    const output = buildProfileCommitments(parsed.data);
    return NextResponse.json({ ok: true, output });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
