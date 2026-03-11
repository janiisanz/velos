// index.js: home con hero visual grande + recorrido de producto al hacer scroll.
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import ProductGrid from '../components/ProductGrid';
import { getCollections, getFeaturedProducts } from '../lib/api';
import heroImage from '../assets/velos-hero.png';

function getImage(product) {
  return product?.images?.[0]?.src || 'https://placehold.co/1800x2200/f1f1ef/111?text=VELOS';
}

export default function Home({ featuredProducts, collections }) {
  const hero = featuredProducts?.[0];
  const spotlight = featuredProducts?.slice(0, 3) || [];

  return (
    <>
      <Head>
        <title>Velos Clothing | Official Store</title>
        <meta name="description" content="Tienda oficial Velos. Sportwear premium con enfoque editorial." />
      </Head>

      <section className="relative h-[72vh] min-h-[560px] w-full overflow-hidden border-b border-[#e7e7e3]">
        <Image src={heroImage} alt="Velos snake hero" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/25" />

        <div className="container-page relative z-10 flex h-full items-end pb-14 text-white">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80">Spring / Summer 2026</p>
            <h1 className="mt-3 text-4xl font-black uppercase leading-[0.92] sm:text-6xl">Velos New Collection</h1>
            <p className="mt-4 max-w-xl text-sm text-white/90 sm:text-base">
              Lorem ipsum dolor sit amet consectetur adipiscing elit, volutpat orci placerat ullamcorper dui lobortis nunc ultricies, nullam justo rhoncus ante litora laoreet.
            </p>
            <div className="mt-7 flex gap-3">
              <Link href="/products" className="bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#111]">Shop now</Link>
              <Link href="/products" className="border border-white/50 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">View lookbook</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page mt-16">
        <div className="grid gap-4 md:grid-cols-3">
          {spotlight.map((item, index) => (
            <article key={item.id} className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#efefec]">
                <Image src={getImage(item)} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-[1.02]" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 border-b border-[#ecece8] pb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#777]">Look {String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-1 text-lg font-semibold uppercase text-[#111]">{item.name}</h3>
                </div>
                <Link href={`/product/${item.slug}`} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#111] underline underline-offset-4">
                  Ver producto
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {featuredProducts?.length ? (
        <section className="container-page mt-16">
          <div className="mb-6 flex items-end justify-end">
            <Link href="/products" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#444]">View all</Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>
      ) : null}

      <section className="container-page mt-16">
        <div className="mb-6">
          <p className="kicker">Shop by Category</p>
          <h2 className="section-title mt-2">Collections</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => {
            const isCamisetas = String(collection.name || '').toLowerCase().includes('camisetas');

            if (isCamisetas) {
              return (
                <Link
                  key={collection.id}
                  href={`/products?category=${collection.id}`}
                  className="group relative block min-h-[240px] overflow-hidden border border-[#e0e0dc]"
                >
                  <Image
                    src={collection.image?.src || heroImage}
                    alt={collection.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/25" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-3xl font-black uppercase tracking-[0.12em] text-white">
                      Camisetas
                    </h3>
                  </div>
                </Link>
              );
            }

            return (
              <Link key={collection.id} href={`/products?category=${collection.id}`} className="panel group p-5 transition hover:bg-[#f2f2ef]">
                <p className="kicker">Collection</p>
                <h3 className="mt-2 text-xl font-bold uppercase text-[#111]">{collection.name}</h3>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[#666]">{collection.count} productos</p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}

export async function getStaticProps() {
  let featuredProducts = [];
  let collections = [];

  try {
    [featuredProducts, collections] = await Promise.all([getFeaturedProducts(8), getCollections()]);
  } catch (error) {
    console.error('Home data fetch failed:', error.message);
  }

  return { props: { featuredProducts, collections }, revalidate: 300 };
}
