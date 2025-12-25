const SECURITY_HEADERS = [
  'content-security-policy',
  'strict-transport-security',
  'x-frame-options',
  'x-content-type-options',
  'referrer-policy',
  'permissions-policy',
];

export async function headerRecon(domain: string) {
  let res: Response;

  try {
    res = await fetch(`https://${domain}`, {
      method: 'HEAD',
      redirect: 'follow',
    });
  } catch {
    res = await fetch(`http://${domain}`, {
      method: 'HEAD',
      redirect: 'follow',
    });
  }

  const headers = Object.fromEntries(res.headers.entries());

  const present: string[] = [];
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const h of SECURITY_HEADERS) {
    if (headers[h]) present.push(h);
    else missing.push(h);
  }

  // Information leakage
  if (headers['x-powered-by']) {
    warnings.push('x-powered-by exposed');
  }
  if (headers['server']) {
    warnings.push('server header exposed');
  }

  // Simple scoring model
  const score = Math.max(
    0,
    100 - missing.length * 10 - warnings.length * 5
  );

  return {
    headers,
    security: {
      present,
      missing,
      warnings,
      score,
    },
  };
}
