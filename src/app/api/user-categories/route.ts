import prisma from '~/server/db';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Replace this with your JWT secret
const JWT_SECRET = "Hello this is secret";

export async function GET(req:NextRequest) {
  try {
    const token = req.headers.get('x-axestoken');

    if (!token) {
      return NextResponse.json({ status: false, msg: 'Unauthorized user' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    if (!email) {
      return NextResponse.json({ status: false, msg: 'Unauthorized user' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ status: false, msg: 'User not found' }, { status: 404 });
    }

    // Fetch user categories
    const userCategories = await prisma.userCategory.findMany({
      where: { userId: user.id },
    });
    return NextResponse.json(userCategories, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ status: false, msg: error.message || 'Invalid JSON' }, { status: 400 });
  }
}

export async function POST(req:NextRequest) {
  try {
    const token = req.headers.get('x-axestoken');

    if (!token) {
      return NextResponse.json({ status: false, msg: 'Unauthorized user' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    if (!email) {
      return NextResponse.json({ status: false, msg: 'Unauthorized user' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ status: false, msg: 'User not found' }, { status: 404 });
    }

    // Parse the request body
    const { categoryId, selected } = await req.json();

    if (selected) {
      await prisma.userCategory.create({
        data: { userId: user.id, categoryId },
      });
    } else {
      await prisma.userCategory.deleteMany({
        where: { userId: user.id, categoryId },
      });
    }

    return NextResponse.json({ status: true, msg: 'Success' }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ status: false, msg: error.message || 'Invalid JSON' }, { status: 400 });
  }
}

// export async function handler(req:NextRequest) {
//   if (req.method === 'GET') {
//     return GET(req);
//   } else if (req.method === 'POST') {
//     return POST(req);
//   } else {
//     return NextResponse.json({ status: false, msg: 'Method not allowed' }, { status: 405 });
//   }
// }

// export { handler as GET, handler as POST };
