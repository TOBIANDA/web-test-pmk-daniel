"use client";

import React from "react";
import Image from "next/image";

interface DivisionLogoProps {
  divisionId?: string;
  variant?: "auto" | "light" | "dark"; // light = for white background (blue graphic), dark = for blue background (white graphic)
  className?: string;
  size?: number;
}

const LOGO_MAP: Record<string, { light: string; dark: string }> = {
  ketua_umum: {
    light: "/images/logos/ketua umum bg putih.png",
    dark: "/images/logos/ketua umum bg biru.png",
  },
  wakil_ketua_umum: {
    light: "/images/logos/waketum bg putih.png",
    dark: "/images/logos/waketum bg biru.png",
  },
  sekretaris: {
    light: "/images/logos/sekretaris bg putih.png",
    dark: "/images/logos/sekretaris bg biru.png",
  },
  bendahara: {
    light: "/images/logos/bendahara bg putih.png",
    dark: "/images/logos/bendahara bg biru.png",
  },
  pembinaan: {
    light: "/images/logos/pembinaan bg putih.png",
    dark: "/images/logos/pembinaan bg biru.png",
  },
  pemerhati: {
    light: "/images/logos/pemerhati bg putih.png",
    dark: "/images/logos/pemerhati bg biru.png",
  },
  acara: {
    light: "/images/logos/acara bg putih.png",
    dark: "/images/logos/acara bg biru.png",
  },
  media_relasi: {
    light: "/images/logos/media relasi bg putih.png",
    dark: "/images/logos/media relasi bg biru.png",
  },
  teknis_inventaris: {
    light: "/images/logos/inventaris bg putih.png",
    dark: "/images/logos/inventaris bg biru.png",
  },
  acara_sub: {
    light: "/images/logos/acara bg putih.png",
    dark: "/images/logos/acara bg biru.png",
  },
  minat_bakat: {
    light: "/images/logos/mitkatpel bg putih.png",
    dark: "/images/logos/mitkatpel bg biru.png",
  },
  media: {
    light: "/images/logos/media bg putih.png",
    dark: "/images/logos/media bg biru.png",
  },
  relasi: {
    light: "/images/logos/relasi bg putih.png",
    dark: "/images/logos/relasi bg biru.png",
  },
};

export function getLogoPaths(divisionId?: string) {
  if (!divisionId) {
    return {
      light: "/images/logos/ketua umum bg putih.png",
      dark: "/images/logos/ketua umum bg biru.png",
    };
  }

  const key = divisionId.toLowerCase();
  for (const mapKey of Object.keys(LOGO_MAP)) {
    if (key.includes(mapKey) || mapKey.includes(key)) {
      return LOGO_MAP[mapKey];
    }
  }

  // Fallbacks by partial keywords
  if (key.includes("ketua") && !key.includes("wakil")) return LOGO_MAP.ketua_umum;
  if (key.includes("wakil") || key.includes("waketum")) return LOGO_MAP.wakil_ketua_umum;
  if (key.includes("sekretaris")) return LOGO_MAP.sekretaris;
  if (key.includes("bendahara")) return LOGO_MAP.bendahara;
  if (key.includes("pembinaan")) return LOGO_MAP.pembinaan;
  if (key.includes("pemerhati")) return LOGO_MAP.pemerhati;
  if (key.includes("inventaris") || key.includes("teknis")) return LOGO_MAP.teknis_inventaris;
  if (key.includes("bakat") || key.includes("mitkatpel")) return LOGO_MAP.minat_bakat;
  if (key.includes("media") && key.includes("relasi")) return LOGO_MAP.media_relasi;
  if (key.includes("media")) return LOGO_MAP.media;
  if (key.includes("relasi")) return LOGO_MAP.relasi;
  if (key.includes("acara")) return LOGO_MAP.acara;

  return LOGO_MAP.ketua_umum;
}

export default function DivisionLogo({
  divisionId,
  variant = "auto",
  className = "",
  size = 28,
}: DivisionLogoProps) {
  const paths = getLogoPaths(divisionId);

  if (variant === "light") {
    return (
      <div className={`relative shrink-0 flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <Image
          src={paths.light}
          alt="Division Logo"
          fill
          className="object-contain"
        />
      </div>
    );
  }

  if (variant === "dark") {
    return (
      <div className={`relative shrink-0 flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <Image
          src={paths.dark}
          alt="Division Logo"
          fill
          className="object-contain"
        />
      </div>
    );
  }

  // Auto switch on hover with group class
  return (
    <div className={`relative shrink-0 flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Light version (visible on default white button, hidden on hover) */}
      <Image
        src={paths.light}
        alt="Division Logo Light"
        fill
        className="object-contain group-hover:opacity-0 transition-opacity"
      />
      {/* Dark version (hidden on default, visible on hover blue background) */}
      <Image
        src={paths.dark}
        alt="Division Logo Dark"
        fill
        className="object-contain opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
}
