/**
 * Aura Protocol API Client
 * Centralized API communication for all frontend requests
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
 * Health Check API
 */
export const healthApi = {
  check: async () => {
    return apiCall('/health');
  },
};

/**
 * Marketplace API
 */
export const marketplaceApi = {
  getListings: async (filters?: { dataType?: string; available?: boolean }) => {
    const params = new URLSearchParams();
    if (filters?.dataType) params.append('dataType', filters.dataType);
    if (filters?.available !== undefined) params.append('available', String(filters.available));
    
    const query = params.toString();
    return apiCall(`/marketplace/listings${query ? `?${query}` : ''}`);
  },

  createListing: async (listing: {
    title: string;
    description: string;
    dataType: string;
    price: string;
    seller: string;
  }) => {
    return apiCall('/marketplace/listings', {
      method: 'POST',
      body: JSON.stringify(listing),
    });
  },
};

/**
 * Commitments API
 */
export const commitmentsApi = {
  getProfile: async () => {
    return apiCall('/commitments/profile');
  },

  query: async (params?: Record<string, string>) => {
    const searchParams = new URLSearchParams(params);
    const query = searchParams.toString();
    return apiCall(`/commitments/query${query ? `?${query}` : ''}`);
  },
};

/**
 * Programs API
 */
export const programsApi = {
  getPrograms: async () => {
    return apiCall('/programs');
  },

  getArchitecture: async () => {
    return apiCall('/flow/architecture');
  },
};

/**
 * Payloads API
 */
export const payloadsApi = {
  createProfilePayload: async (data: Record<string, unknown>) => {
    return apiCall('/payloads/profile/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  createMarketPayload: async (data: Record<string, unknown>) => {
    return apiCall('/payloads/market/create-listing', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  createPaymentPayload: async (data: Record<string, unknown>) => {
    return apiCall('/payloads/payment/create-intent', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  createTicketPayload: async (data: Record<string, unknown>) => {
    return apiCall('/payloads/ticket/issue', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  settleInference: async (data: Record<string, unknown>) => {
    return apiCall('/payloads/inference/settle', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Create an error handler for API responses
 */
export function handleApiError(response: ApiResponse<unknown>): string {
  if (!response.success) {
    return response.details ? `${response.error}: ${response.details}` : response.error || 'Unknown error';
  }
  return '';
}

/**
 * Export all API modules
 */
export const api = {
  health: healthApi,
  marketplace: marketplaceApi,
  commitments: commitmentsApi,
  programs: programsApi,
  payloads: payloadsApi,
};

export default api;
