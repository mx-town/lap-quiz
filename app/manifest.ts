import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LAP Quiz — Mechatronik Prüfungsvorbereitung",
    short_name: "LAP Quiz",
    description: "Quiz-App zur Vorbereitung auf die Lehrabschlussprüfung (LAP) für Mechatroniker",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#dc2626",
    icons: [
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  }
}
