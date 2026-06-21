export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { verifyRequest } from '../auth/helper';

export async function GET() {
  try {
    const list = await db.getSoftSkills();
    return NextResponse.json(list);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication token required' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const newSkill = await db.addSoftSkill(body);
    return NextResponse.json(newSkill, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
