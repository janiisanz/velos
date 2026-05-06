// CartSidebar.js: lateral de carrito de compra.
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, getCartSubtotal, useCartStore } from '../lib/cart';

export default function CartSidebar() {
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const subtotal = getCartSubtotal(items);

  return (
    <>
      <div
        aria-hidden="true"
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-black/35 transition ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      <aside className={`fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-[#e7e7e3] bg-white transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between border-b border-[#e7e7e3] px-5 py-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#111]">Carrito</h2>
            <button type="button" onClick={closeCart} className="text-[11px] uppercase tracking-[0.14em] text-[#666]">Cerrar</button>
          </header>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {!items.length ? (
              <p className="text-sm text-[#666]">Tu carrito está vacío.</p>
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.uniqueId} className="flex gap-3 border border-[#ecece8] p-3">
                    <div className="relative h-20 w-16 overflow-hidden bg-[#f1f1ef]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-1">
                      <p className="line-clamp-1 text-sm font-semibold uppercase text-[#111]">{item.name}</p>
                      <p className="mt-1 text-sm text-[#333]">{formatPrice(item.price)}</p>
                      {(item.selectedSize || item.selectedColor) && (
                        <p className="mt-1 text-xs text-[#666]">
                          {item.selectedSize && <span>Talla: {item.selectedSize}</span>}
                          {item.selectedSize && item.selectedColor && <span> • </span>}
                          {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.uniqueId, Number(e.target.value))} className="w-16 border border-[#d8d8d4] px-2 py-1 text-sm text-[#111]" />
                        <button type="button" onClick={() => removeItem(item.uniqueId)} className="text-[11px] uppercase tracking-[0.1em] text-[#9a2f2f]">Eliminar</button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <footer className="border-t border-[#e7e7e3] px-5 py-4">
            <div className="mb-3 flex items-center justify-between text-sm text-[#444]"><span>Subtotal</span><span className="font-semibold text-[#111]">{formatPrice(subtotal)}</span></div>
            <Link href="/checkout" onClick={closeCart} className="block w-full bg-[#111] px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white">Checkout</Link>
          </footer>
        </div>
      </aside>
    </>
  );
}
