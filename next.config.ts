import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/r/:style(base-[^/]+)/:name", destination: "/r/base/:name" },
      { source: "/r/:style/:name", destination: "/r/:name" },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
}

export default nextConfig
