import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VELOURA | Premium Fashion Brand",
  description: "Explore the new standard in modern fashion. Crafted with precision, designed for utility, defined by minimalistic elegance. Discover Men, Women, and Kids collections.",
  keywords: "fashion, luxury, minimalist dress, organic cotton tee, premium jackets, Veloura, Zara style clothing",
  openGraph: {
    title: "VELOURA | Premium Fashion Brand",
    description: "Explore the new standard in modern fashion. Crafted with precision, designed for utility.",
    url: "https://veloura.com",
    siteName: "VELOURA",
    locale: "en_US",
    type: "website",
  }
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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-black dark:bg-[#0a0a0a] dark:text-white transition-colors duration-200">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

