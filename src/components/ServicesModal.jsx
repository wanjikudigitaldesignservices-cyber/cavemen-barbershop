import React from 'react';
import { X, Clock, Calendar, Check, ArrowRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function ServicesModal({ isOpen, onClose, onSelectServiceForBooking }) {
  if (!isOpen) return null;

  const handleSelectService = (serviceName) => {
    onClose();
    onSelectServiceForBooking(serviceName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-cavemen-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog Container */}
      <div className="relative z-10 w-full max-w-4xl bg-cavemen-card border border-cavemen-bronze/40 p-6 sm:p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-6 mb-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
              The CAVEMEN Menu
            </span>
            <h3 className="font-cinzel text-2xl sm:text-4xl font-bold text-cavemen-offwhite uppercase mt-1">
              Complete Grooming Services
            </h3>
            <p className="text-xs text-cavemen-softgrey mt-1 font-sans">
              All services include personalized consultation and premium finishing tonics.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-cavemen-softgrey hover:text-cavemen-offwhite hover:bg-white/5 transition-colors rounded-none"
            aria-label="Close services modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Services Section */}
        <div className="space-y-6 mb-10">
          <h4 className="font-cinzel text-xs uppercase tracking-[0.2em] text-cavemen-bronze font-semibold border-b border-white/5 pb-2">
            Signature Services
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {siteConfig.services.map((service) => (
              <div
                key={service.id}
                className="p-5 bg-cavemen-charcoal/80 border border-white/5 hover:border-cavemen-bronze/40 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-cinzel text-lg font-bold text-cavemen-offwhite">
                      {service.name}
                    </h5>
                    <span className="text-[10px] uppercase tracking-wider text-cavemen-softgrey flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-cavemen-bronze" />
                      {service.duration}
                    </span>
                  </div>

                  <p className="text-xs text-cavemen-softgrey leading-relaxed">
                    {service.longDescription || service.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-cavemen-bronze tracking-wider uppercase">
                    {service.price}
                  </span>
                  
                  <button
                    onClick={() => handleSelectService(service.name)}
                    className="text-xs uppercase tracking-wider font-semibold text-cavemen-offwhite hover:text-cavemen-bronze flex items-center space-x-1"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Specialized Treatments */}
        <div className="space-y-6">
          <h4 className="font-cinzel text-xs uppercase tracking-[0.2em] text-cavemen-bronze font-semibold border-b border-white/5 pb-2">
            Specialized & Ritual Treatments
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {siteConfig.additionalServices.map((service) => (
              <div
                key={service.id}
                className="p-5 bg-cavemen-charcoal/80 border border-white/5 hover:border-cavemen-bronze/40 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-cinzel text-lg font-bold text-cavemen-offwhite">
                      {service.name}
                    </h5>
                    <span className="text-[10px] uppercase tracking-wider text-cavemen-softgrey flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-cavemen-bronze" />
                      {service.duration}
                    </span>
                  </div>

                  <p className="text-xs text-cavemen-softgrey leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-cavemen-bronze tracking-wider uppercase">
                    {service.price}
                  </span>
                  
                  <button
                    onClick={() => handleSelectService(service.name)}
                    className="text-xs uppercase tracking-wider font-semibold text-cavemen-offwhite hover:text-cavemen-bronze flex items-center space-x-1"
                  >
                    <span>Book</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-cavemen-softgrey gap-4">
          <p className="font-sans">
            * Exact pricing will be confirmed in-store based on custom requirements and hair/beard length.
          </p>
          <button
            onClick={() => handleSelectService("Consultation & Service")}
            className="px-6 py-2.5 bg-cavemen-bronze text-cavemen-black font-semibold uppercase tracking-[0.18em] hover:bg-cavemen-bronzeLight transition-colors"
          >
            General Appointment
          </button>
        </div>

      </div>
    </div>
  );
}
