import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PublicShell } from "@/components/layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://onedotabm.com"),
  title: {
    default: "OneDot ABM — Marketing Agency & Web Development",
    template: "%s | OneDot ABM",
  },
  description:
    "OneDot ABM combines strategic marketing and custom web development to help businesses attract customers, build stronger digital experiences, and achieve measurable growth.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://onedotabm.com",
    siteName: "OneDot ABM",
    title: "OneDot ABM — Marketing Agency & Web Development",
    description:
      "Marketing brings the audience. Web development builds the digital experience that converts. High-performance marketing and custom web applications.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased light`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F7F5] text-[#111111] selection:bg-[#1400FF] selection:text-white">
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
