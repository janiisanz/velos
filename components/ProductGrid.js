// ProductGrid.js: rejilla de productos reutilizable.
import ProductCard from './ProductCard';

export default function ProductGrid({ products = [] }) {
  if (!products.length) {
    return <div className="panel p-6 text-center text-sm text-[#666]">No hay productos para los filtros seleccionados.</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
