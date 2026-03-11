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
      <h4 className="kicker">Newsletter</h4>
      <p className="mt-3 text-sm text-[#666]">Ofertas, drops y lanzamientos.</p>

      <form onSubmit={submit} className="mt-3 flex flex-col gap-2">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          placeholder="tuemail@dominio.com"
          className="border border-[#d8d8d4] bg-white px-3 py-2 text-sm text-[#111] placeholder:text-[#888]"
        />
        <button type="submit" disabled={status === 'loading'} className="bg-[#111] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-60">
          {status === 'loading' ? 'Enviando' : 'Unirme'}
        </button>
      </form>

      {message ? <p className={`mt-2 text-xs ${status === 'error' ? 'text-[#9a2f2f]' : 'text-[#1b6b3a]'}`}>{message}</p> : null}
    </div>
  );
}
