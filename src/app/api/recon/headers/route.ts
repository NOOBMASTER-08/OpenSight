import { headerRecon } from '../../../../lib/headers';

export async function GET(req: Request) {
  const domain = new URL(req.url).searchParams.get('domain');
  return Response.json(await headerRecon(domain!));
}
