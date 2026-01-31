import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  proxy: {
    interceptors: [
      {
        // Matches your previous config.matcher
        source: ['/news/:path*', '/api/:path*'],
        handler: (request) => {
          const userAgent = request.headers.get('user-agent') || '';
          const badBots = ['curl', 'python-requests', 'scrapy', 'wget', 'Go-http-client'];
          
          const isBot = badBots.some(bot => userAgent.includes(bot));

          if (isBot) {
            return Response.json(
              { 
                error: "Bot Access Forbidden", 
                message: "Dilarang scraping website ini! Gunakan API resmi kami.",
                buy_api: "https://arshaka-news.vercel.app/subscription" 
              },
              { status: 403 }
            );
          }

          // Continue to the next interceptor or the page
          return; 
        },
      },
    ],
  },
};

export default nextConfig;
