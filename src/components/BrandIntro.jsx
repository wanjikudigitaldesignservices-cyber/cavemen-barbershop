import React from 'react';
import { Scissors, ShieldCheck, Coffee, Sparkles } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function BrandIntro({ onOpenBooking }) {
  return (
    <section id="about" className="relative py-24 sm:py-32 bg-cavemen-charcoal/95 border-t border-b border-white/5 overflow-hidden">
      
      {/* Subtle background ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-cavemen-bronze/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Pre-Title */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-[1px] bg-cavemen-bronze" />
          <span className="text-xs uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
            Brand Philosophy
          </span>
        </div>

        {/* Section Heading */}
        <h2 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-cavemen-offwhite uppercase mb-16 max-w-3xl">
          THE CAVEMEN EXPERIENCE
        </h2>

        {/* Sophisticated Two-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Copy & Hallmarks */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Primary Editorial Quote / Description */}
            <div className="relative pl-6 border-l-2 border-cavemen-bronze/70">
              <p className="font-editorial text-2xl sm:text-3xl text-cavemen-offwhite leading-relaxed font-light italic">
                “Great grooming is more than looking good. It's about the confidence that comes with taking care of yourself. At CAVEMEN, we bring together professional barbering, attention to detail and an atmosphere where every visit feels worthwhile.”
              </p>
            </div>

            {/* Secondary Paragraph on Craft & Environment */}
            <p className="font-sans text-sm sm:text-base text-cavemen-softgrey leading-relaxed font-light">
              Step away from the fast-paced noise. CAVEMEN was conceived as a refined modern retreat — where time slows down, consultations are genuinely personal, and master barbers apply classical craftsmanship to today's contemporary styles.
            </p>

            {/* Three Hallmarks of CAVEMEN */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/10">
              
              <div className="space-y-2">
                <div className="w-8 h-8 rounded border border-cavemen-bronze/30 bg-cavemen-black flex items-center justify-center text-cavemen-bronze">
                  <Scissors className="w-4 h-4" />
                </div>
                <h4 className="font-cinzel text-sm uppercase tracking-wider text-cavemen-offwhite font-semibold">
                  Master Barbering
                </h4>
                <p className="text-xs text-cavemen-softgrey leading-relaxed">
                  Every haircut and beard contour is mapped to your facial structure.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded border border-cavemen-bronze/30 bg-cavemen-black flex items-center justify-center text-cavemen-bronze">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-cinzel text-sm uppercase tracking-wider text-cavemen-offwhite font-semibold">
                  Zero Compromise
                </h4>
                <p className="text-xs text-cavemen-softgrey leading-relaxed">
                  Sanitized Japanese steel, hot aromatic towels, and bespoke tonics.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-8 h-8 rounded border border-cavemen-bronze/30 bg-cavemen-black flex items-center justify-center text-cavemen-bronze">
                  <Coffee className="w-4 h-4" />
                </div>
                <h4 className="font-cinzel text-sm uppercase tracking-wider text-cavemen-offwhite font-semibold">
                  Private Sanctuary
                </h4>
                <p className="text-xs text-cavemen-softgrey leading-relaxed">
                  Complimentary espresso or crafted drinks in our calm lounge space.
                </p>
              </div>

            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center text-xs uppercase tracking-[0.2em] font-semibold text-cavemen-bronze hover:text-cavemen-bronzeLight group"
              >
                <span>Reserve Your Time With Us</span>
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>

          {/* Right Column: Supporting Visual Frame */}
          <div className="lg:col-span-5 relative">
            
            {/* Decorative Offset Bronze Frame */}
            <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-full h-full border border-cavemen-bronze/30 pointer-events-none" />
            
            {/* Visual Container */}
            <div className="relative z-10 bg-cavemen-card border border-white/10 overflow-hidden shadow-2xl group">
              <img
                src="/images/intro-experience.jpg"
                alt="CAVEMEN Barber crafting a personalized haircut in luxury ambience"
                loading="lazy"
                className="w-full h-[440px] sm:h-[500px] object-cover object-center filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Subtle dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-cavemen-black via-transparent to-transparent opacity-80" />

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-1">
                <p className="text-[10px] uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
                  Conceptual Showcase
                </p>
                <h3 className="font-cinzel text-lg sm:text-xl text-cavemen-offwhite font-semibold">
                  Precision in Every Movement.
                </h3>
                <p className="text-xs text-cavemen-softgrey font-light">
                  Classical grooming techniques refined for modern excellence.
                </p>
              </div>

              {/* Monogram Stamp in corner */}
              <div className="absolute top-4 right-4 bg-cavemen-black/80 backdrop-blur-md px-3 py-1 border border-cavemen-bronze/30 text-[10px] font-cinzel text-cavemen-bronze tracking-widest uppercase">
                CAVEMEN
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
