import { NextResponse } from 'next/server';
import { githubRecon } from '../../../../lib/github';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json(
      { error: 'Domain required' },
      { status: 400 }
    );
  }

  try {
    const data = await githubRecon(domain);
    return NextResponse.json(data);
  } catch (err) {
    console.error('GitHub recon error:', err);
    return NextResponse.json(
      { error: 'GitHub recon failed' },
      { status: 500 }
    );
  }
}
