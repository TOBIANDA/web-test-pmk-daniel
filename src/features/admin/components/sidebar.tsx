"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Megaphone, FileSpreadsheet, Users, LogOut, X } from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const navContent = (
    <div className="flex h-full w-[230px] flex-col bg-white border-r border-slate-200/80 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Brand Banner */}
      <div className="relative flex h-[180px] sm:h-[200px] w-full flex-col items-center justify-center bg-gradient-to-b from-primary via-primary to-[#172a6b] px-4 text-center overflow-hidden">
        {/* Mobile Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Menu"
            className="absolute top-3 right-3 p-1.5 text-white/80 hover:text-white rounded-full bg-white/10 md:hidden transition-colors"
          >
            <X size={18} />
          </button>
        )}

        <div className="relative h-[58px] w-[58px] sm:h-[68px] sm:w-[68px] drop-shadow-md">
          <Image
            src="/logo.png"
            alt="Logo PMK Daniel"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="mt-2 font-plusJakarta text-base sm:text-lg font-extrabold text-white tracking-wide">
          PMK DANIEL
        </h2>
        <p className="text-[10px] sm:text-[11px] font-medium text-slate-300">
          Admin Management
        </p>
      </div>

      {/* Menu Navigation */}
      <nav className="mt-4 sm:mt-6 flex w-full flex-col px-3 gap-1 overflow-y-auto">
        <Link
          href="/daudpakeketapel"
          onClick={handleLinkClick}
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
          onClick={handleLinkClick}
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
          onClick={handleLinkClick}
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
          onClick={handleLinkClick}
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
      <div className="mt-auto p-4 border-t border-slate-100">
        <Link
          href="/pausmakanyunus"
          onClick={() => {
            handleLinkClick();
            if (typeof window !== "undefined") {
              localStorage.removeItem("pmk_admin_token");
              localStorage.removeItem("admin_token");
              localStorage.removeItem("admin_user");
            }
          }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-sm transition-colors"
        >
          <LogOut size={19} />
          <span>Keluar</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 z-40 h-full w-[230px]">
        {navContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs md:hidden transition-opacity"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[230px] md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {navContent}
      </div>
    </>
  );
}