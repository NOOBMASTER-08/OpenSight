

const BUILTWITH_KEY = process.env.BUILTWITH_API_KEY!;

type TechResult = {
  name: string;
  source: string;
};

async function builtWith(domain: string): Promise<TechResult[]> {
  try {
    const res = await fetch(
      `https://api.builtwith.com/v20/api.json?KEY=${BUILTWITH_KEY}&LOOKUP=${domain}`
    );
    const json = await res.json();

    const results =
      json?.Results?.[0]?.Result?.Paths?.[0]?.Technologies || [];

    return results.map((t: any) => ({
      name: t.Name,
      source: 'BuiltWith'
    }));
  } catch {
    return [];
  }
}

async function headerFingerprint(domain: string): Promise<TechResult[]> {
  try {
    const res = await fetch(`https://${domain}`, {
      method: 'HEAD',
      redirect: 'follow'
    });

    const tech: TechResult[] = [];
    const h = res.headers;

    if (h.get('server'))
      tech.push({ name: h.get('server')!, source: 'Header' });

    if (h.get('x-powered-by'))
      tech.push({ name: h.get('x-powered-by')!, source: 'Header' });

    if (h.get('cf-ray'))
      tech.push({ name: 'Cloudflare', source: 'Header' });

    if (h.get('x-vercel-id'))
      tech.push({ name: 'Vercel', source: 'Header' });

    if (h.get('x-amz-cf-id'))
      tech.push({ name: 'AWS CloudFront', source: 'Header' });

    return tech;
  } catch {
    return [];
  }
}

async function htmlFingerprint(domain: string): Promise<TechResult[]> {
  try {
    const res = await fetch(`https://${domain}`);
    const html = await res.text();
    const tech: TechResult[] = [];

    if (html.includes('__NEXT_DATA__'))
      tech.push({ name: 'Next.js', source: 'HTML' });

    if (html.includes('react-root'))
      tech.push({ name: 'React', source: 'HTML' });

    if (html.includes('wp-content'))
      tech.push({ name: 'WordPress', source: 'HTML' });

    if (html.includes('Shopify.theme'))
      tech.push({ name: 'Shopify', source: 'HTML' });

    if (html.includes('angular'))
      tech.push({ name: 'Angular', source: 'HTML' });

    return tech;
  } catch {
    return [];
  }
}

export async function techFingerprint(domain: string) {
  const [bw, headers, html] = await Promise.all([
    builtWith(domain),
    headerFingerprint(domain),
    htmlFingerprint(domain)
  ]);

  const merged = [...bw, ...headers, ...html];

  // Deduplicate
  const unique = Array.from(
    new Map(merged.map(t => [t.name, t])).values()
  );

  return {
    count: unique.length,
    technologies: unique
  };
}
