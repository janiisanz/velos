// index.js: home con hero visual grande + recorrido de producto al hacer scroll.
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import { formatPrice } from '../lib/cart';
import { getCollections, getFeaturedProducts } from '../lib/api';
import heroImage from '../assets/velos-hero.png';

function getImage(product) {
  return product?.images?.[0]?.src || 'https://placehold.co/1800x2200/f1f1ef/111?text=VELOS';
}

export default function Home({ featuredProducts, collections }) {
  const hero = featuredProducts?.[0];
  const spotlight = featuredProducts?.slice(0, 3) || [];
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollProgress = scrollY / 800;
  const titleScale = Math.max(1 - scrollProgress, 0.15);
  const titleY = Math.min(scrollY * 0.6, 400);
  const titleOpacity = Math.max(1 - scrollY / 500, 0);
  const contentOpacity = Math.max(1 - scrollY / 300, 0);

  return (
    <>
      <Head>
        <title>Velos Clothing | Official Store</title>
        <meta name="description" content="Tienda oficial Velos. Sportwear premium con enfoque editorial." />
      </Head>

      <section className="relative h-screen w-full overflow-hidden">
        <Image src={heroImage} alt="Velos hero" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/30" />

        <div className="container-page relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          {mounted && (
            <div 
              className="fixed left-0 right-0 z-50 flex items-center justify-center transition-all duration-200 ease-out"
              style={{
                top: '35vh',
                transform: `translateY(calc(-50% + ${titleY}px)) scale(${titleScale})`,
                opacity: titleOpacity,
                pointerEvents: 'none'
              }}
            >
              <Image 
                src="/velos.png" 
                alt="Velos" 
                width={400} 
                height={120}
                className="h-auto w-[180px] sm:w-[220px] md:w-[280px] lg:w-[320px]"
                priority
                style={{
                  filter: 'brightness(0) invert(1)'
                }}
              />
            </div>
          )}
          
          <div 
            className="mt-32 transition-opacity duration-300"
            style={{
              opacity: contentOpacity
            }}
          >
            <p className="text-lg font-medium uppercase tracking-[0.2em] sm:text-xl">
              Spring Summer 2026
            </p>
            <div className="mt-10">
              <Link 
                href="/products" 
                className="inline-block bg-white px-10 py-4 text-sm font-bold uppercase tracking-[0.1em] text-black transition hover:bg-black hover:text-white"
              >
                Explorar colección
              </Link>
            </div>
          </div>
        </div>
      </section>

      {spotlight.length > 0 && (
        <section className="container-page mt-24">
          <div className="mb-10">
            <h2 className="text-3xl font-black uppercase tracking-tight text-black md:text-4xl">Destacados</h2>
          </div>
          <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
            {spotlight.map((item, index) => (
              <Link key={item.id} href={`/product/${item.slug}`} className="group">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#eeede9]">
                  <Image
                    src={getImage(item)}
                    alt={item.name}
                    fill
                    className="object-cover transition duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="mt-4 space-y-1.5">
                  <h3 className="text-sm font-bold uppercase tracking-tight text-black">{item.name}</h3>
                  <p className="text-sm font-semibold text-black">{formatPrice(item.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {featuredProducts?.length ? (
        <section className="container-page mt-24">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="text-3xl font-black uppercase tracking-tight text-black md:text-4xl">Nuevos productos</h2>
            <Link href="/products" className="text-sm font-bold uppercase tracking-wide text-black hover:underline">Ver todo</Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>
      ) : null}

      <section className="mt-24">
        <div className="container-page mb-12">
          <h2 className="text-3xl font-black uppercase tracking-tight text-black md:text-4xl">Colecciones</h2>
        </div>

        <div className="container-page grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {collections.map((collection, index) => {
            const hasImage = collection.image?.src;
            const isFirst = index === 0;

            return (
              <Link
                key={collection.id}
                href={`/products?category=${collection.id}`}
                className={`group relative overflow-hidden ${
                  isFirst ? 'sm:col-span-2 sm:row-span-2' : ''
                }`}
              >
                <div className={`relative overflow-hidden ${
                  isFirst ? 'h-[460px] sm:h-[540px]' : 'h-[220px] sm:h-[260px]'
                }`}>
                  {hasImage ? (
                    <Image
                      src={collection.image.src}
                      alt={collection.name}
                      fill
                      className="object-cover transition duration-700 ease-out group-hover:scale-105"
                      sizes={isFirst ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#eeede9]" />
                  )}

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-10 md:p-6 md:pt-14">
                    <h3 className={`font-bold uppercase tracking-wide text-white ${
                      isFirst ? 'text-2xl sm:text-3xl md:text-4xl' : 'text-base sm:text-lg md:text-xl'
                    }`}>
                      {collection.name}
                    </h3>
                  </div>
                </div>
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
