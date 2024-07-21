import prisma from '~/server/db';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email: string, otp: string[] };
    console.log(body);

    const { email, otp } = body;
    const otpString = otp.join('');
    const user = await prisma.user.findUnique({ where: { email } });
     console.log
    if (!user || user.otp !== otpString) {
      return NextResponse.json({ status: false, msg: "check the details" });
    }

    await prisma.user.update({
      where: { email },
      data: { verified: true, otp: null },
    });

    return NextResponse.json({ status: true, msg: "Email verified successfully" });
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json({ status: false, msg: "Invalid JSON" }, { status: 400 });
  }
}
