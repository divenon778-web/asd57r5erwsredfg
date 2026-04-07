import React from 'react';
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="w-full px-[120px] py-[16px] flex items-center justify-center absolute top-0 z-50">
      <Link to="/" className="font-brand font-semibold text-[24px] tracking-tight text-[#000]">
        Structra
      </Link>
    </nav>
  );
}
