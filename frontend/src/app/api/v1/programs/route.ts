import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export function GET() {
  return NextResponse.json(config.programs);
}
