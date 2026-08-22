import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Form & Pendataan | PMK Daniel",
    description: "Formulir pendaftaran dan pendataan anggota PMK Daniel",
};

export default function JoinPage() {
    return (
        <main className="min-h-screen pt-32 pb-16 w-[85%] lg:w-[80%] mx-auto">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#3E4095] mb-4 font-plusJakarta">
                        Form & Pendataan
                    </h1>
                    <p className="text-sm sm:text-base font-medium text-gray-700">
                        Silakan isi data diri Anda untuk bergabung dan terdata dalam sistem PMK Daniel.
                    </p>
                </div>
                
                {/* Temporary Placeholder for Form */}
                <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                    <p className="text-center text-gray-500 font-plusJakarta py-10">
                        [ Form React Hook Form + Zod Setup akan diimplementasikan di sini ]
                    </p>
                </div>
            </div>
        </main>
    );
}
