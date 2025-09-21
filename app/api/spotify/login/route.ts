import { NextResponse } from 'next/server';
import { buildAuthorizeURL } from '@/lib/spotify';

export async function GET() {
  const url = buildAuthorizeURL();
  return NextResponse.redirect(url, { status: 302 });
}
