/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export during 'next build' (production).
  // In dev mode, Turbopack needs normal server rendering for dynamic routes.
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
  // No basePath/assetPrefix needed — site is served at root via custom domain (bfe.technionprep.com)
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
