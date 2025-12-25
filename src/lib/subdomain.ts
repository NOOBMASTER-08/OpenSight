const CHAOS_API = 'https://dns.projectdiscovery.io/dns';

export async function chaosSubdomains(
  domain: string,
  apiKey: string
): Promise<string[]> {
  try {
    const res = await fetch(
      `${CHAOS_API}/${domain}/subdomains`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        cache: 'no-store',
      }
    );

    if (!res.ok) {
      throw new Error('CHAOS API request failed');
    }

    const data = await res.json();

    // CHAOS returns: { subdomains: ["api", "dev", "mail"] }
    if (!Array.isArray(data.subdomains)) {
      return [];
    }

    // Convert to FQDN
    return data.subdomains.map(
      (sub: string) => `${sub}.${domain}`
    );
  } catch (err) {
    console.error('CHAOS error:', err);
    return [];
  }
}
