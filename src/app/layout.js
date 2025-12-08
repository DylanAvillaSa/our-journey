"use client";

import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import {
  Inter,
  Great_Vibes,
  Playfair_Display,
  Poppins,
  League_Script,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  weight: ["200", "400"],
  display: "swap",
  subsets: ["latin"],
});
const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const leagueScript = League_Script({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
const playfair = Playfair_Display({ subsets: ["latin"], display: "swap" });
const poppins = Poppins({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

export const fonts = { inter, greatVibes, playfair, poppins, leagueScript };
