const GOOGLE_DNS = 'https://dns.google/resolve';

async function queryAnswer(domain: string, type: 'A' | 'AAAA') {
  const res = await fetch(
    `${GOOGLE_DNS}?name=${domain}&type=${type}`
  );

  const json = await res.json();

  // Only return Answer array
  return json.Answer || [];
}

export async function dnsAnswers(domain: string) {
  return {
    IP: await queryAnswer(domain, 'A')
  };
}
