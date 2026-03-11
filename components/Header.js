// Header.js: cabecera minimal inspirada en retail editorial.
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { useCartStore } from '../lib/cart';

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error fetching categories');
  return res.json();
};

export default function Header() {
  const router = useRouter();
  const isHome = router.pathname === '/';
  const toggleCart = useCartStore((state) => state.toggleCart);
  const items = useCartStore((state) => state.items);
  const count = items.reduce((acc, item) => acc + item.quantity, 0);
  const [onHero, setOnHero] = useState(isHome);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const closeShopTimerRef = useRef(null);

  const { data } = useSWR('/api/categories', fetcher);
  const categories = useMemo(() => (data?.categories || []).slice(0, 8), [data?.categories]);

  useEffect(() => {
    if (!isHome) {
      setOnHero(false);
      return;
    }

    const update = () => {
      // Mantiene el estilo claro mientras el usuario esté dentro del bloque hero.
      setOnHero(window.scrollY < 520);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [isHome]);

  useEffect(() => {
    const querySearch = typeof router.query.search === 'string' ? router.query.search : '';
    setSearch(querySearch);
  }, [router.query.search]);

  useEffect(() => {
    // Cierra overlays al cambiar de ruta.
    setShopOpen(false);
    setSearchOpen(false);
  }, [router.asPath]);

  useEffect(() => () => {
    if (closeShopTimerRef.current) {
      clearTimeout(closeShopTimerRef.current);
    }
  }, []);

  const positionClass = isHome ? 'fixed inset-x-0 top-0' : 'sticky top-0';
  const headerClass = onHero
    ? `${positionClass} z-40 border-b border-black/10 bg-white/30 backdrop-blur-md`
    : `${positionClass} z-40 border-b border-white/30 bg-white/55 backdrop-blur-md`;
  const textClass = onHero ? 'text-white' : 'text-[#333]';
  const badgeClass = onHero ? 'bg-white text-[#111]' : 'bg-[#111] text-white';

  const onSearchSubmit = (event) => {
    event.preventDefault();
    const value = search.trim();
    router.push(value ? `/products?search=${encodeURIComponent(value)}` : '/products');
  };

  return (
    <header className={headerClass}>
      <div className="container-page relative flex h-16 items-center justify-between">
        <Link href="/" className="inline-flex items-center" aria-label="Velos home">
          <Image
            src="/logo.png"
            alt="Velos logo"
            width={116}
            height={32}
            className={`h-8 w-auto ${onHero ? 'brightness-0 invert' : ''}`}
            priority
          />
        </Link>

        <nav className={`absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 text-xs font-semibold uppercase tracking-[0.14em] md:flex ${textClass}`}>
          <div
            className="relative"
            onMouseEnter={() => {
              if (closeShopTimerRef.current) clearTimeout(closeShopTimerRef.current);
              setSearchOpen(false);
              setShopOpen(true);
            }}
            onMouseLeave={() => {
              closeShopTimerRef.current = setTimeout(() => setShopOpen(false), 180);
            }}
          >
            <button
              type="button"
              onClick={() => setShopOpen((prev) => !prev)}
              className="inline-flex items-center gap-1"
            >
              <span>SHOP</span>
            </button>

            <div
              className={`absolute left-0 top-full mt-4 w-[360px] border border-[#d8d8d4] border-t-4 border-t-[#2b2b2b] bg-[#f2f2f1] p-6 text-[#222] transition-all duration-200 ${
                shopOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
              }`}
            >
              <Link href="/products" onClick={() => setShopOpen(false)} className="block py-2 text-[14px] font-medium hover:opacity-70">
                Ver todo
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  onClick={() => setShopOpen(false)}
                  className="block py-2 text-[14px] font-medium hover:opacity-70"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/products">New In</Link>
          <Link href="/products">Collections</Link>
        </nav>

        <div className={`flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.12em] ${textClass}`}>
          <button
            type="button"
            aria-label="Buscar"
            onClick={() => {
              setShopOpen(false);
              setSearchOpen((prev) => !prev);
            }}
            className="inline-flex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m16 16 4 4" />
            </svg>
          </button>

          <Link href="/account" aria-label="Cuenta" className="hidden sm:inline-flex">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
              <circle cx="12" cy="8" r="3.2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 19a6.5 6.5 0 0 1 13 0" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={toggleCart}
            aria-label="Abrir carrito"
            className="relative inline-flex h-10 w-10 items-center justify-center text-current"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="17" cy="20" r="1.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H7" />
            </svg>
            <span className={`absolute -right-1 -top-1 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold leading-none ${badgeClass}`}>
              {count}
            </span>
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden border-t border-[#e7e7e3] bg-white transition-all duration-300 ease-out ${
          searchOpen ? 'max-h-28 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-1'
        }`}
        aria-hidden={!searchOpen}
      >
        <div className="container-page flex items-center gap-4 py-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6 text-[#333]" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m16 16 4 4" />
            </svg>

            <form onSubmit={onSearchSubmit} className="flex-1">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search for..."
                autoFocus={searchOpen}
                className="search-input h-12 w-full border-0 bg-transparent text-3xl font-medium text-[#222] outline-none placeholder:text-[#8b8b8b]"
              />
            </form>

            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Cerrar buscador"
              className="text-[#333]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8" aria-hidden="true">
                <path strokeLinecap="round" d="M5 5 19 19M19 5 5 19" />
              </svg>
            </button>
          </div>
      </div>
    </header>
  );
}
