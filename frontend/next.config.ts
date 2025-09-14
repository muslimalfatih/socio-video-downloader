/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS domains (for development)
      },
    ],
    // Alternative: Specify exact domains for production
    domains: [
      'i.ytimg.com',
      'img.youtube.com',
      'scontent.cdninstagram.com',
      'instagram.fdps2-1.fna.fbcdn.net',
      'scontent-*.cdninstagram.com',
      'fbcdn.net',
      '*.fbcdn.net',
      'pbs.twimg.com',
      '*.tiktokcdn.com',
    ],
  },
};

module.exports = nextConfig;
