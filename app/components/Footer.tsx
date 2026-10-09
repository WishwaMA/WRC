// app/components/Footer.tsx
"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Share2, Video, Globe, ArrowRight } from 'lucide-react';
import { db } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

interface NavbarSettings {
  schoolName: string;
  subName: string;
  logoText: string;
  logoImage: string;
}

interface FooterSettings {
  footerText: string;
}

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [navbarSettings, setNavbarSettings] = useState<NavbarSettings>({
    schoolName: 'Wayamba Royal',
    subName: 'COLLEGE',
    logoText: 'WRC',
    logoImage: '',
  });
  const [footerSettings, setFooterSettings] = useState<FooterSettings>({
    footerText: 'Empowering generations with knowledge, discipline, and moral values to conquer the future with royal distinction.'
  });

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());

    const navbarRef = ref(db, 'settings/navbar');
    onValue(navbarRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setNavbarSettings(data);
    });

    const footerRef = ref(db, 'settings/footer');
    onValue(footerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setFooterSettings(data);
    });
  }, []);

  return (
    <footer className="bg-emerald-950 text-emerald-100 pt-16 pb-8 border-t-4 border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {/* Background color changed to white */}
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-950 font-bold text-xl overflow-hidden shadow border border-emerald-900">
              {navbarSettings.logoImage ? (
                <img src={navbarSettings.logoImage} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                navbarSettings.logoText || "WRC"
              )}
            </div>
            <div>
              <span className="text-xl font-bold text-white block leading-tight">{navbarSettings.schoolName || "Wayamba Royal"}</span>
              <span className="text-xs text-yellow-400 tracking-wider">{navbarSettings.subName || "COLLEGE"}</span>
            </div>
          </div>
          <p className="text-sm text-emerald-200 leading-relaxed">
            {footerSettings.footerText || "Empowering generations with knowledge, discipline, and moral values to conquer the future with royal distinction."}
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="#" aria-label="Social Media" className="w-10 h-10 bg-emerald-900 rounded-full flex items-center justify-center text-yellow-400 hover:bg-yellow-400 hover:text-emerald-950 transition">
              <Share2 size={18} />
            </a>
            <a href="#" aria-label="Video Channel" className="w-10 h-10 bg-emerald-900 rounded-full flex items-center justify-center text-yellow-400 hover:bg-yellow-400 hover:text-emerald-950 transition">
              <Video size={18} />
            </a>
            <a href="#" aria-label="Website" className="w-10 h-10 bg-emerald-900 rounded-full flex items-center justify-center text-yellow-400 hover:bg-yellow-400 hover:text-emerald-950 transition">
              <Globe size={18} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-4 border-b border-emerald-800 pb-2">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-yellow-400 transition flex items-center gap-2"><ArrowRight size={14} /> Home</Link></li>
            <li><Link href="/news" className="hover:text-yellow-400 transition flex items-center gap-2"><ArrowRight size={14} /> News & Announcements</Link></li>
            <li><Link href="/about" className="hover:text-yellow-400 transition flex items-center gap-2"><ArrowRight size={14} /> About School</Link></li>
            <li><Link href="/administration" className="hover:text-yellow-400 transition flex items-center gap-2"><ArrowRight size={14} /> Administration</Link></li>
            <li><Link href="/sports" className="hover:text-yellow-400 transition flex items-center gap-2"><ArrowRight size={14} /> Sports & Societies</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-4 border-b border-emerald-800 pb-2">Contact Us</h3>
          <ul className="space-y-3 text-sm text-emerald-200">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-yellow-400 shrink-0 mt-1" />
              <span>Wayamba Royal College, Kurunegala, Sri Lanka</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-yellow-400 shrink-0" />
              <span>+94 37 222 XXXX</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-yellow-400 shrink-0" />
              <span>info@wayambaroyal.edu.lk</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-4 border-b border-emerald-800 pb-2">Roadmap & Location</h3>
          <p className="text-xs text-emerald-300 mb-3">Easily accessible from the Kurunegala main city area.</p>
          <div className="w-full h-32 bg-emerald-900 rounded-lg overflow-hidden border border-emerald-800 relative flex items-center justify-center">
            <span className="text-xs text-yellow-400 font-semibold text-center px-2">📍 View School Location on Google Maps</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-emerald-900 pt-6 text-center text-xs text-emerald-400">
        <p>© {currentYear} {navbarSettings.schoolName || "Wayamba Royal College"}. All Rights Reserved.</p>
      </div>
    </footer>
  );
}