import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo List Backoffice",
  description: "Backoffice management for Todo List app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-x-hidden">
      {/* Sidebar ติดซ้าย */}
      <Sidebar />

      {/* เนื้อหาหลัก ขยับหลบ Sidebar ชิดขอบขวา */}
      <div className="ml-[220px] min-h-screen bg-white">
        <Navbar />

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
