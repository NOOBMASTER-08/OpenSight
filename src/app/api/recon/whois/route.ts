import { NextResponse } from 'next/server';
import { getWhois } from '../../../../lib/whois';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: 'Domain required' }, { status: 400 });
  }

  try {
    const result = await getWhois(domain);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: 'WHOIS lookup failed' },
      { status: 500 }
    );
  }
}
