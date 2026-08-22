import Image from "next/image";
import Link from "next/link";

import { FaInstagram, FaTiktok, FaYoutube, FaLinkedin } from "react-icons/fa";

export default function Footer() {
    const menu = [
        {
            title: "Beranda",
            href: "/"
        },
        {
            title: "Pengumuman",
            href: "/pengumuman"
        },
        {
            title: "Tentang Kami",
            href: "/tentang"
        },
        {
            title: "Kepengurusan",
            href: "/kepengurusan"
        },
        {
            title: "Form & Pendataan",
            href: "/form"
        }
    ]


    return (
        <footer className="w-full h-[641px] pt-12 lg:pt-16">
            <div className="bg-primary w-full overflow-hidden h-full flex flex-col justify-between items-center gap-8 rounded-t-2xl lg:rounded-t-[64px] pt-12 lg:pt-16">
                <div className="grid grid-cols-2 gap-4 w-[85%] lg:w-[80%] mx-auto h-full">
                    <div className="flex flex-col items-start gap-8">
                        <Image draggable={false} src="/logo.svg" alt="Logo PMK Daniel" width={109} height={106} className="select-none size-15 md:size-20 lg:size-25" />
                        <div className="flex flex-col gap-1">
                            <p className="text-white font-light text-md lg:text-lg">
                                © 2026 PMK Daniel. Managed by Komisi 4 PMK Daniel.
                            </p>
                            <Link href="/credit" className="text-white/40 font-light text-xs lg:text-sm hover:text-white transition-colors duration-300">
                                Designed & Developed by Developer Team PMK Daniel
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 w-full h-full text-white">
                        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
                            <h3 className="font-bold text-2xl lg:text-4xl">
                                Navigation
                            </h3>
                            <div className="flex flex-col gap-2 lg:gap-4">
                                {menu.map((item, index) => (
                                    <Link key={index} href={item.href} className="text-white font-light text-md lg:text-lg">
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 lg:gap-8">
                            <h3 className="font-bold text-2xl lg:text-4xl">
                                Social Media
                            </h3>
                            <div className="flex gap-2 lg:gap-8">
                                <a href="https://instagram.com/pmkdaniel" target="_blank" rel="noopener noreferrer">
                                    <FaInstagram className="size-6 md:size-8 lg:size-10" />
                                </a>
                                <a href="https://instagram.com/pmkdaniel" target="_blank" rel="noopener noreferrer">
                                    <FaTiktok className="size-6 md:size-8 lg:size-10" />
                                </a>
                                <a href="https://www.youtube.com/@pmkdaniel9348" target="_blank" rel="noopener noreferrer">
                                    <FaYoutube className="size-6 md:size-8 lg:size-10" />
                                </a>
                                <a href="https://www.linkedin.com/company/pmk-daniel-filkom-ub/" target="_blank" rel="noopener noreferrer">
                                    <FaLinkedin className="size-6 md:size-8 lg:size-10" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <h1
                    className="select-none w-full tracking-wide leading-[0.8] text-secondary text-center uppercase font-black"
                    style={{ fontSize: "clamp(50px,20vw,200px)" }}>
                    PMK Daniel
                </h1>
            </div>
        </footer>
    );
}