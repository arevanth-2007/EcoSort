import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EcoSort — AI-Powered Smart Waste Segregation & Rewards",
  description:
    "Transform segregated waste into real environmental impact and Green Coins. Automated computer vision verification for civic sustainability across Indian smart cities.",
  keywords: [
    "waste segregation",
    "AI waste classification",
    "green rewards",
    "sustainability platform",
    "circular economy",
    "smart cities India",
    "recycling rewards",
  ],
  authors: [{ name: "EcoSort Sustainability Platform" }],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="bg-slate-50/70 text-slate-900 font-sans min-h-screen flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900">
        {children}
      </body>
    </html>
  );
}
