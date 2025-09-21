import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const c = cookies();
  const all = c.getAll().map(({ name, value }) => ({ name, value: value?.slice(0, 6) + '…' }));
  const access = c.get('sp_access')?.value ? 'present' : 'missing';
  const refresh = c.get('sp_refresh')?.value ? 'present' : 'missing';
  const exp = c.get('sp_exp')?.value ?? 'missing';
  return NextResponse.json({ access, refresh, exp, all });
}
