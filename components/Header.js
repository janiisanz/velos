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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const closeShopTimerRef = useRef(null);

  const { data } = useSWR('/api/categories', fetcher);
  const categories = useMemo(() => {
    const allCategories = data?.categories || [];
    const parentCategories = allCategories.filter((cat) => cat.parent === 0);
    
    return parentCategories.map((parent) => ({
      ...parent,
      children: allCategories.filter((cat) => cat.parent === parent.id)
    })).slice(0, 8);
  }, [data?.categories]);

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
    setMobileMenuOpen(false);
  }, [router.asPath]);

  useEffect(() => () => {
    if (closeShopTimerRef.current) {
      clearTimeout(closeShopTimerRef.current);
    }
  }, []);

  const positionClass = isHome ? 'fixed inset-x-0 top-0' : 'sticky top-0';
  const headerClass = onHero
    ? `${positionClass} z-40 bg-transparent`
    : `${positionClass} z-40 border-b border-[#e5e5e5] bg-white`;
  const textClass = onHero ? 'text-white' : 'text-black';
  const badgeClass = onHero ? 'bg-white text-black' : 'bg-black text-white';

  const onSearchSubmit = (event) => {
    event.preventDefault();
    const value = search.trim();
    router.push(value ? `/products?search=${encodeURIComponent(value)}` : '/products');
  };

  return (
    <header className={headerClass}>
      <div className="container-page relative flex h-20 items-center justify-between md:h-24">
        {/* Logo a la izquierda */}
        <Link href="/" className="relative inline-flex items-center" aria-label="Velos home">
          <Image
            src="/logo.png"
            alt="Velos logo"
            width={116}
            height={32}
            className={`h-7 w-auto transition-all duration-500 md:h-8 ${onHero ? 'opacity-100 brightness-0 invert' : 'opacity-0 scale-90'}`}
            priority
          />
          <Image
            src="/velos1.png"
            alt="Velos logo"
            width={928}
            height={626}
            className={`absolute left-0 top-1/2 -translate-y-1/2 h-auto w-56 transition-all duration-500 ease-out md:w-80 ${onHero ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
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
              closeShopTimerRef.current = setTimeout(() => setShopOpen(false), 200);
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
              className={`absolute left-0 top-full mt-4 w-64 bg-white shadow-lg transition-all duration-200 ${
                shopOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-1 opacity-0'
              }`}
            >
              <div className="py-2">
                <Link
                  href="/products"
                  onClick={() => setShopOpen(false)}
                  className="block px-6 py-3 text-sm font-bold uppercase tracking-tight text-black transition hover:bg-[#f5f5f5]"
                >
                  Ver todo
                </Link>
                <div className="my-2 border-t border-[#e5e5e5]" />
                {categories.map((category) => (
                  <div key={category.id}>
                    <Link
                      href={`/products?category=${category.id}`}
                      onClick={() => setShopOpen(false)}
                      className="block px-6 py-2.5 text-sm font-bold text-black transition hover:bg-[#f5f5f5]"
                    >
                      {category.name}
                    </Link>
                    {category.children && category.children.length > 0 && (
                      <div className="bg-[#fafafa] py-1">
                        {category.children.map((child) => (
                          <Link
                            key={child.id}
                            href={`/products?category=${child.id}`}
                            onClick={() => setShopOpen(false)}
                            className="block px-10 py-2 text-xs text-[#666] transition hover:bg-[#f0f0f0] hover:text-black"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Link href="/products">New In</Link>
          <Link href="/products">Collections</Link>
        </nav>

        <div className={`flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.12em] ${textClass}`}>
          {/* Buscar */}
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

          {/* Login */}
          <Link href="/account" className="inline-flex" aria-label="Mi cuenta">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
            </svg>
          </Link>

          {/* Carrito */}
          <button
            type="button"
            aria-label="Carrito"
            onClick={toggleCart}
            className="relative inline-flex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4ZM3 6h18M16 10a4 4 0 0 1-8 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>

          {/* Menú hamburguesa - solo móvil */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden"
            aria-label="Abrir menú"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
              <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Buscador desplegable */}
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
              placeholder="Buscar productos..."
              autoFocus={searchOpen}
              className="search-input h-12 w-full border-0 bg-transparent text-3xl font-medium text-[#222] outline-none placeholder:text-[#8b8b8b]"
            />
          </form>

          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Cerrar buscador"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8" aria-hidden="true">
              <path strokeLinecap="round" d="M5 5 19 19M19 5 5 19" />
            </svg>
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm transform bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header del menú móvil */}
          <div className="flex items-center justify-between border-b border-[#e5e5e5] p-4">
            <h2 className="text-lg font-black uppercase tracking-tight">Menú</h2>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Cerrar menú"
              className="rounded-full p-2 transition hover:bg-[#f5f5f5]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {/* Contenido del menú móvil */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg bg-black px-6 py-4 text-center font-bold uppercase tracking-tight text-white transition hover:bg-gray-900"
              >
                Ver todo
              </Link>
            </div>

            <nav className="border-t border-[#e5e5e5]">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block border-b border-[#e5e5e5] px-4 py-4 text-sm font-bold uppercase tracking-tight text-black transition hover:bg-[#f5f5f5]"
              >
                New In
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block border-b border-[#e5e5e5] px-4 py-4 text-sm font-bold uppercase tracking-tight text-black transition hover:bg-[#f5f5f5]"
              >
                Collections
              </Link>
            </nav>

            <div className="border-t-4 border-black pt-4">
              <p className="px-4 pb-2 text-xs font-bold uppercase tracking-wider text-[#666]">Categorías</p>
              {categories.map((category) => (
                <div key={category.id} className="border-b border-[#e5e5e5]">
                  <Link
                    href={`/products?category=${category.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-bold text-black transition hover:bg-[#f5f5f5]"
                  >
                    {category.name}
                  </Link>
                  {category.children && category.children.length > 0 && (
                    <div className="bg-[#fafafa]">
                      {category.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/products?category=${child.id}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-8 py-2.5 text-xs text-[#666] transition hover:bg-[#f0f0f0] hover:text-black"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay para menú móvil */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}
