import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, MapPin, ChevronDown, Sparkles, ArrowRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function Hero({ onOpenBooking }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Attempt auto-play when mounted
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay may be restricted by some browser policies until user interacts
        setIsPlaying(false);
      });
    }
  }, []);

  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const scrollToServices = (e) => {
    e.preventDefault();
    const target = document.querySelector('#services');
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
    <section id="hero" className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-cavemen-black">
      
      {/* Background Cinematic Video with Fallback Poster */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-poster.jpg"
          onLoadedData={() => setIsLoaded(true)}
          className="w-full h-full object-cover object-center scale-[1.02] filter brightness-[0.82] contrast-[1.05]"
        >
          <source src="/videos/cavemen-hero.mp4" type="video/mp4" />
          {/* Fallback image is rendered if video element is not supported */}
        </video>

        {/* Sophisticated Multi-Layer Luxury Overlay */}
        {/* Dark radial vignette */}
        <div className="absolute inset-0 bg-radial-vignette opacity-80 pointer-events-none" />
        
        {/* Editorial gradient for typography contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-cavemen-black via-cavemen-black/60 to-cavemen-black/45 pointer-events-none" />
        
        {/* Subtle warm bronze ambient tint in upper quadrant */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cavemen-bronze/10 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center pt-28 pb-20 flex flex-col items-center justify-center">
        
        {/* Subtle Location & Concept Badge */}
        <div className="inline-flex items-center space-x-2 px-3 sm:px-4 py-1.5 mb-8 rounded-full border border-cavemen-bronze/40 bg-cavemen-black/60 backdrop-blur-md text-cavemen-offwhite/90 text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] uppercase font-sans max-w-[92vw] text-center">
          <MapPin className="w-3.5 h-3.5 text-cavemen-bronze shrink-0" />
          <span className="text-cavemen-bronze font-semibold">Location:</span>
          <span className="text-cavemen-offwhite/80 truncate">{siteConfig.contact.address}</span>
        </div>

        {/* Editorial Pre-Heading / Tagline */}
        <p className="font-sans text-xs sm:text-sm uppercase tracking-[0.35em] text-cavemen-bronze font-medium mb-4">
          {siteConfig.brand.tagline}
        </p>

        {/* Main Headline */}
        <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[0.08em] sm:tracking-[0.12em] text-cavemen-offwhite uppercase leading-[1.05] sm:leading-[1.1] mb-6 drop-shadow-2xl max-w-4xl">
          OWN YOUR STYLE.
        </h1>

        {/* Divider with Bronze Monogram Accent */}
        <div className="flex items-center justify-center space-x-4 my-3 w-48">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-cavemen-bronze/60 to-cavemen-bronze" />
          <div className="w-2 h-2 rotate-45 border border-cavemen-bronze bg-cavemen-black" />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-cavemen-bronze/60 to-cavemen-bronze" />
        </div>

        {/* Supporting Text */}
        <p className="font-sans text-base sm:text-lg md:text-xl text-cavemen-offwhite/85 font-light tracking-wide max-w-2xl mx-auto mt-4 mb-10 leading-relaxed">
          Precision grooming. Exceptional service. A space designed for the modern man.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md mx-auto">
          
          {/* Primary CTA */}
          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto px-8 py-4 bg-cavemen-bronze text-cavemen-black font-semibold text-xs uppercase tracking-[0.22em] transition-all duration-300 hover:bg-cavemen-bronzeLight hover:shadow-bronze-glow hover:-translate-y-0.5 active:translate-y-0"
          >
            BOOK YOUR APPOINTMENT
          </button>

          {/* Secondary CTA */}
          <a
            href="#services"
            onClick={scrollToServices}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-cavemen-offwhite font-medium text-xs uppercase tracking-[0.22em] transition-all duration-300 hover:border-cavemen-bronze hover:text-cavemen-bronze hover:bg-white/[0.02]"
          >
            EXPLORE OUR SERVICES
          </a>
        </div>

        {/* Conceptual Visual Notice (Transparent & Professional) */}
        <p className="text-[10px] sm:text-[11px] text-cavemen-softgrey/60 tracking-wider uppercase mt-8 font-sans">
          * Conceptual studio atmosphere visualization • Opening officially in Nairobi
        </p>
      </div>

      {/* Video Control Widget (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20 hidden sm:flex items-center space-x-3 bg-cavemen-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full">
        <button
          onClick={toggleVideoPlayback}
          className="text-cavemen-softgrey hover:text-cavemen-bronze transition-colors focus:outline-none flex items-center space-x-1.5 text-[10px] uppercase tracking-widest font-sans"
          title={isPlaying ? "Pause background atmosphere" : "Play background atmosphere"}
        >
          {isPlaying ? <Pause className="w-3 h-3 text-cavemen-bronze" /> : <Play className="w-3 h-3 text-cavemen-bronze" />}
          <span>{isPlaying ? 'Pause Motion' : 'Play Motion'}</span>
        </button>
      </div>

      {/* Scroll Down Indicator (Bottom Center) */}
      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          const target = document.querySelector('#about');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-cavemen-softgrey/60 hover:text-cavemen-bronze transition-colors group cursor-pointer"
        aria-label="Scroll to introduction"
      >
        <span className="text-[9px] uppercase tracking-[0.25em] mb-2 font-sans">Scroll</span>
        <div className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center p-1 group-hover:border-cavemen-bronze/60 transition-colors">
          <div className="w-1 h-2 bg-cavemen-bronze rounded-full animate-bounce" />
        </div>
      </a>
    </section>
  );
}
