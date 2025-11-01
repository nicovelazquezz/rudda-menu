import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-primary/50 backdrop-blur-sm  border-white/10 ">
      <div className="max-w-7xl mx-auto px-6 flex flex-row items-center justify-center gap-4">

        
        {/* Link altum.ar */}
        <a
          href="mailto:sumate@altum.ar"
          className="text-sm hover:opacity-80 transition-opacity"
        >
          <span className="font-semibold" style={{ color: '#E86A63' }}>altum</span>
          <span className="text-white font-semibold">.ar</span>
        </a>

        {/* Divider sutil */}
        <div className="h-4 w-px bg-white/20"></div>

        {/* Logo ENA */}
        <div className="relative w-16 h-14 opacity-100 transition-opacity" style={{ marginLeft: '-10px' }}>
          <Image
            src="/ena-sport.png"
            alt="ENA Sport"
            fill
            className="object-contain"
          />
        </div>



      </div>
    </footer>
  );
};

export default Footer;