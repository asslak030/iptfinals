/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. 
 * This is especially useful for Docker builds.
 */
import "./src/env.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ Don't block production builds on ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
