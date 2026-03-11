// ProductCard.js: tarjeta de producto estilo editorial limpio.
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, useCartStore } from '../lib/cart';

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const image = product.images?.[0]?.src || 'https://placehold.co/900x1200/f1f1ef/111?text=VELOS';

  return (
    <article className="group">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-[#efefec]">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
        />
      </Link>

      <div className="space-y-2 pt-4">
        <h3 className="line-clamp-1 text-sm font-semibold uppercase tracking-[0.08em] text-[#111]">{product.name}</h3>
        <p className="text-sm text-[#333]">{formatPrice(product.price)}</p>
        <button
          type="button"
          onClick={() => addItem(product, 1)}
          className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#111] underline underline-offset-4"
        >
          Añadir
        </button>
      </div>
    </article>
  );
}
