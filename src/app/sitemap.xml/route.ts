import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';

export async function GET(req: NextRequest) {
  const host = req.nextUrl.origin;
  try {
    const projects = await db.getProjects();
    const projectUrls = projects.map(p => `  <url>
    <loc>${host}/projects/${p.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n');

    const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${host}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${host}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${host}/projects</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${host}/experience</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${host}/skills</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${host}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
${projectUrls}
</urlset>`;

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'application/xml',
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
