// NewsletterSignup.js: bloque de alta a newsletter.
import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'No se pudo completar la suscripción.');

      setStatus('success');
      setMessage('Revisa tu correo para confirmar tu suscripción.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error.message);
    }
  };

  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-wider text-white">Newsletter</h4>
      <p className="mt-3 text-sm text-white/80">Ofertas, drops y lanzamientos.</p>

      <form onSubmit={submit} className="mt-3 flex flex-col gap-2">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          placeholder="tuemail@dominio.com"
          className="border border-white/30 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:border-white/50 focus:outline-none"
        />
        <button type="submit" disabled={status === 'loading'} className="bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-white/90 disabled:opacity-60">
          {status === 'loading' ? 'Enviando' : 'Unirme'}
        </button>
      </form>

      {message ? <p className={`mt-2 text-xs ${status === 'error' ? 'text-red-300' : 'text-green-300'}`}>{message}</p> : null}
    </div>
  );
}
