import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "By Order — Daily Peaky Blinders Companion",
    short_name: "By Order",
    description: "Your daily ritual. A fresh quote, a daily challenge, and an empire to build.",
    start_url: "/today",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#c9a84c",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
