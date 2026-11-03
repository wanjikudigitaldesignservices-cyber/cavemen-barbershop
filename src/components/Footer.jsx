import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, ArrowUp, Scissors } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function Footer({ onOpenBooking, onOpenAuth, onOpenAdmin }) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToSection = (e, href) => {
    e.preventDefault();
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
    <footer className="relative bg-cavemen-black border-t border-white/10 pt-20 pb-12 overflow-hidden text-cavemen-softgrey font-sans">
      
      {/* Decorative subtle ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cavemen-bronze/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          
          {/* Brand Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Wordmark */}
            <div className="space-y-2">
              <a href="#hero" onClick={(e) => scrollToSection(e, '#hero')} className="inline-block group">
                <span className="font-cinzel text-3xl font-bold tracking-[0.25em] text-cavemen-offwhite group-hover:text-cavemen-bronze transition-colors uppercase">
                  {siteConfig.brand.name}
                </span>
                <span className="block text-[10px] tracking-[0.25em] text-cavemen-bronze uppercase font-sans mt-0.5">
                  Premium Modern Men's Barbershop
                </span>
              </a>
            </div>

            {/* Short brand description */}
            <p className="text-xs sm:text-sm text-cavemen-softgrey max-w-sm leading-relaxed font-light">
              {siteConfig.brand.shortDescription}
            </p>

            <p className="text-xs font-editorial italic text-cavemen-offwhite/90">
              "{siteConfig.brand.tagline}"
            </p>

            {/* Appointment Trigger */}
            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] bg-cavemen-bronze/10 text-cavemen-offwhite border border-cavemen-bronze/50 hover:bg-cavemen-bronze hover:text-cavemen-black transition-all"
              >
                <span>Book Your Chair</span>
                <span className="ml-2">→</span>
              </button>
            </div>
          </div>

          {/* Navigation Links Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-cinzel text-xs uppercase tracking-[0.22em] text-cavemen-offwhite font-bold">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a
                  href="#hero"
                  onClick={(e) => scrollToSection(e, '#hero')}
                  className="hover:text-cavemen-bronze transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => scrollToSection(e, '#about')}
                  className="hover:text-cavemen-bronze transition-colors"
                >
                  About CAVEMEN
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  onClick={(e) => scrollToSection(e, '#services')}
                  className="hover:text-cavemen-bronze transition-colors"
                >
                  Grooming Services
                </a>
              </li>
              <li>
                <a
                  href="#atmosphere"
                  onClick={(e) => scrollToSection(e, '#atmosphere')}
                  className="hover:text-cavemen-bronze transition-colors"
                >
                  Studio Atmosphere
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => scrollToSection(e, '#contact')}
                  className="hover:text-cavemen-bronze transition-colors"
                >
                  Book Appointment
                </a>
              </li>
              <li className="pt-2 border-t border-white/5">
                <button
                  onClick={onOpenAuth}
                  className="text-cavemen-bronze/90 hover:text-cavemen-bronze transition-colors flex items-center space-x-1.5"
                >
                  <span>Staff & Concierge Portal</span>
                  <span className="text-[10px] font-mono">→</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Services Links Column (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-cinzel text-xs uppercase tracking-[0.22em] text-cavemen-offwhite font-bold">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              {siteConfig.services.map((service) => (
                <li key={service.id}>
                  <a
                    href="#services"
                    onClick={(e) => scrollToSection(e, '#services')}
                    className="hover:text-cavemen-bronze transition-colors"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Placeholders Column (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-cinzel text-xs uppercase tracking-[0.22em] text-cavemen-offwhite font-bold">
              Studio & Contact
            </h4>
            <div className="space-y-3 text-xs">
              
              {/* Studio Location Placeholder */}
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-cavemen-bronze shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-cavemen-bronze/80 block">
                    Location
                  </span>
                  <span className="text-cavemen-offwhite/85">
                    {siteConfig.contact.address}
                  </span>
                </div>
              </div>

              {/* Phone Placeholder */}
              <div className="flex items-start space-x-2.5">
                <Phone className="w-4 h-4 text-cavemen-bronze shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-cavemen-bronze/80 block">
                    Phone / WhatsApp
                  </span>
                  <span className="text-cavemen-offwhite/85">
                    {siteConfig.contact.phone}
                  </span>
                </div>
              </div>

              {/* Hours Placeholder */}
              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-cavemen-bronze shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-cavemen-bronze/80 block">
                    Opening Hours
                  </span>
                  <span className="text-cavemen-offwhite/85 block">
                    {siteConfig.contact.openingHours.weekdays}
                  </span>
                  <span className="text-cavemen-offwhite/85 block">
                    {siteConfig.contact.openingHours.saturday}
                  </span>
                </div>
              </div>

              {/* Email Placeholder */}
              <div className="flex items-start space-x-2.5">
                <Mail className="w-4 h-4 text-cavemen-bronze shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-cavemen-bronze/80 block">
                    Concierge Inquiries
                  </span>
                  <span className="text-cavemen-offwhite/85">
                    {siteConfig.contact.email}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Social Media Placeholders & Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-cavemen-softgrey/70">
          
          {/* Social Placeholders */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[10px] uppercase tracking-widest text-cavemen-bronze font-semibold">
              Official Channels:
            </span>
            {siteConfig.socials.map((social) => (
              <span
                key={social.name}
                className="text-[11px] text-cavemen-softgrey hover:text-cavemen-bronze transition-colors cursor-pointer border border-white/5 px-2.5 py-1 bg-white/[0.02]"
                title={`Placeholder: ${social.placeholder}`}
              >
                {social.name} <span className="text-[9px] text-cavemen-bronze/60">[Pending]</span>
              </span>
            ))}
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-cavemen-offwhite/70 hover:text-cavemen-bronze transition-colors text-[11px] uppercase tracking-wider"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Legal, Dynamically Generated Year & Conceptual Visuals Disclaimer */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-cavemen-softgrey/60">
          <p>
            © {currentYear} {siteConfig.brand.name}. All rights reserved.
          </p>
          <p className="text-center sm:text-right">
            Conceptual visuals depicted for brand atmosphere. All official details to be confirmed upon launch.
          </p>
        </div>

      </div>
    </footer>
  );
}
