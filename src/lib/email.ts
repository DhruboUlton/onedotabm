/**
 * Sends one email through Resend's HTTP API, with no dependency. Returns false
 * (and logs) when RESEND_API_KEY is not set or the send fails: a notification
 * must never be the reason a visitor's form submission fails.
 */
export async function sendEmail(opts: { to: string; subject: string; html: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn('[email] RESEND_API_KEY not set - notification skipped');
    return false;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'OneDot ABM <leads@onedotabm.com>',
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
      }),
    });
    if (!res.ok) console.error('[email] send failed', res.status, await res.text().catch(() => ''));
    return res.ok;
  } catch (e) {
    console.error('[email] send failed', e);
    return false;
  }
}

/** Form input goes straight into an HTML email, so escape it. */
export function esc(v: unknown): string {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
