// checkout.js: checkout en modo prueba.
import { useState } from 'react';
import Head from 'next/head';
import Breadcrumbs from '../components/Breadcrumbs';
import { formatPrice, getCartSubtotal, useCartStore } from '../lib/cart';

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const total = getCartSubtotal(items);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setDone(true);
    clearCart();
  };

  return (
    <>
      <Head><title>Checkout | Velos Clothing</title></Head>
      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Checkout' }]} />
        <h1 className="section-title">Checkout</h1>

        {done ? (
          <div className="panel mt-6 p-8 text-center">
            <h2 className="text-2xl font-bold uppercase text-[#111]">Pago simulado correctamente</h2>
            <p className="mt-2 text-sm text-[#666]">Pedido de prueba registrado.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr,320px]">
            <form onSubmit={handleSubmit} className="panel space-y-4 p-6">
              <input type="text" required placeholder="Nombre y apellidos" className="w-full border border-[#d8d8d4] px-3 py-2 text-[#111]" />
              <input type="email" required placeholder="Email" className="w-full border border-[#d8d8d4] px-3 py-2 text-[#111]" />
              <input type="text" required placeholder="Dirección" className="w-full border border-[#d8d8d4] px-3 py-2 text-[#111]" />
              <input type="tel" required placeholder="Teléfono" className="w-full border border-[#d8d8d4] px-3 py-2 text-[#111]" />
              <button type="submit" disabled={!items.length || loading} className="w-full bg-[#111] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white disabled:opacity-50">{loading ? 'Procesando' : 'Simular pago'}</button>
            </form>

            <aside className="panel h-fit p-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#111]">Resumen</h2>
              <p className="mt-3 text-sm text-[#666]">Productos: {items.length}</p>
              <div className="mt-2 flex items-center justify-between text-sm"><span className="text-[#666]">Total</span><span className="font-semibold text-[#111]">{formatPrice(total)}</span></div>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}
