"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Megaphone, FileSpreadsheet, Users, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-[230px] flex-col bg-white border-r border-slate-200/80 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Brand Banner */}
      <div className="relative flex h-[200px] w-full flex-col items-center justify-center bg-gradient-to-b from-primary via-primary to-[#172a6b] px-4 text-center overflow-hidden">
        <div className="relative h-[68px] w-[68px] drop-shadow-md">
          <Image
            src="/logo.png"
            alt="Logo PMK Daniel"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="mt-2 font-plusJakarta text-lg font-extrabold text-white tracking-wide">
          PMK DANIEL
        </h2>
        <p className="text-[11px] font-medium text-slate-300">
          Admin Management
        </p>
      </div>

      {/* Menu Navigation */}
      <nav className="mt-6 flex w-full flex-col px-3 gap-1">
        <Link
          href="/daudpakeketapel"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
            pathname === "/daudpakeketapel"
              ? "bg-primary/10 text-primary font-bold shadow-sm"
              : "text-slate-600 hover:bg-slate-50 hover:text-primary"
          }`}
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/limarotiduaikan"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
            pathname?.startsWith("/limarotiduaikan")
              ? "bg-primary/10 text-primary font-bold shadow-sm"
              : "text-slate-600 hover:bg-slate-50 hover:text-primary"
          }`}
        >
          <Megaphone size={19} />
          <span>Pengumuman</span>
        </Link>
        <Link
          href="/bahteranabinuh"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
            pathname?.startsWith("/bahteranabinuh")
              ? "bg-primary/10 text-primary font-bold shadow-sm"
              : "text-slate-600 hover:bg-slate-50 hover:text-primary"
          }`}
        >
          <FileSpreadsheet size={19} />
          <span>Formulir</span>
        </Link>
        <Link
          href="/rumahtanggaallah"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
            pathname?.startsWith("/rumahtanggaallah")
              ? "bg-primary/10 text-primary font-bold shadow-sm"
              : "text-slate-600 hover:bg-slate-50 hover:text-primary"
          }`}
        >
          <Users size={19} />
          <span>Kepengurusan</span>
        </Link>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto p-4">
        <Link
          href="/pausmakanyunus"
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.removeItem("pmk_admin_token");
              localStorage.removeItem("admin_token");
            }
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-sm transition-colors"
        >
          <LogOut size={19} />
          <span>Keluar</span>
        </Link>
      </div>
    </aside>
  );
}