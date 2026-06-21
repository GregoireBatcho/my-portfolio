import { NextRequest } from 'next/server';

const SECRET_SALT = process.env.ADMIN_PASSWORD || "gregoire2026";

export function signToken(): string {
  // 1 day expiry
  const payload = { admin: true, expiry: Date.now() + 24 * 60 * 60 * 1000 };
  const serialized = JSON.stringify(payload);
  const base64 = Buffer.from(serialized).toString('base64');
  const signature = Buffer.from(serialized + SECRET_SALT).toString('base64').substring(0, 16);
  return `${base64}.${signature}`;
}

export function verifyRequest(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.substring(7);
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  try {
    const serialized = Buffer.from(parts[0], 'base64').toString('utf-8');
    const payload = JSON.parse(serialized);
    if (!payload.admin || payload.expiry < Date.now()) return false;
    const computedSignature = Buffer.from(serialized + SECRET_SALT).toString('base64').substring(0, 16);
    return computedSignature === parts[1];
  } catch (_) {
    return false;
  }
}
