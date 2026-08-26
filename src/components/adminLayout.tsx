"use client";

import React, { useState } from "react";
import Image from "next/image";
import Sidebar from "@/features/admin/components/sidebar";
import { Menu } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-[#f8fafc]">
      {/* Mobile Top Navigation Bar */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8">
            <Image
              src="/logo.png"
              alt="Logo PMK Daniel"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="font-plusJakarta text-sm font-extrabold text-primary tracking-tight">
              PMK DANIEL
            </h1>
            <p className="text-[10px] font-medium text-slate-400">Admin Panel</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileSidebarOpen(true)}
          aria-label="Buka Menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Sidebar (Desktop Fixed + Mobile Drawer) */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="min-w-0 flex-1 w-full md:pl-[230px] transition-all">
        {children}
      </main>
    </div>
  );
}

