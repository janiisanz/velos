// Footer.js: pie con newsletter y enlaces.
import Link from 'next/link';
import Image from 'next/image';
import NewsletterSignup from './NewsletterSignup';
import heroImage from '../assets/velos-hero.png';

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden">
      {/* Imagen de fondo */}
      <Image src={heroImage} alt="" fill className="object-cover" sizes="100vw" />
      
      {/* Overlay difuminado */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Contenido */}
      <div className="container-page relative z-10 grid gap-8 py-12 md:grid-cols-4">
        <div>
          <Image
            src="/logo.png"
            alt="Velos"
            width={116}
            height={32}
            className="h-8 w-auto brightness-0 invert"
          />
          <p className="mt-3 text-sm leading-relaxed text-white/70">Sportwear premium con enfoque editorial. Diseñado para moverse.</p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link href="/products" className="transition hover:text-white">Todos los productos</Link></li>
            <li><Link href="/products" className="transition hover:text-white">Novedades</Link></li>
            <li><Link href="/products" className="transition hover:text-white">Colecciones</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link href="#" className="transition hover:text-white">Privacidad</Link></li>
            <li><Link href="#" className="transition hover:text-white">Términos</Link></li>
            <li><Link href="#" className="transition hover:text-white">Envíos y devoluciones</Link></li>
          </ul>
        </div>

        <NewsletterSignup />
      </div>
    </footer>
  );
}
