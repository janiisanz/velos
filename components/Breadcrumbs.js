// Breadcrumbs.js: migas de navegación.
import Link from 'next/link';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.1em] text-[#666]">
        <li><Link href="/">Inicio</Link></li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            <span>/</span>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span className="text-[#111]">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
