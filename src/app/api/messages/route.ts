export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { verifyRequest } from "../auth/helper";

export async function GET(req: NextRequest) {
  if (!verifyRequest(req)) {
    return NextResponse.json(
      { error: "Unauthorized: Admin authentication token required" },
      { status: 401 },
    );
  }
  try {
    const messages = await db.getMessages();
    return NextResponse.json(messages);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are strictly required." },
        { status: 400 },
      );
    }

    const savedMsg = await db.addMessage({ name, email, subject, message });

    // Resend email notification (real or mock)
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        console.log(
          `[Resend Alert Next.js] Attempting real mail dispatch for ${name}...`,
        );
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendKey}`,
          },
          body: JSON.stringify({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: "batchogregoire0@gmail.com",
            subject: `[Contact Portfolio] ${subject} - from ${name}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; padding: 24px; background: #0c0a09; color: #f5f5f4; border-radius: 12px; border: 1px solid #d97736;">
                <h2 style="color: #d97736; border-bottom: 2px solid #292524; padding-bottom: 12px; margin-top: 0;">New Contact Form Message</h2>
                <p><strong>Sender Name:</strong> ${name}</p>
                <p><strong>Sender Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <div style="background: #1c1917; padding: 16px; border-radius: 8px; border-left: 4px solid #d97736; margin: 20px 0;">
                  <p style="margin: 0; white-space: pre-line; line-height: 1.6;">${message}</p>
                </div>
                <p style="font-size: 11px; color: #a8a29e; margin-bottom: 0;">Submitted via portfolio-db.json dynamic tracking engine.</p>
              </div>
            `,
          }),
        });
        const resendJson = await resendResponse.json();
        console.log(
          `[Resend OK Next.js] Email dispatched correctly:`,
          resendJson,
        );
      } catch (mailError) {
        console.error("Resend delivery failed but data saved:", mailError);
      }
    } else {
      console.log("=========================================");
      console.log(`[SIMULATED EMAIL NOTIFICATION VIA RESEND (NEXT.JS)]`);
      console.log(`To: batchogregoire0@gmail.com`);
      console.log(`From: portfolio-contact@gregoire.net`);
      console.log(`Subject: [Contact Portfolio] ${subject} - from ${name}`);
      console.log(`Body: ${message}`);
      console.log("=========================================");
    }

    return NextResponse.json(savedMsg, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
