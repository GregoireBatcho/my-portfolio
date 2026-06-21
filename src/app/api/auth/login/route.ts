import { NextRequest, NextResponse } from 'next/server';
import { signToken } from '../helper';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const securePassword = process.env.ADMIN_PASSWORD || "gregoire2026";

    if (password === securePassword) {
      const token = signToken();
      return NextResponse.json({
        token,
        user: { name: 'Grégoire BATCHO', role: 'admin' }
      });
    }

    return NextResponse.json(
      { error: 'Invalid admin credentials.' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Bad request' },
      { status: 400 }
    );
  }
}
