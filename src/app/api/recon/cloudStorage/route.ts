import { NextResponse } from 'next/server';
import { findPublicCloudStorage } from '../../../../lib/cloudStorageFinder';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json({ error: 'Domain required' }, { status: 400 });
  }

  const data = await findPublicCloudStorage(domain);

  return NextResponse.json({
    count: data.filter(d => d.public).length,
    exposed: data.filter(d => d.public)
  });
}
