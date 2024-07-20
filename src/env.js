// src/env.js
const { z } = require('zod');
const { createEnv } = require('@t3-oss/env-core');

const env = createEnv({
  clientPrefix: 'NEXT_PUBLIC_',
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    ANOTHER_ENV_VARIABLE: z.string(),
    // Add other server-side environment variables
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().url(),
    // Add other client-side environment variables
  },
  runtimeEnv: process.env,
  onValidationError: (error) => {
    throw new Error(`Invalid environment variables: ${error}`);
  },
});

module.exports = env;
