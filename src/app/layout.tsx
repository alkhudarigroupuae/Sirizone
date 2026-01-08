import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import { CartProvider } from "../components/header/CartContext";
import { WishlistProvider } from "../components/header/WishlistContext";
import { CompareProvider } from "../components/header/CompareContext";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
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

export const metadata: Metadata = {
  title: "Sirizone - Marketplace Platform",
  description: "Welcome to Sirizone Marketplace - Your trusted online shopping destination",
  icons: {
    icon: "/assets/images/fav.png",
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
                <ToastContainer position="top-right" autoClose={3000} />
                <AIChatWidget />
                <DarkModeToggle />
              </CartProvider>
            </WishlistProvider>
          </CompareProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
