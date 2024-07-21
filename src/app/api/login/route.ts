import prisma from '~/server/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { email: string, password: string };
    console.log(body);

    const { email, password } = body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ status: false, msg: "Please enter valid email" });
    }

    if (!user.verified) {
      return NextResponse.json({ status: false, msg: "Email is not verified" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ status: false, msg: "Please check your password" });
    }

    const token = jwt.sign({ email }, "Hello this is secret");

    return NextResponse.json({ status: true, msg: "Login successful", token });
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return NextResponse.json({ status: false, msg: "Invalid JSON" }, { status: 400 });
  }
}
