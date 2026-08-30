import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Azure serves a static export from Nginx. Vinext continues to use
  // vite.config.ts for local and Codex Sites builds.
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;
