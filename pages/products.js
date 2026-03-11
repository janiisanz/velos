// products.js: catálogo principal con sidebar de filtros y orden.
import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Breadcrumbs from '../components/Breadcrumbs';
import FilterSidebar from '../components/FilterSidebar';
import Loader from '../components/Loader';
import ProductGrid from '../components/ProductGrid';
import { fetcher, getCategories } from '../lib/api';

const initialFilters = { category: '', min_price: '', max_price: '', size: '', color: '', search: '', sort: 'popularity' };

export default function ProductsPage({ categories }) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    ...initialFilters,
    category: router.query.category || '',
    search: router.query.search || ''
  });

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: router.query.category || '',
      search: router.query.search || ''
    }));
  }, [router.query.category, router.query.search]);

  const queryString = useMemo(() => {
    const query = new URLSearchParams({ page: String(page), per_page: '12', sort: filters.sort });
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'sort') query.set(key, value);
    });
    return query.toString();
  }, [filters, page]);

  const { data, error, isLoading } = useSWR(`/api/products?${queryString}`, fetcher, { keepPreviousData: true });
  const products = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  const handleFilterChange = (key, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <Head>
        <title>Shop | Velos Clothing</title>
        <meta name="description" content="Explora el catálogo Velos con filtros por categoría, precio, talla y color." />
      </Head>

      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Shop' }]} />

        <section className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#e7e7e3] pb-4">
          <div>
            <p className="kicker">Store</p>
            <h1 className="mt-2 text-3xl font-bold uppercase tracking-[0.1em] text-[#111]">Shop All</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="border border-[#d8d8d4] bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#111]"
            >
              {showFilters ? 'Ocultar filtros' : 'Filtrar'}
            </button>
            <select value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)} className="border border-[#d8d8d4] bg-white px-3 py-2 text-sm text-[#111]">
              <option value="popularity">Popularidad</option>
              <option value="price_asc">Precio: menor a mayor</option>
              <option value="price_desc">Precio: mayor a menor</option>
            </select>
          </div>
        </section>

        {showFilters ? (
          <div className="mb-6">
            <FilterSidebar
              categories={categories}
              products={products}
              filters={filters}
              onChange={handleFilterChange}
              onReset={() => {
                setPage(1);
                setFilters(initialFilters);
              }}
            />
          </div>
        ) : null}

        <div>
          {isLoading ? <Loader text="Cargando catálogo..." /> : null}
          {error ? <div className="panel p-4 text-sm text-[#9a2f2f]">No fue posible cargar productos.</div> : null}
          {!isLoading && !error ? <ProductGrid products={products} /> : null}

          <div className="mt-8 flex items-center justify-center gap-3">
            <button type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1} className="border border-[#d8d8d4] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#111] disabled:opacity-50">Anterior</button>
            <span className="text-[11px] uppercase tracking-[0.14em] text-[#666]">Página {page} / {totalPages}</span>
            <button type="button" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page >= totalPages} className="border border-[#d8d8d4] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#111] disabled:opacity-50">Siguiente</button>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  let categories = [];
  try {
    categories = await getCategories();
  } catch (error) {
    console.error('Categories fetch failed:', error.message);
  }
  return { props: { categories }, revalidate: 300 };
}
