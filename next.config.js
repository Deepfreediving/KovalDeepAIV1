const nextConfig = {
  // Enable React Strict Mode for better debugging
  reactStrictMode: true,

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
  output: 'standalone',  // For Vercel or other deployment platforms

  // Images configuration (optional)
  images: {
    domains: ['background.jpg'], // Replace with actual image domains
  },

  // You can configure more Next.js settings here if necessary
};

module.exports = nextConfig;
