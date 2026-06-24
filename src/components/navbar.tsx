import Link from "next/link";

export default function Navbar() {
  return (

    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-full max-w-5xl px-8 py-3 bg-white/70 backdrop-blur-md rounded-full shadow-sm border border-white/20">

      {/* 1. Bagian Kiri: Logo */}
      <div className="flex items-center">
        {/* Logo PMK Daniel */}
        <img src="/logo.png" alt="Logo PMK Daniel" className="h-10 w-auto" />
      </div>

      {/* 2. Bagian Tengah: Menu Tautan */}
      <ul className="flex items-center gap-8 text-sm font-medium text-gray-700">
        <li><Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link></li>
        <li><Link href="/tentang" className="hover:text-blue-600 transition-colors">Tentang Kami</Link></li>
        <li><Link href="/pengumuman" className="hover:text-blue-600 transition-colors">Pengumuman</Link></li>
        <li><Link href="/pengurus" className="hover:text-blue-600 transition-colors">Kepengurusan</Link></li>
        <li><Link href="/form" className="hover:text-blue-600 transition-colors">Form & Pendataan</Link></li>
        <li><Link href="#kontak" className="hover:text-blue-600 transition-colors">Kontak</Link></li>
      </ul>

      {/* 3. Bagian Kanan: Tombol CTA */}
      <div>
        <button className="px-6 py-2.5 text-sm font-semibold text-white transition-opacity rounded-full bg-gradient-to-r from-indigo-700 to-orange-400 hover:opacity-90 shadow-md">
          Join Us!
        </button>
      </div>

    </nav>
  );
}