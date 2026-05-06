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
        const selectedSize = product.selectedSize || '';
        const selectedColor = product.selectedColor || '';
        const uniqueId = `${product.id}-${selectedSize}-${selectedColor}`;
        
        const existing = state.items.find((item) => 
          item.id === product.id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor
        );

        if (existing) {
          return set({
            items: state.items.map((item) =>
              item.id === product.id && 
              item.selectedSize === selectedSize && 
              item.selectedColor === selectedColor
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
              uniqueId,
              slug: product.slug,
              name: product.name,
              price: Number(product.price || 0),
              image: getProductImage(product),
              quantity,
              selectedSize,
              selectedColor
            }
          ]
        });
      },
      removeItem: (uniqueId) =>
        set((state) => ({ items: state.items.filter((item) => item.uniqueId !== uniqueId) })),
      updateQuantity: (uniqueId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.uniqueId === uniqueId ? { ...item, quantity: Math.max(1, Number(quantity) || 1) } : item
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
