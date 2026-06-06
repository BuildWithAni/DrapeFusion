import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DrapeFusion — AI-Powered Virtual Try-On",
  description:
    "Upload your garment and model photo. Get studio-quality catalog images in seconds. No photoshoot needed.",
  keywords: [
    "virtual try-on",
    "AI fashion",
    "catalog images",
    "garment photo",
    "saree try-on",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${dmSans.variable} ${spaceMono.variable}`}
    >
      <body className="min-h-screen bg-bg-primary text-text-primary antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#18181C",
              border: "1px solid rgba(201, 168, 76, 0.15)",
              color: "#F5F0E8",
            },
          }}
        />
      </body>
    </html>
  );
}
