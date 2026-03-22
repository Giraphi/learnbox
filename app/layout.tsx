import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";
import ShowOnPWA from "@/components/ShowOnPWA";
import InstallPrompt from "@/components/InstallPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Learnbox",
  description: "Learnbox - vault of wisdom",
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
      <body className="min-h-full flex flex-col">
        <ShowOnPWA fallback={<InstallPrompt />}>
          <main className="flex flex-1 flex-col">{children}</main>
          <BottomNavigation />
        </ShowOnPWA>
      </body>
    </html>
  );
}
