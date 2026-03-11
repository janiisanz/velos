// cart.js: archivo principal de la tienda headless.
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

function getProductImage(product) {
  return product.images?.[0]?.src || 'https://placehold.co/600x800?text=Producto';
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      isOpen: false,
      items: [],
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      closeCart: () => set({ isOpen: false }),
      addItem: (product, quantity = 1) => {
        const state = get();
        const existing = state.items.find((item) => item.id === product.id);

        if (existing) {
          return set({
            items: state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        }

        return set({
          items: [
            ...state.items,
            {
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: Number(product.price || 0),
              image: getProductImage(product),
              quantity
            }
          ]
        });
      },
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, Number(quantity) || 1) } : item
          )
        })),
      clearCart: () => set({ items: [] })
    }),
    {
      name: 'velos-cart-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

export const getCartSubtotal = (items) =>
  items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);

export const formatPrice = (value) =>
  new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(Number(value || 0));
