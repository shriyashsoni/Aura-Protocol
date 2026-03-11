import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export interface DeployedProgram {
  id: string;
  name: string;
  description: string;
  address: string;
  status: 'deployed' | 'active' | 'inactive';
  deployedAt: string;
  functions: string[];
  version: string;
  network: string;
}

export function GET() {
  const deployedPrograms: DeployedProgram[] = [
    {
      id: 'profile-registry',
      name: 'Profile Registry',
      description: 'User profile and commitment management for privacy-preserving attributes',
      address: config.programs.profileRegistry,
      status: 'active',
      deployedAt: '2024-01-15T10:30:00Z',
      functions: ['register_profile', 'update_commitments', 'query_profile', 'verify_commitment'],
      version: '1.0.0',
      network: config.aleoNetwork,
    },
    {
      id: 'data-market',
      name: 'Data Marketplace',
      description: 'Decentralized marketplace for buying and selling data assets',
      address: config.programs.dataMarket,
      status: 'active',
      deployedAt: '2024-01-20T14:45:00Z',
      functions: ['create_listing', 'purchase_listing', 'list_listings', 'get_listing_details'],
      version: '1.0.0',
      network: config.aleoNetwork,
    },
    {
      id: 'access-ticketing',
      name: 'Access Ticketing System',
      description: 'Manages access tickets and permissions for data and services',
      address: config.programs.accessTicketing,
      status: 'active',
      deployedAt: '2024-02-01T09:00:00Z',
      functions: ['issue_ticket', 'verify_ticket', 'revoke_ticket', 'query_tickets'],
      version: '1.0.0',
      network: config.aleoNetwork,
    },
    {
      id: 'inference-settlement',
      name: 'Inference Settlement',
      description: 'Handles settlement and payment for AI inference operations',
      address: config.programs.inferenceSettlement,
      status: 'active',
      deployedAt: '2024-02-05T16:20:00Z',
      functions: ['submit_inference', 'settle_payment', 'query_results', 'claim_rewards'],
      version: '1.0.0',
      network: config.aleoNetwork,
    },
    {
      id: 'payment-router',
      name: 'Payment Router',
      description: 'Routes and manages payments across different asset types',
      address: config.programs.paymentRouter,
      status: 'active',
      deployedAt: '2024-02-10T11:15:00Z',
      functions: ['create_payment', 'execute_payment', 'query_balance', 'withdraw'],
      version: '1.0.0',
      network: config.aleoNetwork,
    },
  ];

  return NextResponse.json({
    success: true,
    data: deployedPrograms,
    count: deployedPrograms.length,
    network: config.aleoNetwork,
    rpcUrl: config.aleoRpcUrl,
    timestamp: new Date().toISOString(),
  });
}
