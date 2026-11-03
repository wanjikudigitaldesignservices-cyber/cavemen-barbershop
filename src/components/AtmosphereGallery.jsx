import React, { useState } from 'react';
import { Eye, Play, X, Info, Maximize2 } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function AtmosphereGallery({ content }) {
  const [activeMedia, setActiveMedia] = useState(null);

  return (
    <section id="atmosphere" className="relative py-24 sm:py-32 bg-cavemen-black overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-cavemen-bronze/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-[1px] bg-cavemen-bronze" />
            <span className="text-xs uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
              Interior & Ambiance
            </span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-cavemen-offwhite uppercase">
            {content?.title || 'STEP INTO THE EXPERIENCE.'}
          </h2>

          <p className="font-sans text-sm sm:text-base text-cavemen-softgrey font-light leading-relaxed">
            {content?.subtitle || 'Dark architectural finishes, custom leather seating, warm amber lighting and an atmosphere tailored for the modern man.'}
          </p>
        </div>

        {/* Conceptual Visual Notice Disclaimer (Prominent & Clear) */}
        <div className="mb-10 p-4 border border-cavemen-bronze/30 bg-cavemen-charcoal/60 flex items-start space-x-3">
          <Info className="w-4 h-4 text-cavemen-bronze shrink-0 mt-0.5" />
          <p className="text-xs text-cavemen-softgrey leading-relaxed">
            <strong className="text-cavemen-offwhite font-medium uppercase tracking-wider">Atmospheric Concept Note:</strong> The visuals below represent the architectural, interior, and conceptual design aesthetic of the CAVEMEN establishment. Official photographs of the physical location will be published following our launch.
          </p>
        </div>

        {/* Refined Asymmetrical Grid */}
        <div className="grid grid-cols-12 gap-4 sm:gap-6">
          
          {/* Item 1: Large Featured Atmospheric Video (8 columns on desktop) */}
          <div
            onClick={() => setActiveMedia(siteConfig.atmosphereGallery[0])}
            className="col-span-12 lg:col-span-8 group relative h-80 sm:h-[460px] bg-cavemen-card border border-white/10 overflow-hidden cursor-pointer shadow-xl hover:border-cavemen-bronze/60 transition-all duration-500"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={siteConfig.atmosphereGallery[0].poster}
              className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
            >
              <source src={siteConfig.atmosphereGallery[0].src} type="video/mp4" />
            </video>

            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-cavemen-black via-cavemen-black/30 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

            {/* Hover Indicator */}
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-cavemen-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-cavemen-offwhite group-hover:text-cavemen-bronze group-hover:border-cavemen-bronze transition-colors">
              <Maximize2 className="w-4 h-4" />
            </div>

            {/* Badge */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-cavemen-black/80 backdrop-blur-md border border-cavemen-bronze/40 text-[10px] font-cinzel text-cavemen-bronze tracking-widest uppercase">
              Featured Ambiance
            </div>

            {/* Captions */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 space-y-1">
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-cavemen-offwhite">
                {siteConfig.atmosphereGallery[0].title}
              </h3>
              <p className="text-xs sm:text-sm text-cavemen-softgrey font-light">
                {siteConfig.atmosphereGallery[0].caption}
              </p>
            </div>
          </div>

          {/* Item 2: Craft Instruments (4 columns on desktop) */}
          <div
            onClick={() => setActiveMedia(siteConfig.atmosphereGallery[1])}
            className="col-span-12 sm:col-span-6 lg:col-span-4 group relative h-80 sm:h-[460px] bg-cavemen-card border border-white/10 overflow-hidden cursor-pointer shadow-xl hover:border-cavemen-bronze/60 transition-all duration-500"
          >
            <img
              src={siteConfig.atmosphereGallery[1].src}
              alt={siteConfig.atmosphereGallery[1].title}
              loading="lazy"
              className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cavemen-black via-transparent to-transparent opacity-80" />

            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-cavemen-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-cavemen-offwhite group-hover:text-cavemen-bronze group-hover:border-cavemen-bronze transition-colors">
              <Eye className="w-4 h-4" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1">
              <h3 className="font-cinzel text-lg sm:text-xl font-bold text-cavemen-offwhite">
                {siteConfig.atmosphereGallery[1].title}
              </h3>
              <p className="text-xs text-cavemen-softgrey font-light">
                {siteConfig.atmosphereGallery[1].caption}
              </p>
            </div>
          </div>

          {/* Item 3: Hot Towel Ritual (4 columns) */}
          <div
            onClick={() => setActiveMedia(siteConfig.atmosphereGallery[2])}
            className="col-span-12 sm:col-span-6 lg:col-span-4 group relative h-72 sm:h-80 bg-cavemen-card border border-white/10 overflow-hidden cursor-pointer shadow-xl hover:border-cavemen-bronze/60 transition-all duration-500"
          >
            <img
              src={siteConfig.atmosphereGallery[2].src}
              alt={siteConfig.atmosphereGallery[2].title}
              loading="lazy"
              className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cavemen-black via-transparent to-transparent opacity-80" />

            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cavemen-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-cavemen-offwhite group-hover:text-cavemen-bronze transition-colors">
              <Eye className="w-3.5 h-3.5" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1">
              <h3 className="font-cinzel text-lg font-bold text-cavemen-offwhite">
                {siteConfig.atmosphereGallery[2].title}
              </h3>
              <p className="text-xs text-cavemen-softgrey font-light">
                {siteConfig.atmosphereGallery[2].caption}
              </p>
            </div>
          </div>

          {/* Item 4: Private Lounge (4 columns) */}
          <div
            onClick={() => setActiveMedia(siteConfig.atmosphereGallery[3])}
            className="col-span-12 sm:col-span-6 lg:col-span-4 group relative h-72 sm:h-80 bg-cavemen-card border border-white/10 overflow-hidden cursor-pointer shadow-xl hover:border-cavemen-bronze/60 transition-all duration-500"
          >
            <img
              src={siteConfig.atmosphereGallery[3].src}
              alt={siteConfig.atmosphereGallery[3].title}
              loading="lazy"
              className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cavemen-black via-transparent to-transparent opacity-80" />

            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cavemen-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-cavemen-offwhite group-hover:text-cavemen-bronze transition-colors">
              <Eye className="w-3.5 h-3.5" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1">
              <h3 className="font-cinzel text-lg font-bold text-cavemen-offwhite">
                {siteConfig.atmosphereGallery[3].title}
              </h3>
              <p className="text-xs text-cavemen-softgrey font-light">
                {siteConfig.atmosphereGallery[3].caption}
              </p>
            </div>
          </div>

          {/* Item 5: Artisan Barbering (4 columns) */}
          <div
            onClick={() => setActiveMedia(siteConfig.atmosphereGallery[4])}
            className="col-span-12 sm:col-span-6 lg:col-span-4 group relative h-72 sm:h-80 bg-cavemen-card border border-white/10 overflow-hidden cursor-pointer shadow-xl hover:border-cavemen-bronze/60 transition-all duration-500"
          >
            <img
              src={siteConfig.atmosphereGallery[4].src}
              alt={siteConfig.atmosphereGallery[4].title}
              loading="lazy"
              className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cavemen-black via-transparent to-transparent opacity-80" />

            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cavemen-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-cavemen-offwhite group-hover:text-cavemen-bronze transition-colors">
              <Eye className="w-3.5 h-3.5" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1">
              <h3 className="font-cinzel text-lg font-bold text-cavemen-offwhite">
                {siteConfig.atmosphereGallery[4].title}
              </h3>
              <p className="text-xs text-cavemen-softgrey font-light">
                {siteConfig.atmosphereGallery[4].caption}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox Modal */}
      {activeMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-cavemen-black/95 backdrop-blur-xl">
          <div
            onClick={() => setActiveMedia(null)}
            className="absolute inset-0 cursor-pointer"
          />

          <div className="relative z-10 max-w-5xl w-full bg-cavemen-card border border-cavemen-bronze/40 p-4 sm:p-6 shadow-2xl space-y-4">
            
            {/* Modal Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
                  Conceptual Ambiance
                </span>
                <h4 className="font-cinzel text-lg sm:text-xl font-bold text-cavemen-offwhite">
                  {activeMedia.title}
                </h4>
              </div>

              <button
                onClick={() => setActiveMedia(null)}
                className="p-2 text-cavemen-softgrey hover:text-cavemen-offwhite hover:bg-white/5 transition-colors"
                aria-label="Close image preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Content */}
            <div className="relative max-h-[65vh] overflow-hidden flex items-center justify-center bg-cavemen-black">
              {activeMedia.type === 'video' ? (
                <video
                  autoPlay
                  controls
                  loop
                  playsInline
                  className="max-h-[65vh] w-auto max-w-full object-contain"
                >
                  <source src={activeMedia.src} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={activeMedia.src}
                  alt={activeMedia.title}
                  className="max-h-[65vh] w-auto max-w-full object-contain"
                />
              )}
            </div>

            {/* Caption */}
            <div className="pt-2 text-xs text-cavemen-softgrey font-sans">
              <p>{activeMedia.caption}</p>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
