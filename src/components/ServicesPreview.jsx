import React, { useState } from 'react';
import { Calendar, Clock, ArrowUpRight, Scissors, Sparkles } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function ServicesPreview({ onOpenBooking, onOpenAllServices, content }) {
  return (
    <section id="services" className="relative py-24 sm:py-32 bg-cavemen-black">
      
      {/* Background glow accent */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cavemen-bronze/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-[1px] bg-cavemen-bronze" />
              <span className="text-xs uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
                Curated Offerings
              </span>
            </div>
            
            <h2 className="font-cinzel text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-cavemen-offwhite uppercase">
              {content?.title || 'THE ART OF GROOMING'}
            </h2>
            
            <p className="font-sans text-sm sm:text-base text-cavemen-softgrey max-w-xl font-light">
              {content?.subtitle || 'Each service is executed with calculated precision, individualized consultation, and an unhurried dedication to your look.'}
            </p>
          </div>

          {/* Quick Filter / Modal Trigger */}
          <div>
            <button
              onClick={onOpenAllServices}
              className="inline-flex items-center px-6 py-3 border border-white/20 text-xs font-semibold uppercase tracking-[0.2em] text-cavemen-offwhite hover:border-cavemen-bronze hover:text-cavemen-bronze transition-all group"
            >
              <span>View All Services</span>
              <ArrowUpRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        {/* 4 Premium Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {siteConfig.services.map((service, index) => (
            <div
              key={service.id}
              className="group relative bg-cavemen-card border border-white/10 hover:border-cavemen-bronze/60 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1"
            >
              
              {/* Card Image Container */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-cavemen-charcoal">
                <img
                  src={service.image}
                  alt={service.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-cavemen-card via-cavemen-card/30 to-transparent" />

                {/* Service Index & Duration Badges */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <span className="px-2.5 py-1 text-[10px] font-cinzel font-semibold tracking-wider uppercase bg-cavemen-black/85 text-cavemen-bronze border border-cavemen-bronze/30">
                    0{index + 1}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-sans font-medium tracking-wider uppercase bg-cavemen-black/85 text-cavemen-offwhite/90 border border-white/10">
                    <Clock className="w-3 h-3 mr-1 text-cavemen-bronze" />
                    {service.duration}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                
                <div className="space-y-3">
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-cavemen-offwhite group-hover:text-cavemen-bronze transition-colors">
                    {service.name}
                  </h3>

                  <p className="font-sans text-xs sm:text-sm text-cavemen-softgrey leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>

                {/* Pricing Placeholder & Appointment Booking Button */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.15em] text-cavemen-bronze font-semibold">
                      {service.price}
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenBooking(service.name)}
                    className="w-full py-2.5 px-4 text-center text-xs font-semibold uppercase tracking-[0.18em] border border-cavemen-bronze/40 bg-cavemen-bronze/10 text-cavemen-offwhite hover:bg-cavemen-bronze hover:text-cavemen-black transition-all duration-300 flex items-center justify-center space-x-2 group/btn"
                  >
                    <Calendar className="w-3.5 h-3.5 text-cavemen-bronze group-hover/btn:text-cavemen-black transition-colors" />
                    <span>Book Service</span>
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 text-center">
          <p className="text-xs text-cavemen-softgrey font-sans uppercase tracking-[0.2em] mb-4">
            Looking for something tailored or private group grooming?
          </p>
          <button
            onClick={onOpenAllServices}
            className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.22em] text-cavemen-bronze hover:text-cavemen-bronzeLight transition-colors"
          >
            <span>Explore Complete Grooming Menu</span>
            <span className="ml-2">→</span>
          </button>
        </div>

      </div>
    </section>
  );
}
