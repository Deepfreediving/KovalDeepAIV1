const nextConfig = {
  // Enable React Strict Mode for better debugging
  reactStrictMode: true,

  // Experimental settings for App Directory and Turbopack
  experimental: {
    appDir: true,
    turbopack: true,
  },

  // Rewrites configuration (if you need to rewrite URLs)
  async rewrites() {
    return [
      {
        source: '/api/old-api',
        destination: '/api/new-api',
      },
    ];
  },

  // Custom headers for pages or API routes
  async headers() {
    return [
      {
        source: '/:path*',  // Apply to all routes
        headers: [
          {
            key: 'X-Custom-Header',
            value: 'my-custom-value',
          },
        ],
      },
    ];
  },

  // Enable standalone output for deployment
  output: 'standalone',  // Can be used for Vercel deployment if needed

  // Images configuration (optional)
  images: {
    domains: ['your-image-domain.com'], // Replace with actual image domains
  },

  // You can configure more Next.js settings here if necessary
};

export default nextConfig;
