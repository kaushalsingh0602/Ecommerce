import { createRouter } from '../trpc';
import { z } from 'zod';
import prisma from '../../db';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer'



export const authRouter = createRouter()
  .mutation('register', {
    input: object({
      name: z.string().name(),
      email: z.string().email(),
      password: z.string().min(6),
    }),
    async resolve({ input }) {
      const hashedPassword = await bcrypt.hashed (input.password, 10);
      const otp = crypto.randomBytes(3).toString('hex');

      const user = await prisma.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          otp,
        },
      });

    

      return { success: true, message: 'User registered. Check your email for OTP.', email:input.email };
    },
  })
  .mutation('verifyOtp', {
    input: z.object({
      email: z.string().email(),
      otp: z.string(),
    }),
    async resolve({ input }) {
      const user = await prisma.user.findUnique({ where: { email: input.email } });

      if (!user || user.otp !== input.otp) {
        throw new Error('Invalid OTP');
      }

      await prisma.user.update({
        where: { email: input.email },
        data: { verified: true, otp: null },
      });

      return { success: true, message: 'Email verified' };
    },
  })
  .mutation('login', {
    input: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
    async resolve({ input }) {
      const user = await prisma.user.findUnique({ where: { email: input.email }  });

      if (!user) {
        throw new Error('Invalid email');
      }

      const isPasswordValid = await bcrypt.compare(input.password, user.password);

      if (!isPasswordValid) {
        throw new Error('Invalid password ');
      }

      if (!user.verified) {
        throw new Error('Email not verified');
      }

      // Generate a session or JWT token (not implemented here)

      return { success: true, message: 'Logged in' };
    },
  });
