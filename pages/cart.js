// cart.js: página de carrito.
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '../components/Breadcrumbs';
import { formatPrice, getCartSubtotal, useCartStore } from '../lib/cart';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const subtotal = getCartSubtotal(items);

  return (
    <>
      <Head><title>Carrito | Velos Clothing</title></Head>
      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Carrito' }]} />
        <h1 className="section-title">Shopping Bag</h1>

        {!items.length ? (
          <div className="panel mt-6 p-8 text-center">
            <p className="text-[#666]">Tu carrito está vacío.</p>
            <Link href="/products" className="mt-4 inline-block bg-[#111] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">Ir al catálogo</Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,320px]">
            <div className="panel overflow-hidden">
              <ul>
                {items.map((item) => (
                  <li key={item.id} className="flex flex-wrap items-center gap-4 border-b border-[#ecece8] p-4">
                    <div className="relative h-24 w-20 overflow-hidden bg-[#f1f1ef]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="120px" />
                    </div>
                    <div className="min-w-40 flex-1">
                      <p className="font-semibold uppercase text-[#111]">{item.name}</p>
                      <p className="text-sm text-[#444]">{formatPrice(item.price)}</p>
                    </div>
                    <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.id, Number(e.target.value))} className="w-20 border border-[#d8d8d4] px-3 py-2 text-[#111]" />
                    <button type="button" onClick={() => removeItem(item.id)} className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9a2f2f]">Eliminar</button>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="panel h-fit p-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#111]">Resumen</h2>
              <div className="mt-4 flex items-center justify-between text-sm text-[#444]"><span>Subtotal</span><span className="font-semibold text-[#111]">{formatPrice(subtotal)}</span></div>
              <div className="mt-2 flex items-center justify-between text-sm text-[#444]"><span>Total</span><span className="font-semibold text-[#111]">{formatPrice(subtotal)}</span></div>
              <Link href="/checkout" className="mt-6 block bg-[#111] px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white">Checkout</Link>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
