// Footer.js: pie con newsletter y enlaces.
import Link from 'next/link';
import NewsletterSignup from './NewsletterSignup';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#e7e7e3] bg-white">
      <div className="container-page grid gap-8 py-12 md:grid-cols-4">
        <div>
          <h3 className="text-base font-black uppercase tracking-[0.22em] text-[#111]">Velos</h3>
          <p className="mt-3 text-sm text-[#666]">Lorem ipsum dolor sit amet consectetur adipiscing elit¡.</p>
        </div>

        <div>
          <h4 className="kicker">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#444]">
            <li><Link href="/products">Todos los productos</Link></li>
            <li><Link href="/products">Novedades</Link></li>
            <li><Link href="/products">Colecciones</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="kicker">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-[#444]">
            <li><Link href="#">Privacidad</Link></li>
            <li><Link href="#">Términos</Link></li>
            <li><Link href="#">Envíos y devoluciones</Link></li>
          </ul>
        </div>

        <NewsletterSignup />
      </div>
    </footer>
  );
}
