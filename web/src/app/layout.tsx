import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ContextOS",
  description: "Kinetic Sanctuary — an agentic to-do workspace.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-surface text-on-surface min-h-screen antialiased selection:bg-primary/20">
        <Sidebar />
        <Header />
        <main className="ml-64 pt-16 min-h-screen bg-surface p-10">{children}</main>
      </body>
    </html>
  );
}
