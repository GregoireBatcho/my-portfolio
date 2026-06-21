import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const host = req.nextUrl.origin;
  const content = `User-agent: *\nAllow: /\nSitemap: ${host}/sitemap.xml`;
  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    }
  });
}
