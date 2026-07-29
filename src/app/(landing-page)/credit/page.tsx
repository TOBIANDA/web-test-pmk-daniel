"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function CreditPage() {
    const developers = [
        {
            name: "Developer 1",
            role: "Project Manager / Lead",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev1",
        },
        {
            name: "Developer 2",
            role: "Frontend Developer",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev2",
        },
        {
            name: "Developer 3",
            role: "Backend Developer",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev3",
        },
        {
            name: "Developer 4",
            role: "UI/UX Designer",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=dev4",
        }
    ];

    return (
        <main className="min-h-screen pt-32 pb-16 px-4 sm:px-8 md:px-12 lg:px-16 bg-white overflow-hidden">
            {/* Background Ornaments */}
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary font-plusJakarta mb-6">
                        Tim Developer
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        Website ini dipersembahkan dengan penuh dedikasi oleh Tim IT Komisi 4 PMK Daniel FILKOM UB. Segala kemuliaan hanya bagi Tuhan.
                    </p>
                </motion.div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                    {developers.map((dev, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                            className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center text-center hover:shadow-[0_8px_30px_rgb(62,64,149,0.1)] transition-shadow duration-300 group"
                        >
                            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 p-2 mb-6 group-hover:scale-105 transition-transform duration-300">
                                <div className="w-full h-full rounded-full bg-white overflow-hidden relative flex items-center justify-center">
                                    <img 
                                        src={dev.image}
                                        alt={dev.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{dev.name}</h3>
                            <p className="text-primary font-medium text-sm">{dev.role}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Special Thanks */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-24 p-8 bg-gradient-to-r from-primary to-secondary rounded-3xl text-white text-center w-full max-w-4xl shadow-xl relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
                    <h2 className="text-2xl font-bold mb-4 relative z-10">Soli Deo Gloria</h2>
                    <p className="text-white/90 font-light relative z-10">
                        "Apapun juga yang kamu perbuat, perbuatlah dengan segenap hatimu seperti untuk Tuhan dan bukan untuk manusia." 
                        <br/><span className="font-semibold mt-2 inline-block">— Kolose 3:23</span>
                    </p>
                </motion.div>
            </div>
        </main>
    );
}
