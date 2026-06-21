import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { verifyRequest } from '../../auth/helper';

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: RouteParams) {
  if (!verifyRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication token required' }, { status: 401 });
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await db.updateSoftSkill(id, body);
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  if (!verifyRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication token required' }, { status: 401 });
  }
  try {
    const { id } = await params;
    await db.deleteSoftSkill(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
