import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AppBootstrap from "@/components/layout/AppBootstrap";
import Toaster from "@/components/ui/Toaster";
import { categoriesService } from "@/services/categories.service";
import type { Category } from "@/types";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "FreshCart – Quality products delivered to your door", template: "%s | FreshCart" },
  description: "Shop fashion, electronics, beauty and more at FreshCart. Free shipping on orders over 500 EGP.",
};

export const dynamic = "force-dynamic";

async function getNavCategories(): Promise<Category[]> {
  try {
    return await categoriesService.list();
  } catch {
    return [];
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await getNavCategories();
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <TopBar />
        <Header categories={categories} />
        <main id="main">{children}</main>
        <Footer />
        <AppBootstrap />
        <Toaster />
      </body>
    </html>
  );
}
