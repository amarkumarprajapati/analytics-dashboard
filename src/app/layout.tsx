import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Analytics Dashboard - AI-Powered Data Analysis",
  description: "Upload, analyze, and visualize your data with AI-powered insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="h-screen overflow-hidden bg-background">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
