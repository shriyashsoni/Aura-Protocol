import { NextResponse } from "next/server";

// Static sample marketplace listings — replace with on-chain data source as needed
const SAMPLE_LISTINGS = [
  {
    id: "medical_imaging_001",
    title: "Medical Imaging Dataset",
    description: "Anonymized DICOM scans for AI model training",
    dataType: "medical",
    price: "15000000",
    seller: "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc",
    createdAt: "2025-01-01T00:00:00Z",
    expiresAt: "2026-01-01T00:00:00Z",
    available: true,
  },
  {
    id: "financial_timeseries_q1",
    title: "Financial Timeseries Q1",
    description: "Aggregated market signals — no PII",
    dataType: "financial",
    price: "8000000",
    seller: "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc",
    createdAt: "2025-01-15T00:00:00Z",
    expiresAt: "2026-01-15T00:00:00Z",
    available: true,
  },
  {
    id: "satellite_imagery_batch_7",
    title: "Satellite Imagery Batch 7",
    description: "High-res remote sensing imagery",
    dataType: "imagery",
    price: "45000000",
    seller: "aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc",
    createdAt: "2025-02-01T00:00:00Z",
    expiresAt: "2026-02-01T00:00:00Z",
    available: true,
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dataType = searchParams.get("dataType");
  const available = searchParams.get("available");

  let listings = [...SAMPLE_LISTINGS];
  if (dataType) listings = listings.filter((l) => l.dataType === dataType);
  if (available !== null) {
    const avail = available === "true";
    listings = listings.filter((l) => l.available === avail);
  }

  return NextResponse.json({ ok: true, data: listings });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // In production, this would write to a database or on-chain
    return NextResponse.json({
      ok: true,
      data: {
        ...body,
        id: body.title?.toLowerCase().replace(/\s+/g, "_") ?? "new_listing",
        createdAt: new Date().toISOString(),
        available: true,
      },
    });
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
}
