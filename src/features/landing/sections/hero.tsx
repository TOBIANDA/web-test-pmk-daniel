export default function Hero() {
  return (
    // REVISI 1: Mengubah arah gradasi dari kiri ke kanan (to-r) dengan warna ungu pudar ke oranye pudar
    <section className="relative flex flex-col items-center justify-center min-h-[90vh] px-4 pt-20 pb-24 text-center bg-gradient-to-r from-[#E2E2EF] from-10% via-[#FFFFFF] via-50% to-[#FFEED0] to-90%">
      {/* Sub-judul kecil */}
      <p className="mb-6 text-lg font-bold tracking-widest text-black-500 uppercase">
        PMK Daniel FILKOM UB
      </p>

      {/* Judul Utama (Tagline) */}
      <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl">
        <span className="text-[#3E4095]">Together to be</span><br />
        <span className="text-[#F58732]">Better.</span>
      </h1>

      {/* padding vertikal (py-4)  */}
      <div className="absolute bottom-0 left-0 flex w-full py-4 overflow-hidden bg-white border-t border-b border-gray-200">
        <div className="flex items-center justify-center w-full whitespace-nowrap">
          
          <span className="text-sm font-medium text-gray-800 md:text-base">
            "Tuhan adalah gembalaku, takkan kekurangan aku." — Mazmur 23:1 
          </span>
          
          {}
          <img 
            src="/icon-cross.svg" 
            alt="Pembatas Ayat" 
            className="inline-block w-5 h-auto mx-8 opacity-80 invert" 
          /> 
          
          <span className="text-sm font-medium text-gray-800 md:text-base">
            "Jangan takut, sebab Aku menyertai engkau." — Yesaya 41:10
          </span>

        </div>
      </div>

    </section>
  );
}