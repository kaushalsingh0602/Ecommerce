
import React from 'react';
import Link from 'next/link';
import prisma from '../server/db';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { redirect } from 'next/navigation';

interface User {
  name: string;
  email: string;
  password: string;
  verified?: boolean;
  otp?: string; // Changed 'any' to 'string'
}

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const Register: React.FC = () => {
  const handleRegister = async (formData: FormData) => {
    "use server";
    
    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    if (!name || !email || !password) {
      alert('Please fill out all fields.');
      return;
    }

    const user: User = {
      name: name,
      email: email,
      password: password,
    };

    const find = await prisma.user.findUnique({ where: { email: user.email } });
    console.log(find);
    if (!find) {
      function generate8DigitCode(): string {
        return Math.floor(10000000 + Math.random() * 90000000).toString();
      }

      const otp = generate8DigitCode();
      const hashedPassword = await bcrypt.hash(user.password, 6);
      const creatUser = await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          otp: otp,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: creatUser.email,
        subject: 'Verify your email',
        text: `Your OTP code is ${otp}`,
      };

      await transporter.sendMail(mailOptions);
      redirect('/otp?email=' + user.email);
    } else {
      redirect('/login');
    }
  };

  return (
    <form action={handleRegister}>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Create your account</h1>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300">
            Create Account
          </button>
          <p className="mt-4 text-center">
            Have an Account? <Link href="/login" className="text-blue-500">Login</Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default Register;
