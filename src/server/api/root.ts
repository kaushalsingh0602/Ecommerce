import { createRouter } from './trpc';
import { postRouter } from './routers/post';

export const appRouter = createRouter().merge('post.',postRouter);

export type AppRouter = typeof appRouter;
