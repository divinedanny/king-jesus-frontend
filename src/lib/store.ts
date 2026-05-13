import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, ShippingAddress, ShippingRate } from '@/types';

interface CartState {
  items: CartItem[];
  currency: 'NGN' | 'USD';
  shippingAddress: ShippingAddress | null;
  shippingRate: ShippingRate | null;
  
  // Actions
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCurrency: (currency: 'NGN' | 'USD') => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setShippingRate: (rate: ShippingRate) => void;
  
  // Computed
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      currency: 'NGN',
      shippingAddress: null,
      shippingRate: null,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({
          items: [],
          shippingAddress: null,
          shippingRate: null,
        });
      },

      setCurrency: (currency) => {
        set({ currency });
      },

      setShippingAddress: (address) => {
        set({ shippingAddress: address });
      },

      setShippingRate: (rate) => {
        set({ shippingRate: rate });
      },

      getSubtotal: () => {
        const { items, currency } = get();
        return items
          .filter((item) => item.product.currency === currency)
          .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shippingCost = get().shippingRate?.price || 0;
        return subtotal + shippingCost;
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'king-jesus-cart',
      partialize: (state) => ({
        items: state.items,
        currency: state.currency,
      }),
    }
  )
);