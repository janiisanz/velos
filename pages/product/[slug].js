// [slug].js: detalle de producto con layout limpio y editorial.
import { useMemo, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Breadcrumbs from '../../components/Breadcrumbs';
import ProductGrid from '../../components/ProductGrid';
import { formatPrice, useCartStore } from '../../lib/cart';
import { getAllProductSlugs, getProductBySlug, getProductsByIds, getProducts } from '../../lib/api';

function valuesToList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return value.split(',').map((v) => v.trim()).filter(Boolean);
  return [];
}

export default function ProductDetailPage({ product, relatedProducts }) {
  const addItem = useCartStore((state) => state.addItem);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images?.[0]?.src || 'https://placehold.co/900x1200/f1f1ef/111');
  const sizes = useMemo(() => valuesToList(product.acf?.size), [product.acf?.size]);
  const colors = useMemo(() => valuesToList(product.acf?.color), [product.acf?.color]);

  return (
    <>
      <Head>
        <title>{product.name} | Velos Clothing</title>
        <meta name="description" content={product.shortDescription?.replace(/<[^>]+>/g, '').slice(0, 150)} />
      </Head>

      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Shop', href: '/products' }, { label: product.name }]} />

        <section className="grid gap-8 lg:grid-cols-[1.2fr,1fr]">
          <div className="panel p-4">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#efefec]">
              <Image src={activeImage} alt={product.name} fill className="object-cover" sizes="50vw" />
            </div>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {product.images?.map((image) => (
                <button key={image.id} type="button" onClick={() => setActiveImage(image.src)} className="relative aspect-square overflow-hidden border border-[#e2e2de] bg-[#efefec]">
                  <Image src={image.src} alt={product.name} fill className="object-cover" sizes="100px" />
                </button>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <p className="kicker">Velos Product</p>
            <h1 className="mt-3 text-4xl font-bold uppercase leading-[0.95] text-[#111]">{product.name}</h1>
            <p className="mt-4 text-2xl text-[#111]">{formatPrice(product.price)}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#666]">Talla</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sizes.length ? sizes.map((size) => <span key={size} className="border border-[#d8d8d4] px-3 py-1 text-xs uppercase text-[#111]">{size}</span>) : <span className="text-xs text-[#888]">Sin info</span>}
                </div>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#666]">Color</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colors.length ? colors.map((color) => <span key={color} className="border border-[#d8d8d4] px-3 py-1 text-xs uppercase text-[#111]">{color}</span>) : <span className="text-xs text-[#888]">Sin info</span>}
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2">
              <input type="number" min="1" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} className="w-20 border border-[#d8d8d4] px-3 py-2 text-[#111]" />
              <button type="button" onClick={() => addItem(product, qty)} className="bg-[#111] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">Añadir al carrito</button>
            </div>

            <div className="product-prose mt-8 border border-[#e7e7e3] bg-[#fafaf9] p-5">
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#111]">Descripción</h2>
              <div dangerouslySetInnerHTML={{ __html: product.description || '<p>Sin descripción.</p>' }} />
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-6">
            <p className="kicker">You may also like</p>
            <h2 className="section-title mt-2">Productos Relacionados</h2>
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  let slugs = [];
  try { slugs = await getAllProductSlugs(); } catch (error) { console.error('Product slugs fetch failed:', error.message); }
  return { paths: slugs.map((slug) => ({ params: { slug } })), fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  let product = null;
  try { product = await getProductBySlug(params.slug); } catch (error) { console.error(`Product fetch failed for slug ${params.slug}:`, error.message); }
  if (!product) return { notFound: true };

  let relatedProducts = [];
  if (product.relatedIds?.length) {
    try { relatedProducts = await getProductsByIds(product.relatedIds.slice(0, 4)); } catch (error) { console.error(`Related products fetch failed for ${params.slug}:`, error.message); }
  }

  if (!relatedProducts.length) {
    const sameCategory = product.categories?.[0]?.id;
    try {
      const fallback = await getProducts({ category: sameCategory, per_page: 4, page: 1 });
      relatedProducts = fallback.data.filter((item) => item.id !== product.id).slice(0, 4);
    } catch (error) {
      console.error(`Fallback related fetch failed for ${params.slug}:`, error.message);
    }
  }

  return { props: { product, relatedProducts }, revalidate: 300 };
}
