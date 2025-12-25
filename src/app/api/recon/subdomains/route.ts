import { chaosSubdomains } from '../../../../lib/subdomain';

export async function GET(req: Request) {
  const domain = new URL(req.url).searchParams.get('domain');

  if (!domain) {
    return Response.json({ error: 'Domain required' }, { status: 400 });
  }

  const subs = await chaosSubdomains(
    domain,
    process.env.CHAOS_API_KEY!
  );

  return Response.json({ subdomains: subs });
}
