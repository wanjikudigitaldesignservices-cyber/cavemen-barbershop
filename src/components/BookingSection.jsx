import React from 'react';
import { Calendar, MessageSquare, Clock, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function BookingSection({ onOpenBooking, businessSettings }) {
  const whatsappNum = businessSettings?.whatsapp_number || siteConfig.booking.whatsappNumber;
  const hasWhatsapp = Boolean(whatsappNum);

  const handleDirectWhatsapp = () => {
    if (hasWhatsapp) {
      const message = encodeURIComponent(siteConfig.booking.defaultBookingMessage);
      window.open(`https://wa.me/${whatsappNum}?text=${message}`, '_blank');
    } else {
      onOpenBooking();
    }
  };

  return (
    <section id="contact" className="relative py-28 sm:py-36 bg-cavemen-charcoal overflow-hidden border-t border-white/5">
      
      {/* Decorative luxury radial background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cavemen-bronze/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Subtle border lines */}
      <div className="absolute inset-0 bg-subtle-grain pointer-events-none opacity-40" />

      <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center relative z-10">
        
        {/* Monogram Badge */}
        <div className="inline-flex items-center justify-center w-12 h-12 mb-8 border border-cavemen-bronze/50 bg-cavemen-black/60 shadow-bronze-subtle">
          <span className="font-cinzel text-cavemen-bronze text-xl font-bold tracking-widest">C</span>
        </div>

        {/* Small Tagline Pre-Title */}
        <p className="font-sans text-xs uppercase tracking-[0.35em] text-cavemen-bronze font-semibold mb-4">
          Reserve Your Ritual
        </p>

        {/* Headline */}
        <h2 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-cavemen-offwhite uppercase mb-6 leading-tight max-w-3xl mx-auto">
          YOUR NEXT LOOK STARTS HERE.
        </h2>

        {/* Supporting Copy */}
        <p className="font-sans text-base sm:text-lg text-cavemen-offwhite/85 max-w-xl mx-auto mb-10 font-light leading-relaxed">
          Make time for yourself. Experience grooming with precision.
        </p>

        {/* Primary Booking Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => onOpenBooking()}
            className="w-full sm:w-auto px-10 py-5 bg-cavemen-bronze text-cavemen-black font-semibold text-xs uppercase tracking-[0.22em] transition-all duration-300 hover:bg-cavemen-bronzeLight hover:shadow-bronze-glow hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-3 group"
          >
            <Calendar className="w-4 h-4 text-cavemen-black" />
            <span>BOOK YOUR APPOINTMENT</span>
          </button>
        </div>

        {/* Configurable Booking Notice Badge */}
        <div className="mt-8 max-w-lg mx-auto">
          <div className="p-4 bg-cavemen-black/60 border border-white/10 text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-cavemen-bronze text-xs font-sans uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Concierge Booking</span>
            </div>
            <p className="text-[11px] text-cavemen-softgrey leading-relaxed">
              {hasWhatsapp 
                ? `Instant WhatsApp confirmation available at +${siteConfig.booking.whatsappNumber}`
                : `Official WhatsApp booking channel is being connected. Click "Book Your Appointment" to prepare your consultation details or visit us in-store.`
              }
            </p>
          </div>
        </div>

        {/* Studio Location & Hours Quick Indicators */}
        <div className="mt-14 pt-10 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
          <div className="flex items-start space-x-3 p-4 bg-cavemen-black/30 border border-white/5">
            <MapPin className="w-4 h-4 text-cavemen-bronze shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-cavemen-bronze font-semibold">
                Flagship Studio
              </p>
              <p className="text-xs text-cavemen-offwhite/90 mt-0.5">
                {siteConfig.contact.address}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-cavemen-black/30 border border-white/5">
            <Clock className="w-4 h-4 text-cavemen-bronze shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-cavemen-bronze font-semibold">
                Appointments & Hours
              </p>
              <p className="text-xs text-cavemen-offwhite/90 mt-0.5">
                {siteConfig.contact.openingHours.weekdays}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
