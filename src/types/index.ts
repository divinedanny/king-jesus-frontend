// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: 'NGN' | 'USD';
  stock_quantity: number;
  images: string[];
  category: Category;
  category_id: string;
  average_rating?: number;
  review_count?: number;
  reviews?: Review[];
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user: User;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Wishlist {
  id: string;
  user_id: string;
  products: Product[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  currency: 'NGN' | 'USD';
}

// Shipping Types
export interface ShippingAddress {
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  country: string;
  phone_number: string;
  email?: string;
}

export interface ShippingRate {
  id: string;
  carrier: string;
  service: string;
  price: number;
  currency: 'NGN' | 'USD';
  estimated_days: number;
}

// Order Types
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'paystack' | 'stripe' | 'whatsapp';

export interface Order {
  id: string;
  user_id?: string;
  items: OrderItem[];
  total_amount: number;
  subtotal: number;
  shipping_cost: number;
  currency: 'NGN' | 'USD';
  status: OrderStatus;
  payment_method: PaymentMethod;
  shipping_address: ShippingAddress;
  terminal_africa_shipment_id?: string;
  tracking_number?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price_at_purchase: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  google_id?: string;
  is_staff: boolean;
  date_joined: string;
}

// Tracking Types
export interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location?: string;
  timestamp: string;
}

export interface TrackingInfo {
  tracking_number: string;
  shipment_id: string;
  carrier: string;
  status: string;
  estimated_delivery?: string;
  events: TrackingEvent[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    page_size: number;
    total_count: number;
    total_pages: number;
  };
}

// Checkout Types
export interface CheckoutSession {
  order_id: string;
  paystack_reference?: string;
  stripe_session_id?: string;
  whatsapp_link?: string;
  amount: number;
  currency: 'NGN' | 'USD';
}