import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Next.js 16 / Turbopack Stability */
  // Auto-detect root to avoid resolution issues with parent directory

  
  // Explicitly allow the dev server to accept connections from your network IP
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    '100.84.65.50:3000'
  ],


  experimental: {
    // Next.js 16 experimental flags if any
  }
};

export default nextConfig;
