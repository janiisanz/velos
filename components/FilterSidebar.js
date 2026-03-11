// FilterSidebar.js: panel lateral de filtros para catálogo.
import { useMemo } from 'react';

function extractValues(products = [], key) {
  const values = new Set();
  products.forEach((product) => {
    const raw = product?.acf?.[key];
    if (Array.isArray(raw)) raw.forEach((v) => values.add(String(v)));
    if (typeof raw === 'string') raw.split(',').map((v) => v.trim()).filter(Boolean).forEach((v) => values.add(v));
  });
  return Array.from(values).sort((a, b) => a.localeCompare(b));
}

export default function FilterSidebar({ categories = [], products = [], filters, onChange, onReset }) {
  const sizes = useMemo(() => extractValues(products, 'size'), [products]);
  const colors = useMemo(() => extractValues(products, 'color'), [products]);
  const inputClass = 'mt-2 w-full border border-[#d8d8d4] bg-white px-3 py-2 text-sm text-[#111]';

  return (
    <aside className="panel h-fit p-5">
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111]">Filtros</h3>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#666]">Categoría</p>
          <select value={filters.category} onChange={(e) => onChange('category', e.target.value)} className={inputClass}>
            <option value="">Todas</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#666]">Precio</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input type="number" placeholder="Mín" value={filters.min_price} onChange={(e) => onChange('min_price', e.target.value)} className="border border-[#d8d8d4] bg-white px-3 py-2 text-sm text-[#111]" />
            <input type="number" placeholder="Máx" value={filters.max_price} onChange={(e) => onChange('max_price', e.target.value)} className="border border-[#d8d8d4] bg-white px-3 py-2 text-sm text-[#111]" />
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#666]">Talla</p>
          <select value={filters.size} onChange={(e) => onChange('size', e.target.value)} className={inputClass}>
            <option value="">Todas</option>
            {sizes.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-[#666]">Color</p>
          <select value={filters.color} onChange={(e) => onChange('color', e.target.value)} className={inputClass}>
            <option value="">Todos</option>
            {colors.map((color) => <option key={color} value={color}>{color}</option>)}
          </select>
        </div>
      </div>

      <button type="button" onClick={onReset} className="mt-6 w-full border border-[#d8d8d4] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#111] hover:bg-[#111] hover:text-white">
        Limpiar
      </button>
    </aside>
  );
}
