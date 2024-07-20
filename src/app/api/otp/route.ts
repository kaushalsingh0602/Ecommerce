// src/app/api/otp/route.ts
import prisma from '~/server/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // Parse the JSON body
    console.log(body); // Log the parsed body

    const email = body.email; // Extract the email or other data from the parsed body
    const otp = body.otp.join('');
     // Extract the email or other data from the parsed body
     const user = await prisma.user.findUnique({ where: { email:email } });

     if (!user || user.otp !== otp) {
       throw new Error('Invalid OTP');
     }

     await prisma.user.update({
       where: { email:email },
       data: { verified: true, otp: null },
     });
   

    return NextResponse.json({ status: true, msg: "emailverifide succes full" });
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json({ status: false, msg: "Invalid JSON" }, { status: 400 });
  }
}
