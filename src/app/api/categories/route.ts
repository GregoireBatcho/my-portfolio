import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { verifyRequest } from '../auth/helper';

export async function GET() {
  try {
    const list = db.getProjectCategories();
    return NextResponse.json(list);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to retrieve categories' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication token required' }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body.nameEn || !body.nameFr) {
      return NextResponse.json({ error: 'nameEn and nameFr are required' }, { status: 400 });
    }
    const slug = body.id || body.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newCat = db.addProjectCategory({
      id: slug,
      nameEn: body.nameEn,
      nameFr: body.nameFr
    });
    return NextResponse.json(newCat, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  if (!verifyRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication token required' }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }
    const updated = db.updateProjectCategory(body.id, {
      nameEn: body.nameEn,
      nameFr: body.nameFr
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication token required' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Category ID parameters is required' }, { status: 400 });
    }
    db.deleteProjectCategory(id);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
