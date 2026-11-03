import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, MessageSquare, Check, Sparkles, AlertCircle, Copy } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export default function BookingModal({ isOpen, onClose, preselectedService }) {
  const [service, setService] = useState('Classic Haircut');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (09:00 - 12:00)');
  const [notes, setNotes] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedService) {
      setService(preselectedService);
    }
  }, [preselectedService]);

  if (!isOpen) return null;

  const allServices = [
    ...siteConfig.services.map(s => s.name),
    ...siteConfig.additionalServices.map(s => s.name),
    "General Grooming Consultation"
  ];

  const hasWhatsapp = Boolean(siteConfig.booking.whatsappNumber);

  const formattedMessage = `*CAVEMEN APPOINTMENT REQUEST*
• Service: ${service}
• Preferred Date: ${preferredDate || '[Next Available]'}
• Preferred Time: ${preferredTime}
• Client: ${clientName || '[Guest]'}
• Contact: ${clientPhone || '[Phone]'}
${notes ? `• Notes: ${notes}` : ''}`;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (hasWhatsapp) {
      const url = `https://wa.me/${siteConfig.booking.whatsappNumber}?text=${encodeURIComponent(formattedMessage)}`;
      window.open(url, '_blank');
      setSubmitted(true);
    } else {
      // WhatsApp number not yet set in siteConfig
      setSubmitted(true);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-cavemen-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog Container */}
      <div className="relative z-10 w-full max-w-xl bg-cavemen-card border border-cavemen-bronze/40 p-6 sm:p-10 shadow-2xl max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-5 mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
              Concierge Booking
            </span>
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-cavemen-offwhite uppercase mt-1">
              Book Your Appointment
            </h3>
            <p className="text-xs text-cavemen-softgrey mt-1 font-sans">
              Experience modern grooming designed for your standard.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-cavemen-softgrey hover:text-cavemen-offwhite hover:bg-white/5 transition-colors"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If appointment request submitted & WhatsApp pending */}
        {submitted && !hasWhatsapp ? (
          <div className="space-y-6 py-4">
            <div className="p-5 border border-cavemen-bronze/40 bg-cavemen-black/60 space-y-3">
              <div className="flex items-center space-x-2 text-cavemen-bronze">
                <Sparkles className="w-4 h-4" />
                <h4 className="font-cinzel text-sm uppercase tracking-wider font-bold">
                  Appointment Request Ready
                </h4>
              </div>
              <p className="text-xs text-cavemen-softgrey leading-relaxed">
                The official CAVEMEN WhatsApp contact line is currently in final setup. You can copy your formatted appointment request below or visit our studio in-person:
              </p>

              <div className="bg-cavemen-charcoal p-3 border border-white/10 rounded font-mono text-[11px] text-cavemen-offwhite/90 whitespace-pre-line">
                {formattedMessage}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-2 bg-cavemen-bronze text-cavemen-black text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 hover:bg-cavemen-bronzeLight transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Request'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs text-cavemen-softgrey hover:text-cavemen-offwhite underline"
                >
                  Edit Details
                </button>
              </div>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/5 text-[11px] text-cavemen-softgrey">
              <strong className="text-cavemen-offwhite">Studio Address:</strong> {siteConfig.contact.address}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-white/10 text-cavemen-offwhite text-xs uppercase tracking-widest font-semibold hover:bg-white/20 transition-colors"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Service Selection */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-cavemen-offwhite/90 font-medium mb-1.5">
                Selected Service
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-cavemen-charcoal border border-white/15 px-4 py-3 text-xs text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none transition-colors"
              >
                {allServices.map((s) => (
                  <option key={s} value={s} className="bg-cavemen-card text-cavemen-offwhite">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time Slot Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-cavemen-offwhite/90 font-medium mb-1.5">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-cavemen-charcoal border border-white/15 px-4 py-3 text-xs text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-cavemen-offwhite/90 font-medium mb-1.5">
                  Time Preference
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-cavemen-charcoal border border-white/15 px-4 py-3 text-xs text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none transition-colors"
                >
                  <option value="Morning (09:00 - 12:00)">Morning (09:00 - 12:00)</option>
                  <option value="Afternoon (12:00 - 16:00)">Afternoon (12:00 - 16:00)</option>
                  <option value="Evening (16:00 - 20:00)">Evening (16:00 - 20:00)</option>
                </select>
              </div>
            </div>

            {/* Guest Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-cavemen-offwhite/90 font-medium mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Vance"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-cavemen-charcoal border border-white/15 px-4 py-3 text-xs text-cavemen-offwhite placeholder:text-cavemen-softgrey/50 focus:border-cavemen-bronze focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-cavemen-offwhite/90 font-medium mb-1.5">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +254 700 000 000"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-cavemen-charcoal border border-white/15 px-4 py-3 text-xs text-cavemen-offwhite placeholder:text-cavemen-softgrey/50 focus:border-cavemen-bronze focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Special Request */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-cavemen-offwhite/90 font-medium mb-1.5">
                Special Requests or Styling Notes (Optional)
              </label>
              <textarea
                rows="2"
                placeholder="Specific barber preference, skin sensitivity, beverage request, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-cavemen-charcoal border border-white/15 px-4 py-2.5 text-xs text-cavemen-offwhite placeholder:text-cavemen-softgrey/50 focus:border-cavemen-bronze focus:outline-none transition-colors"
              />
            </div>

            {/* Price Policy Notice */}
            <div className="p-3 bg-cavemen-black/50 border border-white/5 text-[11px] text-cavemen-softgrey">
              <span className="text-cavemen-bronze font-semibold uppercase tracking-wider">Note:</span> Prices are confirmed in-store upon hair & beard consultation.
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 bg-cavemen-bronze text-cavemen-black font-semibold text-xs uppercase tracking-[0.22em] transition-all duration-300 hover:bg-cavemen-bronzeLight hover:shadow-bronze-glow flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>
                  {hasWhatsapp ? 'Confirm via WhatsApp' : 'Submit Appointment Request'}
                </span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
