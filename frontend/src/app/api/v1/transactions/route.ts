import { NextResponse } from "next/server";

// In-memory store for transactions (resets on cold start — fine for demo)
const transactions: unknown[] = [];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userAddress = searchParams.get("userAddress");
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);

  let results = [...transactions] as Record<string, unknown>[];
  if (userAddress) results = results.filter((t) => t.userAddress === userAddress);
  if (type) results = results.filter((t) => t.type === type);
  if (status) results = results.filter((t) => t.status === status);
  results = results.slice(0, limit);

  return NextResponse.json({ ok: true, data: results });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const tx = {
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      ...body,
    };
    transactions.push(tx);
    return NextResponse.json({ ok: true, data: tx });
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}
