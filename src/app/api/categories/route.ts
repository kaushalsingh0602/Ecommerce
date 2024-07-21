import prisma from '~/server/db';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Replace this with your JWT secret
const JWT_SECRET = "Hello this is secret"
export async function POST(req: NextRequest) {
  try {
    console.log ("hello")
    // Get the JWT token from the headers
    const token = req.headers.get('x-axestoken');

    if (!token) {
      return NextResponse.json({ status: false, msg: 'Unauthorized user' }, { status: 401 });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    if (!email) {
      return NextResponse.json({ status: false, msg: 'Unauthorized user' }, { status: 401 });
    }

    // Extract page and limit from query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '6', 10);
    const offset = (page - 1) * limit;

    // Extract the email or other data from the parsed body
    const user = await prisma.user.findUnique({ where: { email } });

    console.log(user)

    if (!user) {
      return NextResponse.json({ status: false, msg: 'User not found' }, { status: 404 });
    }

    // Fetch the category data with pagination
    const categories = await prisma.category.findMany({
      skip: offset,
      take: limit,
    });
    console.log(categories)

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
    return NextResponse.json({ status: false, msg: error.message || "Invalid JSON" }, { status: 400 });
  }
}
