import { dnsAnswers } from '../../../../lib/dns';

export async function GET(req: Request) {
  const domain = new URL(req.url).searchParams.get('domain');

  if (!domain) {
    return Response.json(
      { error: 'Missing domain parameter' },
      { status: 400 }
    );
  }

  const result = await dnsAnswers(domain);
  return Response.json(result);
}
