import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, Cart } from '@/src/types/product';

interface CartState extends Cart {
  addItem: (product: Product, selectedColor?: string, selectedStorage?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    return total + (item.product.discount_price * item.quantity);
  }, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,

      addItem: (product, selectedColor, selectedStorage) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.selectedColor === selectedColor &&
              item.selectedStorage === selectedStorage
          );

          let newItems: CartItem[];

          if (existingItemIndex > -1) {
            // Item already exists, increase quantity
            newItems = [...state.items];
            newItems[existingItemIndex] = {
              ...newItems[existingItemIndex],
              quantity: newItems[existingItemIndex].quantity + 1,
            };
          } else {
            // New item, add to cart
            newItems = [
              ...state.items,
              {
                product,
                quantity: 1,
                selectedColor,
                selectedStorage,
              },
            ];
          }

          return {
            items: newItems,
            total: calculateTotal(newItems),
            itemCount: calculateItemCount(newItems),
          };
        });
      },

      removeItem: (productId) => {
        set((state) => {
          const newItems = state.items.filter(
            (item) => item.product.id !== productId
          );
          return {
            items: newItems,
            total: calculateTotal(newItems),
            itemCount: calculateItemCount(newItems),
          };
        });
      },

      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            // Remove item if quantity is 0 or negative
            const newItems = state.items.filter(
              (item) => item.product.id !== productId
            );
            return {
              items: newItems,
              total: calculateTotal(newItems),
              itemCount: calculateItemCount(newItems),
            };
          }

          const newItems = state.items.map((item) =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          );

          return {
            items: newItems,
            total: calculateTotal(newItems),
            itemCount: calculateItemCount(newItems),
          };
        });
      },

      clearCart: () => {
        set({
          items: [],
          total: 0,
          itemCount: 0,
        });
      },

      getItemCount: () => {
        return get().itemCount;
      },

      getTotal: () => {
        return get().total;
      },
    }),
    {
      name: 'shopping-cart',
    }
  )
);
