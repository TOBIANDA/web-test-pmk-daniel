export default function About() {
  return (
   
    <section id="about" className="w-full max-w-5xl px-4 py-20 mx-auto">
      
      {/* 1. Bagian Atas: Gambar Foto Bersama */}
      { }
      <div className="w-full mb-12 overflow-hidden shadow-sm rounded-[2.5rem]">
        <img 
          src="/About-us pic.png" 
          alt="Foto Bersama PMK Daniel" 
          className="w-full h-auto object-cover"
        />
      </div>

      {/* 2. Bagian Bawah: Grid 2 Kolom untuk Teks */}
      {}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 items-start px-4">
        
        {/* Kolom Kiri: Judul */}
        <div className="md:col-span-1">
          <h2 className="text-5xl font-extrabold text-[#3E4095]">
            About Us
          </h2>
        </div>

        {/* Kolom Kanan: Paragraf Deskripsi */}
        <div className="md:col-span-2">
          <p className="text-base font-medium leading-relaxed text-gray-800 md:text-lg">
            Persekutuan Mahasiswa Kristen Daniel Fakultas Ilmu Komputer Universitas Brawijaya (PMK Daniel FILKOM UB), yang berdiri sejak tahun 2013, bertujuan untuk membentuk mahasiswa Kristen di FILKOM UB agar memiliki karakter Kristus, unggul dibidangnya, serta mampu menjadi berkat dan memberi dampak positif bagi lingkungan sekitarnya.
          </p>
        </div>

      </div>

    </section>
  );
}