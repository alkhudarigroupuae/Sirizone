import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

import { CartProvider } from "../components/header/CartContext";
import { WishlistProvider } from "../components/header/WishlistContext";
import { CompareProvider } from "../components/header/CompareContext";

import AIChatWidget from "../components/common/AIChatWidget";
import DarkModeToggle from "../components/common/DarkModeToggle";
import { TranslationProvider } from "../contexts/TranslationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sirizone.com';
const SOCIAL_IMAGE = `${SITE_URL}/assets/images/logo/logo-01.svg`;

export const metadata: Metadata = {
  title: "Sirizone - Marketplace Platform",
  description: "Welcome to Sirizone Marketplace - Your trusted online shopping destination",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/assets/images/logo/logo-01.svg",
  },
  openGraph: {
    title: "Sirizone - Marketplace Platform",
    description: "Welcome to Sirizone Marketplace - Your trusted online shopping destination",
    siteName: "Sirizone",
    url: SITE_URL,
    images: [
      {
        url: SOCIAL_IMAGE,
        width: 1200,
        height: 630,
        alt: "Sirizone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sirizone - Marketplace Platform",
    description: "Welcome to Sirizone Marketplace - Your trusted online shopping destination",
    images: [SOCIAL_IMAGE],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* 🚀 Load CSS from public folder */}
        <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/css/plugins.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        
        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <TranslationProvider>
          <CompareProvider>
            <WishlistProvider>
              <CartProvider>
                {children}
                <DarkModeToggle />
                <Analytics />
              </CartProvider>
            </WishlistProvider>
          </CompareProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
