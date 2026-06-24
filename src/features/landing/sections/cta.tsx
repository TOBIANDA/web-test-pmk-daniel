import { Button } from "@/components/ui/button";

export default function CTA() {
    return (
        <section className="w-full h-full  px-4 sm:px-8 md:px-12 lg:px-16 py-16">
            <div className="flex flex-col items-center justify-center gap-14 w-full h-full rounded-3xl lg:rounded-[64px] border border-grey px-10 lg:px-16 py-12 lg:py-18">
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-primary font-extrabold text-3xl md:text-5xl lg:text-7xl text-center">
                        Bertumbuh Bersama dalam Kristus
                    </h2>
                    <p className="text-black font-normal text-lg sm:text-xl lg:text-2xl text-center">
                        Jadilah bagian dari komunitas yang belajar, melayani, dan memuliakan Tuhan bersama.
                    </p>
                </div>

                <p className="text-black font-normal text-lg sm:text-xl lg:text-2xl text-center italic">
                    "Sebab di mana dua atau tiga orang berkumpul dalam nama-Ku, di situ Aku ada di tengah-tengah mereka." — Matius 18:20
                </p>

                <Button variant="default">
                    Gabung bersama PMK Daniel
                </Button>
            </div>

        </section>
    );
}