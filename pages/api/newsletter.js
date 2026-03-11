// newsletter.js: endpoint de suscripción con soporte opcional para Mailchimp.
function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

async function subscribeMailchimp(email) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !audienceId || !serverPrefix) {
    return { mode: 'mock' };
  }

  const endpoint = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email_address: email,
      status: 'pending'
    })
  });

  const data = await res.json();

  if (!res.ok) {
    const title = data?.title || 'Mailchimp error';
    const detail = data?.detail || 'No se pudo suscribir el email.';
    throw new Error(`${title}: ${detail}`);
  }

  return { mode: 'mailchimp' };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const email = req.body?.email;

  if (!validEmail(email)) {
    return res.status(400).json({ message: 'Email no válido.' });
  }

  try {
    const result = await subscribeMailchimp(email);

    return res.status(200).json({
      ok: true,
      mode: result.mode,
      message:
        result.mode === 'mailchimp'
          ? 'Suscripción enviada. Confirma el correo para activar notificaciones.'
          : 'Suscripción guardada en modo prueba. Configura Mailchimp para activación real.'
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Error en suscripción' });
  }
}
