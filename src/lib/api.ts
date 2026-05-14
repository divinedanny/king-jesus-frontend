import { apiConfig } from './config';
import { Product, Category, User, Review, Wishlist } from '@/types';

class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new ApiError(errorData.detail || errorData.error || 'API request failed', response.status);
  }
  return response.json();
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${apiConfig.baseUrl}${endpoint}`;
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error. Please check your connection.', 0);
  }
}

// Products API - Django REST Framework format
export const productsApi = {
  // GET /api/products/ - returns { count, next, previous, results }
  getAll: async (params?: {
    category?: string;
    search?: string;
    page?: number;
  }): Promise<{ count: number; next: string | null; previous: string | null; results: Product[] }> => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.page) searchParams.set('page', params.page.toString());
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `${apiConfig.endpoints.products}?${queryString}` : apiConfig.endpoints.products;
    
    return fetchApi(endpoint);
  },

  // GET /api/products/{id}/
  getById: async (id: string): Promise<Product> => {
    return fetchApi<Product>(apiConfig.endpoints.productDetail(id));
  },

  // GET /api/categories/ - returns { count, next, previous, results }
  getCategories: async (): Promise<{ count: number; next: string | null; previous: string | null; results: Category[] }> => {
    return fetchApi(apiConfig.endpoints.categories);
  },
};

// Auth API - dj-rest-auth + custom Google
export const authApi = {
  // POST /api/auth/google/ - Custom Google OAuth
  googleLogin: async (idToken: string): Promise<{ user: User; token: string }> => {
    return fetchApi<{ user: User; token: string }>(
      apiConfig.endpoints.auth.googleLogin,
      {
        method: 'POST',
        body: JSON.stringify({ id_token: idToken }),
      }
    );
  },

  // GET /api/user/profile/ - User profile (requires auth)
  getProfile: async (): Promise<User> => {
    return fetchApi<User>(apiConfig.endpoints.auth.userProfile);
  },

  // POST /api/auth/logout/
  logout: async (): Promise<void> => {
    await fetchApi(apiConfig.endpoints.auth.logout, {
      method: 'POST',
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  clearToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },
};

// Shipping API
export const shippingApi = {
  calculateRates: async (params: {
    address: {
      city: string;
      state: string;
      country: string;
    };
    items: Array<{
      product_id: string;
      quantity: number;
    }>;
  }): Promise<any> => {
    return fetchApi(apiConfig.endpoints.calculateShipping, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
};

// Checkout API
export const checkoutApi = {
  createOrder: async (params: {
    items: Array<{ product_id: string; quantity: number; price: number }>;
    shipping_address: {
      first_name: string;
      last_name: string;
      address_line1: string;
      address_line2?: string;
      city: string;
      state: string;
      country: string;
      phone_number: string;
      email: string;
    };
    shipping_rate_id: string;
    payment_method: 'Paystack' | 'Stripe';
    currency: string;
    total_amount: number;
  }): Promise<any> => {
    return fetchApi(apiConfig.endpoints.createOrder, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  createWhatsAppOrder: async (params: {
    items: Array<{ product_id: string; quantity: number; price: number }>;
    shipping_address: {
      first_name: string;
      last_name: string;
      address_line1: string;
      address_line2?: string;
      city: string;
      state: string;
      country: string;
      phone_number: string;
      email: string;
    };
    currency: string;
    total_amount: number;
  }): Promise<any> => {
    return fetchApi(apiConfig.endpoints.whatsappOrder, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
};

// Orders API
export const ordersApi = {
  getAll: async (): Promise<any[]> => {
    return fetchApi(apiConfig.endpoints.orders);
  },
  getById: async (id: string): Promise<any> => {
    return fetchApi(`${apiConfig.endpoints.orders}${id}/`);
  },
};

// Tracking API
export const trackingApi = {
  getStatus: async (trackingNumber: string): Promise<any> => {
    return fetchApi(apiConfig.endpoints.tracking(trackingNumber));
  },
};

// Reviews API
export const reviewsApi = {
  getByProduct: async (productId: string): Promise<Review[]> => {
    return fetchApi<Review[]>(`${apiConfig.endpoints.reviews}?product=${productId}`);
  },
  create: async (data: { product: string; rating: number; comment: string }): Promise<Review> => {
    return fetchApi<Review>(apiConfig.endpoints.reviews, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Wishlist API
export const wishlistApi = {
  get: async (): Promise<Wishlist[]> => {
    return fetchApi<Wishlist[]>(apiConfig.endpoints.wishlist);
  },
  addProduct: async (productId: string): Promise<void> => {
    await fetchApi(`${apiConfig.endpoints.wishlist}add_product/`, {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  },
  removeProduct: async (productId: string): Promise<void> => {
    await fetchApi(`${apiConfig.endpoints.wishlist}remove_product/`, {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
  },
};

export { ApiError };
export default {
  products: productsApi,
  auth: authApi,
  shipping: shippingApi,
  checkout: checkoutApi,
  orders: ordersApi,
  tracking: trackingApi,
  reviews: reviewsApi,
  wishlist: wishlistApi,
};
