// ProductCard.js: tarjeta de producto estilo editorial limpio.
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice, useCartStore } from '../lib/cart';

export default function ProductCard({ product }) {
  const addItem = useCartStore((state) => state.addItem);
  const image = product.images?.[0]?.src || 'https://placehold.co/900x1200/f1f1ef/111?text=VELOS';

  return (
    <article className="group cursor-pointer">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden bg-[#eeede9]">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-700 ease-out group-hover:scale-105"
        />
      </Link>

      <div className="mt-4 space-y-1.5">
        <h3 className="text-sm font-bold uppercase tracking-tight text-[#111]">{product.name}</h3>
        <p className="text-sm font-semibold text-[#111]">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
