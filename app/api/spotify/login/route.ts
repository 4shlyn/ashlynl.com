import { NextResponse } from 'next/server';
import { buildAuthorizeURL } from '@/lib/spotify';

export async function GET() {
  try {
    const url = buildAuthorizeURL();
    return NextResponse.redirect(url, { status: 302 });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message ?? e) }, { status: 500 });
  }
}
