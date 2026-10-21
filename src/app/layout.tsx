import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Noto_Serif_Ethiopic } from "next/font/google";
import { campaign, church } from "@/lib/campaign";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const ethiopic = Noto_Serif_Ethiopic({
  variable: "--font-noto-ethiopic",
  subsets: ["ethiopic"],
  weight: ["400", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${campaign.name} · ${church.name}`,
  description: `Help ${church.name} (${church.parish}) in Columbus, Ohio raise $4 million to renovate our church home.`,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${ethiopic.variable} js-reveal-pending`}>
      <head>
        <noscript>
          <style>{`.js-reveal-pending [data-reveal]{visibility:visible}`}</style>
        </noscript>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
