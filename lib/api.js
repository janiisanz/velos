// api.js: archivo principal de la tienda headless.
const WC_BASE_URL = process.env.WC_BASE_URL || 'https://velosclothing.com/wp-json/wc/v3';
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET;

function hasCredentials() {
  return Boolean(WC_CONSUMER_KEY && WC_CONSUMER_SECRET);
}

function withAuth(url) {
  const nextUrl = new URL(url);

  if (hasCredentials()) {
    nextUrl.searchParams.set('consumer_key', WC_CONSUMER_KEY);
    nextUrl.searchParams.set('consumer_secret', WC_CONSUMER_SECRET);
  }

  return nextUrl;
}

async function wooRequest(path, params = {}) {
  const url = new URL(`${WC_BASE_URL.replace(/\/$/, '')}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  const authedUrl = withAuth(url.toString());
  const res = await fetch(authedUrl.toString(), {
    headers: {
      'Content-Type': 'application/json'
    },
    next: { revalidate: 60 }
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`WooCommerce API error ${res.status}: ${message}`);
  }

  const total = res.headers.get('x-wp-total');
  const totalPages = res.headers.get('x-wp-totalpages');
  const data = await res.json();

  return {
    data,
    meta: {
      total: total ? Number(total) : null,
      totalPages: totalPages ? Number(totalPages) : null
    }
  };
}

export function mapProduct(product) {
  const acf = product?.acf || {};
  const regular = Number(product?.regular_price || 0);
  const sale = Number(product?.sale_price || 0);
  const active = Number(product?.price || sale || regular || 0);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    shortDescription: product.short_description,
    price: active,
    regularPrice: regular,
    salePrice: sale,
    categories: product.categories || [],
    images: product.images || [],
    stockStatus: product.stock_status,
    rating: Number(product.average_rating || 0),
    reviewCount: Number(product.rating_count || 0),
    relatedIds: product.related_ids || [],
    acf: {
      size: acf.size || acf.talla || [],
      color: acf.color || acf.colores || []
    },
    raw: product
  };
}

function normalizeAcfValue(value) {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).toLowerCase());
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((v) => v.trim().toLowerCase())
      .filter(Boolean);
  }

  return [];
}

function filterByAcf(products, size, color) {
  if (!size && !color) return products;

  return products.filter((product) => {
    const sizes = normalizeAcfValue(product.acf?.size);
    const colors = normalizeAcfValue(product.acf?.color);
    const sizeOk = size ? sizes.includes(String(size).toLowerCase()) : true;
    const colorOk = color ? colors.includes(String(color).toLowerCase()) : true;

    return sizeOk && colorOk;
  });
}

export function mapOrderBy(sort) {
  switch (sort) {
    case 'price_asc':
      return { orderby: 'price', order: 'asc' };
    case 'price_desc':
      return { orderby: 'price', order: 'desc' };
    case 'popularity':
      return { orderby: 'popularity', order: 'desc' };
    default:
      return { orderby: 'date', order: 'desc' };
  }
}

export async function getProducts(params = {}) {
  const page = params.page || 1;
  const perPage = params.per_page || 12;
  const orderConfig = mapOrderBy(params.sort);

  const baseParams = {
    page,
    per_page: perPage,
    search: params.search,
    category: params.category,
    min_price: params.min_price,
    max_price: params.max_price,
    ...orderConfig
  };

  const { data, meta } = await wooRequest('/products', baseParams);
  let mergedData = [...data];

  // Si el usuario busca por texto, añadimos también coincidencias por nombre de categoría.
  if (params.search && !params.category && Number(page) === 1) {
    const categories = await getCategories();
    const needle = String(params.search).toLowerCase().trim();
    const categoryIds = categories
      .filter((category) => String(category.name || '').toLowerCase().includes(needle))
      .map((category) => category.id);

    if (categoryIds.length) {
      const { data: categoryData } = await wooRequest('/products', {
        ...baseParams,
        search: undefined,
        category: categoryIds.join(',')
      });

      const seen = new Set(mergedData.map((item) => item.id));
      categoryData.forEach((item) => {
        if (!seen.has(item.id)) {
          mergedData.push(item);
          seen.add(item.id);
        }
      });
    }
  }

  const mapped = mergedData.map(mapProduct);
  const filtered = filterByAcf(mapped, params.size, params.color);

  return {
    data: filtered,
    meta
  };
}

export async function getFeaturedProducts(limit = 8) {
  const { data } = await wooRequest('/products', {
    featured: true,
    per_page: limit,
    status: 'publish'
  });

  return data.map(mapProduct);
}

export async function getCollections() {
  const { data } = await wooRequest('/products/categories', {
    per_page: 20,
    hide_empty: true
  });

  return data;
}

export async function getProductBySlug(slug) {
  const { data } = await wooRequest('/products', {
    slug,
    status: 'publish',
    per_page: 1
  });

  if (!data?.length) return null;
  return mapProduct(data[0]);
}

export async function getProductsByIds(ids = []) {
  if (!ids.length) return [];

  const { data } = await wooRequest('/products', {
    include: ids.join(','),
    per_page: ids.length
  });

  return data.map(mapProduct);
}

export async function getAllProductSlugs() {
  const { data } = await wooRequest('/products', {
    per_page: 100,
    status: 'publish'
  });

  return data.map((p) => p.slug);
}

export async function getCategories() {
  const { data } = await wooRequest('/products/categories', {
    per_page: 100,
    hide_empty: true
  });

  return data;
}

export const fetcher = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Error fetching data');
  }

  return res.json();
};
