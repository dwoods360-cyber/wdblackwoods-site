import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AnalyticsClient from "@/components/AnalyticsClient";
import { createPageMetadata, siteUrl } from "@/lib/siteMetadata";
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
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/favicon.ico",
  },
  ...createPageMetadata({
    title: "W.D. Blackwoods",
    description:
      "A restrained archive for What Coffee Demands: narrative records, fragments, and structural notes from an unfolding literary world.",
    path: "/",
  }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AnalyticsClient />
        {children}
      </body>
    </html>
  );
}
