// Theme configuration for King Jesus Collection
export const theme = {
  colors: {
    primary: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    },
    gold: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    background: '#ffffff',
    foreground: '#171717',
    muted: '#f4f4f5',
    mutedForeground: '#71717a',
    border: '#e4e4e7',
    ring: '#22c55e',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// WhatsApp configuration
export const whatsappConfig = {
  phoneNumber: '2347049497394',
  getMessageLink: (message: string) => 
    `https://wa.me/${whatsappConfig.phoneNumber}?text=${encodeURIComponent(message)}`,
  formatOrderMessage: (order: {
    name: string;
    items: Array<{ name: string; quantity: number }>;
    total: number;
    currency: string;
    address: string;
  }) => {
    const itemsList = order.items
      .map(item => `- ${item.name} x ${item.quantity}`)
      .join('\n');
    return `New Order from ${order.name}:
Items:
${itemsList}
Total: ${order.total} ${order.currency}
Shipping Address: ${order.address}`;
  },
};

// API configuration - points to Django backend
export const apiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://king-jesus-backend.onrender.com',
  endpoints: {
    // Products & Categories (from core/urls.py router)
    products: '/api/products/',
    productDetail: (id: string) => `/api/products/${id}/`,
    categories: '/api/categories/',
    
    // Checkout (from core/urls.py)
    calculateShipping: '/api/checkout/calculate-shipping/',
    createOrder: '/api/checkout/create-order/',
    whatsappOrder: '/api/checkout/whatsapp-order/',
    
    // Payments webhooks
    paystackWebhook: '/api/payments/paystack/webhook/',
    stripeWebhook: '/api/payments/stripe/webhook/',
    
    // Tracking
    tracking: (trackingNumber: string) => `/api/tracking/${trackingNumber}/`,
    
    // Auth (from config/urls.py)
    auth: {
      googleLogin: '/api/auth/google/',
      // dj-rest-auth endpoints
      login: '/api/auth/login/',
      logout: '/api/auth/logout/',
      registration: '/api/auth/registration/',
      userProfile: '/api/user/profile/',
    },
  },
};

// Currency formatting
export const formatCurrency = (amount: number, currency: 'NGN' | 'USD') => {
  return new Intl.NumberFormat(currency === 'NGN' ? 'en-NG' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};