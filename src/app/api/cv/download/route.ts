import { NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET() {
  try {
    const profile = db.getProfile();

    if (!profile.cvBase64) {
      // Fallback: If no base64 was uploaded but a manual URL is defined, redirect
      if (profile.cvUrl && profile.cvUrl !== '/api/cv/download' && profile.cvUrl !== '#') {
        return NextResponse.redirect(new URL(profile.cvUrl));
      }
      return new NextResponse('CV file has not been uploaded to MongoDB Atlas yet.', { status: 404 });
    }

    const fileBuffer = Buffer.from(profile.cvBase64, 'base64');
    const fileName = profile.cvFileName || 'gregoire_batcho_cv.pdf';
    const fileType = profile.cvFileType || 'application/pdf';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': fileType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (e: any) {
    return new NextResponse(`Error retrieving CV: ${e.message}`, { status: 500 });
  }
}
