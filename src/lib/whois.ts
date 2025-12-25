type WhoisResult = {
  domain: string;
  registrar: string;
  created?: string;
  updated?: string;
  expires?: string;
  nameservers: string[];
};

const RDAP_ENDPOINT = 'https://rdap.org/domain/';

function extractRegistrar(entities: any[]): string {
  if (!entities) return 'Unknown';

  for (const e of entities) {
    if (e.roles?.includes('registrar')) {
      const fn = e.vcardArray?.[1]?.find((v: any) => v[0] === 'fn');
      return fn?.[3] || 'Unknown';
    }
  }
  return 'Unknown';
}

function extractEvent(events: any[], type: string) {
  return events?.find((e: any) => e.eventAction === type)?.eventDate;
}

export async function getWhois(domain: string): Promise<WhoisResult> {
  const res = await fetch(`${RDAP_ENDPOINT}${domain}`, {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error('RDAP lookup failed');
  }

  const data = await res.json();

  return {
    domain: data.ldhName,
    registrar: extractRegistrar(data.entities),
    created: extractEvent(data.events, 'registration'),
    updated: extractEvent(data.events, 'last changed'),
    expires: extractEvent(data.events, 'expiration'),
    nameservers: data.nameservers?.map((ns: any) => ns.ldhName) || []
  };
}
