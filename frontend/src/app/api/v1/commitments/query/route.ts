import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  // Echo back query params as a simple demo commitment lookup
  const params = Object.fromEntries(searchParams.entries());
  return NextResponse.json({
    ok: true,
    data: {
      query: params,
      result: "No on-chain commitment found for query parameters",
    },
  });
}
