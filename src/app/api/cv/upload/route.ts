import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { verifyRequest } from '../../auth/helper';

export async function POST(req: NextRequest) {
  if (!verifyRequest(req)) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication token required' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('cvFile') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = buffer.toString('base64');

    const updatedProfile = await db.updateProfile({
      cvBase64: base64Data,
      cvFileName: file.name,
      cvFileType: file.type || 'application/pdf',
      cvUrl: '/api/cv/download'
    });

    return NextResponse.json({ 
      success: true, 
      cvUrl: '/api/cv/download',
      profile: updatedProfile
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'File processing failed' }, { status: 500 });
  }
}
