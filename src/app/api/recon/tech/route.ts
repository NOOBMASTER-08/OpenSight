import { NextResponse } from 'next/server';
import { techFingerprint } from '../../../../lib/techFingerprint';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: 'Missing domain' }, { status: 400 });
  }

  const data = await techFingerprint(domain);

  return NextResponse.json(data);
}
