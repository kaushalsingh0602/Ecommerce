import prisma from '~/server/db';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

// Replace this with your JWT secret
const JWT_SECRET = "Hello this is secret";

// Define the expected JWT payload interface
interface MyJwtPayload extends JwtPayload {
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('x-axestoken');

    if (!token) {
      return NextResponse.json({ status: false, msg: 'Unauthorized user' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as MyJwtPayload;
    const email = decoded.email;

    if (!email) {
      return NextResponse.json({ status: false, msg: 'Unauthorized user' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '6', 10);
    const offset = (page - 1) * limit;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ status: false, msg: 'User not found' }, { status: 404 });
    }

    const categories = await prisma.category.findMany({
      skip: offset,
      take: limit,
    });

    const totalCategories = await prisma.category.count();
    const totalPages = Math.ceil(totalCategories / limit);

    return NextResponse.json({
      status: true,
      msg: "Email verified successfully",
      categories,
      pagination: {
        totalCategories,
        totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ status: false, msg: "Invalid JSON" }, { status: 400 });
  }
}
