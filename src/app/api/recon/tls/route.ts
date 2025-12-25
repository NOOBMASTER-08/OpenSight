import { tlsRecon } from '../../../../lib/tls';

export async function GET(req: Request) {
  const domain = new URL(req.url).searchParams.get('domain');
  return Response.json(await tlsRecon(domain!));
}
