import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, MapPin, Phone, Clock } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function Navbar({ onOpenBooking }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Atmosphere', href: '#atmosphere' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-cavemen-black/92 backdrop-blur-md border-b border-white/10 py-4 shadow-luxury'
            : 'bg-gradient-to-b from-cavemen-black/80 via-cavemen-black/40 to-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between">
          
          {/* Brand Wordmark */}
          <a
            href="#hero"
            onClick={(e) => handleLinkClick(e, '#hero')}
            className="group flex items-center space-x-2.5 sm:space-x-3 text-cavemen-offwhite focus:outline-none"
          >
            {/* Minimalist Bronze Monogram Crest */}
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded border border-cavemen-bronze/60 flex items-center justify-center bg-cavemen-charcoal/60 group-hover:border-cavemen-bronze transition-colors shrink-0">
              <span className="font-cinzel text-cavemen-bronze text-xs sm:text-sm font-semibold tracking-wider">C</span>
            </div>
            
            <div className="flex flex-col">
              <span className="font-cinzel text-lg sm:text-2xl font-bold tracking-[0.2em] sm:tracking-[0.28em] text-cavemen-offwhite group-hover:text-cavemen-bronze transition-colors uppercase">
                {siteConfig.brand.name}
              </span>
              <span className="text-[9px] font-sans text-cavemen-softgrey uppercase tracking-[0.22em] -mt-1 hidden sm:block">
                Modern Grooming Lounge
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-xs uppercase tracking-[0.2em] font-medium text-cavemen-offwhite/80 hover:text-cavemen-bronze transition-colors duration-200 relative py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-cavemen-bronze transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Desktop Prominent CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onOpenBooking}
              className="relative inline-flex items-center justify-center px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-cavemen-offwhite border border-cavemen-bronze/80 bg-cavemen-bronze/10 hover:bg-cavemen-bronze hover:text-cavemen-black transition-all duration-300 rounded-none shadow-sm hover:shadow-bronze-glow group"
            >
              <Calendar className="w-3.5 h-3.5 mr-2 text-cavemen-bronze group-hover:text-cavemen-black transition-colors" />
              <span>Book An Appointment</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-cavemen-offwhite hover:text-cavemen-bronze focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-cavemen-black/95 backdrop-blur-xl transition-all duration-500 md:hidden flex flex-col justify-between p-8 pt-28 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col space-y-6">
          <div className="border-b border-white/10 pb-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
              Navigation
            </p>
          </div>
          <nav className="flex flex-col space-y-5">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="font-cinzel text-2xl uppercase tracking-[0.15em] text-cavemen-offwhite hover:text-cavemen-bronze transition-colors flex items-center justify-between"
              >
                <span>{link.name}</span>
                <span className="text-xs text-cavemen-bronze/60 font-sans tracking-widest">→</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Mobile Drawer Details & CTA */}
        <div className="space-y-6 pt-6 border-t border-white/10">
          <div className="space-y-2 text-xs text-cavemen-softgrey font-sans">
            <div className="flex items-center text-cavemen-offwhite/90">
              <MapPin className="w-4 h-4 mr-2 text-cavemen-bronze shrink-0" />
              <span className="truncate">{siteConfig.contact.address}</span>
            </div>
            <div className="flex items-center text-cavemen-offwhite/90">
              <Clock className="w-4 h-4 mr-2 text-cavemen-bronze shrink-0" />
              <span>Mon – Sat: Appointment & Walk-in</span>
            </div>
          </div>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBooking();
            }}
            className="w-full py-4 text-center text-xs uppercase tracking-[0.22em] font-semibold text-cavemen-black bg-cavemen-bronze hover:bg-cavemen-bronzeLight transition-colors flex items-center justify-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Book An Appointment</span>
          </button>
        </div>
      </div>
    </>
  );
}
