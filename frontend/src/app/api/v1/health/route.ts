import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Aura Protocol Marketplace API',
    environment: process.env.NODE_ENV || 'development',
  });
}
