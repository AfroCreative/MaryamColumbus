import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { campaign } from "@/lib/campaign";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${campaign.campaignName} · ${campaign.churchName}`,
  description: `Help ${campaign.churchName} raise funds for the next chapter of our church and community.`,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} js-reveal-pending`}>
      <head>
        <noscript>
          <style>{`.js-reveal-pending [data-reveal]{visibility:visible}`}</style>
        </noscript>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
