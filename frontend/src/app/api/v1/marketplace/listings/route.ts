import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface Listing {
  id: string;
  title: string;
  description: string;
  dataType: string;
  price: string;
  seller: string;
  createdAt: string;
  expiresAt: string;
  available: boolean;
}

// Mock marketplace listings - replace with database queries in production
const MOCK_LISTINGS: Listing[] = [
  {
    id: 'listing_001',
    title: 'Consumer Behavior Dataset',
    description: 'Anonymized consumer behavior patterns for retail analytics',
    dataType: 'dataset',
    price: '1000u64',
    seller: 'aleo1seller001',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 2592000000).toISOString(),
    available: true,
  },
  {
    id: 'listing_002',
    title: 'Market Sentiment Analysis',
    description: 'Real-time market sentiment indicators and analysis',
    dataType: 'analysis',
    price: '500u64',
    seller: 'aleo1seller002',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    expiresAt: new Date(Date.now() + 1814400000).toISOString(),
    available: true,
  },
  {
    id: 'listing_003',
    title: 'ML Model Inference Service',
    description: 'Pre-trained model for image classification and analysis',
    dataType: 'service',
    price: '750u64',
    seller: 'aleo1seller003',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    expiresAt: new Date(Date.now() + 1209600000).toISOString(),
    available: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dataType = searchParams.get('dataType');
    const available = searchParams.get('available');

    let filtered = [...MOCK_LISTINGS];

    if (dataType) {
      filtered = filtered.filter((l) => l.dataType === dataType);
    }

    if (available === 'true') {
      filtered = filtered.filter((l) => l.available && new Date(l.expiresAt) > new Date());
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      count: filtered.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch marketplace listings',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { title, description, dataType, price, seller } = body;

    if (!title || !description || !dataType || !price || !seller) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, description, dataType, price, seller',
        },
        { status: 400 }
      );
    }

    // Create new listing
    const newListing: Listing = {
      id: `listing_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      title,
      description,
      dataType,
      price,
      seller,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 2592000000).toISOString(), // 30 days
      available: true,
    };

    // In production, save to database
    MOCK_LISTINGS.push(newListing);

    return NextResponse.json(
      {
        success: true,
        data: newListing,
        message: 'Listing created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create listing',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
