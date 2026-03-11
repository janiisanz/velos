// account.js: área de cuenta base.
import Head from 'next/head';
import Breadcrumbs from '../components/Breadcrumbs';

export default function AccountPage() {
  return (
    <>
      <Head><title>Cuenta | Velos Clothing</title></Head>
      <div className="container-page py-10">
        <Breadcrumbs items={[{ label: 'Cuenta' }]} />
        <h1 className="section-title">Mi Cuenta</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="panel p-6">
            <p className="kicker">Acceso</p>
            <form className="mt-4 space-y-3">
              <input type="email" placeholder="Email" className="w-full border border-[#d8d8d4] px-3 py-2 text-[#111]" />
              <input type="password" placeholder="Contraseña" className="w-full border border-[#d8d8d4] px-3 py-2 text-[#111]" />
              <button type="button" className="w-full bg-[#111] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">Entrar (próximo paso)</button>
            </form>
          </section>

          <section className="panel p-6">
            <p className="kicker">Próximamente</p>
            <ul className="mt-4 space-y-2 text-sm text-[#444]">
              <li>Historial de pedidos</li>
              <li>Direcciones guardadas</li>
              <li>Gestión de datos personales</li>
              <li>Seguimiento de envíos</li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
