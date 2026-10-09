// app/components/Navbar.tsx
"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

interface NavbarSettings {
  schoolName: string;
  subName: string;
  logoText: string;
  logoImage: string;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [navbarSettings, setNavbarSettings] = useState<NavbarSettings>({
    schoolName: 'Wayamba Royal',
    subName: 'COLLEGE',
    logoText: 'WRC',
    logoImage: '',
  });

  useEffect(() => {
    const navbarRef = ref(db, 'settings/navbar');
    onValue(navbarRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setNavbarSettings(data);
      }
    });
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          <Link href="/" className="flex items-center gap-3">
            {/* Background color changed to white */}
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-900 font-bold text-xl overflow-hidden shadow-sm border border-gray-100">
              {navbarSettings.logoImage ? (
                <img src={navbarSettings.logoImage} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                navbarSettings.logoText || "WRC"
              )}
            </div>
            <div>
              <span className="text-xl font-bold text-blue-900 block leading-tight">{navbarSettings.schoolName || "Wayamba Royal"}</span>
              <span className="text-xs text-gray-600 tracking-wider">{navbarSettings.subName || "COLLEGE"}</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8 font-medium text-gray-700">
            <Link href="/" className="hover:text-blue-600 transition">Home</Link>
            <Link href="/news" className="hover:text-blue-600 transition">News</Link>
            <Link href="/about" className="hover:text-blue-600 transition">About</Link>
            <Link href="/administration" className="hover:text-blue-600 transition">Administration</Link>
            <Link href="/sports" className="hover:text-blue-600 transition">Sports</Link>
            <Link href="/clubs" className="hover:text-blue-600 transition">Clubs</Link>
            <Link href="/contact" className="hover:text-blue-600 transition">Contact</Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t px-4 pt-2 pb-4 space-y-3 shadow-lg">
          <Link href="/" className="block text-gray-700 hover:text-blue-600 font-medium">Home</Link>
          <Link href="/news" className="block text-gray-700 hover:text-blue-600 font-medium">News</Link>
          <Link href="/about" className="block text-gray-700 hover:text-blue-600 font-medium">About</Link>
          <Link href="/administration" className="block text-gray-700 hover:text-blue-600 font-medium">Administration</Link>
          <Link href="/sports" className="block text-gray-700 hover:text-blue-600 font-medium">Sports</Link>
          <Link href="/clubs" className="block text-gray-700 hover:text-blue-600 font-medium">Clubs</Link>
          <Link href="/contact" className="block text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
        </div>
      )}
    </nav>
  );
}