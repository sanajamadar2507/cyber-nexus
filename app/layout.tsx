import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CYBER NEXUS | Graph-Based Network Security & Resilience System",
  description:
    "An Intelligent Graph-Based Network Security & Resilience Analysis System applying Discrete Mathematics (Graph Theory and Trees) to computer network resilience, routing, and vulnerability modeling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-cyber-950 text-slate-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
