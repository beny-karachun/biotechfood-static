/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export during 'next build' (production).
  // In dev mode, Turbopack needs normal server rendering for dynamic routes.
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
  // Ensure the app works correctly when deployed to a GitHub Pages subpath
  basePath: process.env.NODE_ENV === 'production' ? '/biotechfood-static' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/biotechfood-static/' : '',
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
