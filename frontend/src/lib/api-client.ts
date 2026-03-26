/**
 * Aura Protocol API Client
 * Centralized API communication for all frontend requests.
 * Aligned with the standardized Aura V1 API routing.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

export interface MarketplaceListing {
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

/**
 * Generic fetch wrapper for API calls
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: `HTTP ${response.status}`,
      }));
      return {
        success: false,
        error: error.error || `Request failed with status ${response.status}`,
        details: error.details,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to make API request',
      details: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * [AURA V1] Standardized API Endpoints
 */

export const api = {
  health: {
    check: () => apiCall('/health'),
  },

  marketplace: {
    getListings: async (filters?: { dataType?: string; available?: boolean }) => {
      const params = new URLSearchParams();
      if (filters?.dataType) params.append('dataType', filters.dataType);
      if (filters?.available !== undefined) params.append('available', String(filters.available));
      const query = params.toString();
      return apiCall<MarketplaceListing[]>(`/marketplace/listings${query ? `?${query}` : ''}`);
    },
    // Payload for creating a listing on-chain
    createListingPayload: (data: Record<string, unknown>) => 
      apiCall('/payloads/market/create', { method: 'POST', body: JSON.stringify(data) }),
  },

  commitments: {
    // Generate ZK commitments for profile data
    generateProfile: (data: Record<string, unknown>) => 
      apiCall('/commitments/profile', { method: 'POST', body: JSON.stringify(data) }),
    
    // Query existing commitments on-chain (stubbed)
    query: (params?: Record<string, string>) => {
      const query = new URLSearchParams(params).toString();
      return apiCall(`/commitments/query${query ? `?${query}` : ''}`);
    },
  },

  payloads: {
    registerProfile: (data: Record<string, unknown>) => 
      apiCall('/payloads/profile/register', { method: 'POST', body: JSON.stringify(data) }),
    
    createPaymentIntent: (data: Record<string, unknown>) => 
      apiCall('/payloads/payment/intent', { method: 'POST', body: JSON.stringify(data) }),
    
    issueTicket: (data: Record<string, unknown>) => 
      apiCall('/payloads/ticket/issue', { method: 'POST', body: JSON.stringify(data) }),
    
    settleInference: (data: Record<string, unknown>) => 
      apiCall('/payloads/inference/settle', { method: 'POST', body: JSON.stringify(data) }),
  },

  programs: {
    getPrograms: () => apiCall<DeployedProgram[]>('/programs'),
    getArchitecture: () => apiCall('/flow/architecture'),
  },

  transactions: {
    getTransactions: (filters?: Record<string, string>) => {
      const query = new URLSearchParams(filters).toString();
      return apiCall<Transaction[]>(`/transactions${query ? `?${query}` : ''}`);
    },
    recordTransaction: (data: Record<string, unknown>) => 
      apiCall('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  },
};

export default api;
