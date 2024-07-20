const { env } = require('./src/env');

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: env.NEXT_PUBLIC_API_URL,
    ANOTHER_ENV_VARIABLE: env.ANOTHER_ENV_VARIABLE,
    // Add other environment variables here
  },
  // other Next.js config options
};

module.exports = nextConfig;
