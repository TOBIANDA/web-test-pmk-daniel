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
            title: "Tentang Kami",
            href: "/tentang"
        },
        {
            title: "Pengumuman",
            href: "/pengumuman"
        },
        {
            title: "Kepengurusan",
            href: "/pengurus"
        },
        {
            title: "Form & Pendataan",
            href: "/join"
        },
        {
            title: "Kontak",
            href: "/kontak"
        }
    ]

    return (
        <footer className="w-full pt-12 lg:pt-16">
            <div className="bg-primary w-full overflow-hidden flex flex-col justify-between items-center gap-8 rounded-t-2xl lg:rounded-t-[64px] pt-12 lg:pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 w-[85%] lg:w-[80%] mx-auto h-full">
                    <div className="flex flex-col items-start gap-8">
                        <Image draggable={false} src="/logo.png" alt="Logo PMK Daniel" width={109} height={106} className="select-none size-15 md:size-20 lg:size-25" />
                        <div className="flex flex-col gap-1">
                            <p className="text-white font-light text-md lg:text-lg">
                                © 2026 PMK Daniel. Managed by Komisi 4 PMK Daniel.
                            </p>
                            <Link href="/credit" className="text-white/40 font-light text-xs lg:text-sm hover:text-white transition-colors duration-300">
                                Designed & Developed by Developer Team PMK Daniel
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-4 w-full h-full text-white">
                        <div className="flex flex-col gap-4 md:gap-6 lg:gap-8">
                            <h3 className="font-bold text-2xl lg:text-4xl">
                                Navigation
                            </h3>
                            <div className="flex flex-col gap-2 lg:gap-4">
                                {menu.map((item, index) => (
                                    <Link key={index} href={item.href} className="text-white font-light text-md lg:text-lg hover:text-secondary hover:translate-x-2 transition-all duration-300 w-fit">
                                        {item.title}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 lg:gap-8">
                            <h3 className="font-bold text-2xl lg:text-4xl">
                                Social Media
                            </h3>
                            <div className="flex gap-4 lg:gap-6">
                                <a href="https://instagram.com/pmkdaniel" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-secondary p-3 rounded-full hover:-translate-y-1 transition-all duration-300 group">
                                    <FaInstagram className="size-6 md:size-8 lg:size-10 text-white group-hover:text-primary transition-colors" />
                                </a>
                                <a href="https://instagram.com/pmkdaniel" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-secondary p-3 rounded-full hover:-translate-y-1 transition-all duration-300 group">
                                    <FaTiktok className="size-6 md:size-8 lg:size-10 text-white group-hover:text-primary transition-colors" />
                                </a>
                                <a href="https://www.youtube.com/@pmkdaniel9348" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-secondary p-3 rounded-full hover:-translate-y-1 transition-all duration-300 group">
                                    <FaYoutube className="size-6 md:size-8 lg:size-10 text-white group-hover:text-primary transition-colors" />
                                </a>
                                <a href="https://www.linkedin.com/company/pmk-daniel-filkom-ub/" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-secondary p-3 rounded-full hover:-translate-y-1 transition-all duration-300 group">
                                    <FaLinkedin className="size-6 md:size-8 lg:size-10 text-white group-hover:text-primary transition-colors" />
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