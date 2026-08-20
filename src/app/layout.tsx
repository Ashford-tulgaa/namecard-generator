import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Free Digital Name Card Generator with QR Code | Ariona",
  description:
    "Create a free digital business card with a QR code that saves straight to any phone's contacts. No sign-up, no watermark — everything runs in your browser.",
  keywords: [
    "digital business card",
    "QR code business card",
    "vCard generator",
    "free name card generator",
  ],
  applicationName: "Ariona Name Cards",
  openGraph: {
    title: "Free Digital Name Card Generator with QR Code",
    description:
      "Build a digital business card with a scannable QR code in seconds. Free, private, no sign-up.",
    siteName: "Ariona Name Cards",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Free Digital Name Card Generator with QR Code",
    description:
      "Build a digital business card with a scannable QR code in seconds. Free, private, no sign-up.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
