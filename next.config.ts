import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Homepage hero/story/Fan-Favorites imagery is hotlinked Unsplash stock
    // photography — placeholder art until real product photos exist (no
    // Cloudinary wiring yet, see CONTEXT_HANDOFF.md).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
