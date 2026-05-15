import { create } from 'zustand';
import { Product, Category } from '@/types';
import { productsApi } from './api';

interface ProductState {
  products: Product[];
  categories: Category[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
    page: number;
  } | null;
  
  // Filters
  searchQuery: string;
  selectedCategory: string;
  
  // Actions
  fetchProducts: (params?: { page?: number; category?: string; search?: string }) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  clearError: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  categories: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  pagination: null,
  searchQuery: '',
  selectedCategory: 'all',

  fetchProducts: async (params) => {
    set({ isLoading: true, error: null });
    
    try {
      const { searchQuery, selectedCategory } = get();
      
      const response = await productsApi.getAll({
        search: (params?.search ?? searchQuery) || undefined,
        category: params?.category ?? (selectedCategory !== 'all' ? selectedCategory : undefined),
        page: params?.page,
      });
      
      set({
        products: response.results || [],
        pagination: {
          count: response.count,
          next: response.next,
          previous: response.previous,
          page: params?.page || 1,
        },
        isLoading: false,
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        isLoading: false,
      });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await productsApi.getCategories();
      set({ categories: response.results || [] });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true, error: null, selectedProduct: null });
    
    try {
      const product = await productsApi.getById(id);
      set({ selectedProduct: product, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch product',
        isLoading: false,
      });
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
  },

  clearError: () => {
    set({ error: null });
  },
}));