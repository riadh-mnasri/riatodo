// © 2026 Riadh MNASRI
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { SwRegister } from "@/components/SwRegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RiaTodo",
  description: "Tes tâches, triées par priorité. Simple, rapide, sur ton téléphone.",
  applicationName: "RiaTodo",
  appleWebApp: { capable: true, title: "RiaTodo", statusBarStyle: "default" },
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/icon-192.png", sizes: "192x192" }],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#14120f" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${geistSans.variable} antialiased`}>
      <body>
        {children}
        <SwRegister />
      </body>
    </html>
  );
}
