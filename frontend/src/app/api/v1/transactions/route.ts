import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export interface Transaction {
  id: string;
  type: 'profile_creation' | 'marketplace_listing' | 'payment' | 'ticket' | 'inference' | 'unknown';
  userAddress: string;
  amount?: string;
  status: 'pending' | 'confirmed' | 'failed';
  transactionHash?: string;
  timestamp: string;
  details: Record<string, unknown>;
  blockNumber?: number;
  gasUsed?: string;
}

// In-memory transaction store (replace with database in production)
const transactionStore: Transaction[] = [
  {
    id: 'tx_001',
    type: 'profile_creation',
    userAddress: 'aleo1user001',
    status: 'confirmed',
    transactionHash: '0xabc123def456',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    details: {
      profileId: 'profile_001',
      ageBucket: '25-35',
      region: 'US',
    },
    blockNumber: 100,
    gasUsed: '150000',
  },
  {
    id: 'tx_002',
    type: 'marketplace_listing',
    userAddress: 'aleo1seller001',
    amount: '1000u64',
    status: 'confirmed',
    transactionHash: '0xdef456ghi789',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    details: {
      listingId: 'listing_001',
      title: 'Consumer Behavior Dataset',
      price: '1000u64',
    },
    blockNumber: 95,
    gasUsed: '200000',
  },
  {
    id: 'tx_003',
    type: 'payment',
    userAddress: 'aleo1buyer001',
    amount: '500u64',
    status: 'confirmed',
    transactionHash: '0xghi789jkl012',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    details: {
      recipientAddress: 'aleo1seller001',
      paymentReason: 'data_purchase',
    },
    blockNumber: 90,
    gasUsed: '120000',
  },
];

/**
 * GET /api/v1/transactions
 * Fetch transaction history with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userAddress = searchParams.get('userAddress');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;

    let filtered = [...transactionStore];

    // Filter by user address
    if (userAddress) {
      filtered = filtered.filter((tx) => tx.userAddress === userAddress);
    }

    // Filter by transaction type
    if (type) {
      filtered = filtered.filter((tx) => tx.type === type);
    }

    // Filter by status
    if (status) {
      filtered = filtered.filter((tx) => tx.status === status);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply limit
    filtered = filtered.slice(0, limit);

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
        error: 'Failed to fetch transactions',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/transactions
 * Create a new transaction record (called after on-chain execution)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { type, userAddress, status, transactionHash, details } = body;

    if (!type || !userAddress || !status || !details) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: type, userAddress, status, details',
        },
        { status: 400 }
      );
    }

    // Create new transaction record
    const newTransaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      type: type as Transaction['type'],
      userAddress,
      status: status as Transaction['status'],
      transactionHash,
      timestamp: new Date().toISOString(),
      details,
      amount: body.amount,
      blockNumber: body.blockNumber,
      gasUsed: body.gasUsed,
    };

    // Store transaction (in production, save to database)
    transactionStore.push(newTransaction);

    return NextResponse.json(
      {
        success: true,
        data: newTransaction,
        message: 'Transaction recorded successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to record transaction',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
