export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { verifyRequest } from '../auth/helper';

export async function GET() {
  try {
    const seoSettings = await db.getSEOSettings();
    return NextResponse.json(seoSettings);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication token required' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const updated = await db.updateSEOSettings(body);
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
