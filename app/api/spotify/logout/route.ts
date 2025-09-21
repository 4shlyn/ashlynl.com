// app/api/spotify/logout/route.ts
import { NextResponse } from 'next/server';
import { clearTokens } from '@/lib/spotify';

export async function POST() {
  clearTokens();
  return NextResponse.json({ ok: true });
}
