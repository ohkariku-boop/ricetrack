import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RiceTrack — Calorie tracking built for Asian food",
  description:
    "Snap a photo of rice bowls, stir-fries, noodles, and shared plates. Cuisine-aware AI with an Asian food library — more honest than Western-first trackers.",
  applicationName: "RiceTrack",
  keywords: [
    "calorie tracker",
    "Asian food",
    "AI nutrition",
    "macro tracker",
    "Chinese Japanese Korean Thai food calories",
  ],
  openGraph: {
    title: "RiceTrack — Calorie tracking built for Asian food",
    description:
      "Photo AI that understands wok oil, coconut milk, and shared plates. Plus an Asian dish library.",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RiceTrack",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#070a08" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
