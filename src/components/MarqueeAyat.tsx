import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const AYAT_LIST = [
  '"Tuhan adalah gembalaku, takkan kekurangan aku." — Mazmur 23:1',
  '"Jangan takut, sebab Aku menyertai engkau." — Yesaya 41:10',
  '"Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku." — Filipi 4:13',
  '"Bersukacitalah senantiasa dalam Tuhan!" — Filipi 4:4',
  '"Pencobaan-pencobaan yang kamu alami ialah pencobaan-pencobaan biasa." — 1 Korintus 10:13',
  '"Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu." — Yeremia 29:11',
  '"Percayalah kepada TUHAN dengan segenap hatimu, dan janganlah bersandar kepada pengertianmu sendiri." — Amsal 3:5',
  '"Kasih itu sabar; kasih itu murah hati; ia tidak cemburu." — 1 Korintus 13:4',
  '"Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal." — Yohanes 3:16',
  '"Serahkanlah segala kekuatiranmu kepada-Nya, sebab Ia yang memelihara kamu." — 1 Petrus 5:7'
];

export default function MarqueeAyat() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.to(marqueeRef.current, {
      xPercent: -50,
      ease: "none",
      duration: 60,
      repeat: -1
    });
  });

  return (
    <div className="absolute bottom-0 left-0 flex w-full py-4 overflow-hidden bg-white border-t border-b border-gray-200 z-10">
        <div ref={marqueeRef} className="flex items-center w-max whitespace-nowrap">
          {/* Duplicate content to create a seamless infinite loop */}
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              {AYAT_LIST.map((ayat, index) => (
                <React.Fragment key={index}>
                  <span className="px-8 text-sm font-medium text-gray-800 md:text-base">
                    {ayat}
                  </span>
                  <img 
                    draggable="false"
                    src="/icon-cross.svg" 
                    alt="Pembatas Ayat" 
                    className="select-none inline-block w-5 h-auto opacity-80 invert" 
                  /> 
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
  );
}
