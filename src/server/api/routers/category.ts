import { createRouter } from '../trpc';
import { z } from 'zod';
import prisma from '../../db';

export const categoryRouter = createRouter()
  .query('list', {
    input: z.object({
      page: z.number().min(1),
    }),
    async resolve({ input }) {
      const pageSize = 6;
      const categories = await prisma.category.findMany({
        skip: (input.page - 1) * pageSize,
        take: pageSize,
      });

      return { categories };
    },
  });
