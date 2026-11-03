import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Check,
  ChevronRight,
  ChevronLeft,
  Scissors,
  Sparkles,
  AlertCircle,
  Copy,
  Mail,
  Phone,
  ShieldCheck,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { supabase, getServices, getStaff, getAvailableSlots, createBookingAtomic } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function BookingModal({ isOpen, onClose, preselectedService = null }) {
  const { user, profile } = useAuth();

  // Wizard state: 1: Service, 2: Barber, 3: Date, 4: Time, 5: Customer Details, 6: Review, 7: Confirmed
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Data loaded from Supabase
  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Form selections
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null); // null = "Any Available Barber"
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Booking outcome
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  // Load services and staff on open
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    Promise.all([getServices(), getStaff()])
      .then(([srvs, stf]) => {
        if (!isMounted) return;
        setServices(srvs || []);
        setStaffList(stf || []);

        // Preselect service if passed
        if (preselectedService && srvs?.length > 0) {
          const match = srvs.find(s => s.name.toLowerCase() === preselectedService.toLowerCase()) || srvs[0];
          setSelectedService(match);
        } else if (srvs?.length > 0) {
          setSelectedService(srvs[0]);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Failed to load services');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // Default minimum date to today
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);

    // Pre-fill user profile if logged in
    if (profile) {
      setCustomerName(profile.full_name || '');
      setCustomerEmail(profile.email || '');
      setCustomerPhone(profile.phone || '');
    } else if (user) {
      setCustomerEmail(user.email || '');
    }

  }, [isOpen, preselectedService, profile, user]);

  // Recalculate available slots whenever date, service, or staff changes
  useEffect(() => {
    if (!isOpen || !selectedDate || !selectedService?.id) return;

    let isMounted = true;
    setLoadingSlots(true);
    setError(null);

    getAvailableSlots(selectedDate, selectedService.id, selectedStaff?.id || null)
      .then((slots) => {
        if (!isMounted) return;
        setAvailableSlots(slots || []);
        if (slots?.length > 0) {
          setSelectedTime(slots[0]);
        } else {
          setSelectedTime('');
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to calculate slots:', err);
          setAvailableSlots([]);
        }
      })
      .finally(() => {
        if (isMounted) setLoadingSlots(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedDate, selectedService, selectedStaff]);

  if (!isOpen) return null;

  // Next / Back handlers
  const handleNext = () => {
    setError(null);
    if (currentStep === 1 && !selectedService) {
      setError('Please select a service.');
      return;
    }
    if (currentStep === 3 && !selectedDate) {
      setError('Please choose an appointment date.');
      return;
    }
    if (currentStep === 4 && !selectedTime) {
      setError('Please pick an available time slot.');
      return;
    }
    if (currentStep === 5) {
      if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
        setError('Please fill in your name, email, and phone number.');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Final Atomic Submission
  const handleConfirmBooking = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Execute atomic booking function in PostgreSQL
      const bookingResult = await createBookingAtomic({
        serviceId: selectedService.id,
        appointmentDate: selectedDate,
        startTime: selectedTime,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        customerNotes: customerNotes.trim(),
        staffId: selectedStaff?.id || null,
        customerId: user?.id || null,
      });

      setConfirmedBooking(bookingResult);
      setCurrentStep(7); // Show confirmation screen

      // 2. Trigger automated welcome & confirmation email via Supabase Edge Function
      triggerConfirmationEmail(bookingResult.id);

    } catch (err) {
      console.error('Booking creation error:', err);
      setError(err.message || 'Unable to confirm booking. Please choose another time slot.');
    } finally {
      setLoading(false);
    }
  };

  // Trigger Edge Function for Resend delivery
  const triggerConfirmationEmail = async (bookingId) => {
    try {
      setEmailStatus('sending');
      const { data, error: funcErr } = await supabase.functions.invoke('send-booking-email', {
        body: {
          booking_id: bookingId,
          email_type: 'booking_confirmation'
        }
      });

      if (funcErr || !data?.success) {
        console.warn('Email delivery logged as failed or pending:', funcErr || data);
        setEmailStatus('failed');
      } else {
        setEmailStatus('sent');
      }
    } catch (e) {
      console.warn('Email service unreachable:', e);
      setEmailStatus('failed');
    }
  };

  const handleCopyRef = () => {
    if (confirmedBooking?.booking_reference) {
      navigator.clipboard.writeText(confirmedBooking.booking_reference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const maxDateStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => currentStep !== 7 && onClose()}
        className="fixed inset-0 bg-cavemen-black/90 backdrop-blur-md transition-opacity"
      />

      {/* Main Dialog Modal */}
      <div className="relative z-10 w-full max-w-2xl bg-cavemen-card border border-cavemen-bronze/40 p-6 sm:p-8 shadow-2xl max-h-[94vh] flex flex-col justify-between overflow-y-auto">
        
        {/* Top Header */}
        <div>
          <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
                CAVEMEN Concierge • Step {currentStep} of 6
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-cavemen-offwhite uppercase">
                {currentStep === 1 && 'Select Your Grooming Service'}
                {currentStep === 2 && 'Choose Your Master Barber'}
                {currentStep === 3 && 'Select Appointment Date'}
                {currentStep === 4 && 'Choose Available Time Slot'}
                {currentStep === 5 && 'Guest & Contact Information'}
                {currentStep === 6 && 'Review & Confirm Appointment'}
                {currentStep === 7 && 'Appointment Confirmed'}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-cavemen-softgrey hover:text-cavemen-offwhite transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Indicator */}
          {currentStep < 7 && (
            <div className="flex items-center space-x-1.5 mb-6">
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <div
                  key={step}
                  className={`h-1 flex-1 transition-all duration-300 ${
                    step === currentStep
                      ? 'bg-cavemen-bronze'
                      : step < currentStep
                      ? 'bg-cavemen-bronze/40'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-3 bg-red-950/40 border border-red-500/40 flex items-start space-x-2 text-xs text-red-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1: SERVICE SELECTION */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-cavemen-softgrey font-sans">
                Choose from our classical and modern precision haircutting and beard grooming rituals.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {services.map((srv) => {
                  const isSelected = selectedService?.id === srv.id;
                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedService(srv)}
                      className={`p-4 border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-cavemen-bronze bg-cavemen-bronze/10 shadow-bronze-subtle'
                          : 'border-white/10 bg-cavemen-charcoal/60 hover:border-white/20'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-cinzel text-sm font-bold text-cavemen-offwhite">
                            {srv.name}
                          </h4>
                          <span className="text-[10px] text-cavemen-bronze font-sans uppercase">
                            {srv.duration_minutes}m
                          </span>
                        </div>
                        <p className="text-[11px] text-cavemen-softgrey line-clamp-2">
                          {srv.description}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-cavemen-offwhite">
                          KES {Number(srv.price).toLocaleString()}
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-cavemen-bronze bg-cavemen-bronze text-cavemen-black' : 'border-white/20'
                        }`}>
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: BARBER SELECTION */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-xs text-cavemen-softgrey font-sans">
                Select your preferred master barber, or choose "Any Available Barber" for maximum schedule flexibility.
              </p>

              <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                
                {/* Any Available Barber Option */}
                <div
                  onClick={() => setSelectedStaff(null)}
                  className={`p-4 border cursor-pointer transition-all flex items-center justify-between ${
                    selectedStaff === null
                      ? 'border-cavemen-bronze bg-cavemen-bronze/10 shadow-bronze-subtle'
                      : 'border-white/10 bg-cavemen-charcoal/60 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 border border-cavemen-bronze/50 bg-cavemen-black flex items-center justify-center text-cavemen-bronze">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-cinzel text-sm font-bold text-cavemen-offwhite">
                        Any Available Master Barber
                      </h4>
                      <p className="text-[11px] text-cavemen-softgrey">
                        Our scheduling system will assign the optimal available artisan.
                      </p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedStaff === null ? 'border-cavemen-bronze bg-cavemen-bronze text-cavemen-black' : 'border-white/20'
                  }`}>
                    {selectedStaff === null && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Specific Staff List */}
                {staffList.map((stf) => {
                  const isSelected = selectedStaff?.id === stf.id;
                  return (
                    <div
                      key={stf.id}
                      onClick={() => setSelectedStaff(stf)}
                      className={`p-4 border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-cavemen-bronze bg-cavemen-bronze/10 shadow-bronze-subtle'
                          : 'border-white/10 bg-cavemen-charcoal/60 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={stf.avatar_url || '/images/gallery-craft-tools.jpg'}
                          alt={stf.full_name}
                          className="w-10 h-10 object-cover border border-white/10"
                        />
                        <div>
                          <h4 className="font-cinzel text-sm font-bold text-cavemen-offwhite">
                            {stf.full_name}
                          </h4>
                          <p className="text-[11px] text-cavemen-softgrey line-clamp-1">
                            {stf.bio || stf.specialties?.join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-cavemen-bronze bg-cavemen-bronze text-cavemen-black' : 'border-white/20'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: DATE SELECTION */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-cavemen-softgrey font-sans">
                Choose a date within our 30-day advance booking window.
              </p>

              <div className="p-6 bg-cavemen-charcoal/60 border border-white/10 space-y-4">
                <label className="block text-xs uppercase tracking-wider text-cavemen-offwhite font-medium">
                  Select Appointment Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  max={maxDateStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-cavemen-black border border-cavemen-bronze/40 px-4 py-3 text-sm text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                />

                <div className="text-[11px] text-cavemen-softgrey flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-cavemen-bronze" />
                  <span>Mon – Fri: 08:00 – 20:00 • Sat: 08:30 – 20:00 • Sun: 10:00 – 18:00</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: TIME SELECTION */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-cavemen-softgrey font-sans">
                  Available appointments for <strong>{selectedDate}</strong> ({selectedService?.duration_minutes} mins):
                </p>
                {loadingSlots && (
                  <span className="text-[10px] text-cavemen-bronze flex items-center">
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Calculating...
                  </span>
                )}
              </div>

              {availableSlots.length === 0 && !loadingSlots ? (
                <div className="p-8 text-center bg-cavemen-charcoal/40 border border-white/5 space-y-2">
                  <p className="text-xs text-cavemen-softgrey">
                    No open appointment slots remaining on this date with the selected barber.
                  </p>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="text-xs uppercase tracking-wider text-cavemen-bronze underline"
                  >
                    Select Another Date
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[46vh] overflow-y-auto pr-1">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`py-3 px-2 border text-xs font-semibold tracking-wider transition-all ${
                          isSelected
                            ? 'border-cavemen-bronze bg-cavemen-bronze text-cavemen-black shadow-bronze-glow'
                            : 'border-white/10 bg-cavemen-charcoal/60 text-cavemen-offwhite hover:border-cavemen-bronze/40'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: CUSTOMER INFORMATION */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <p className="text-xs text-cavemen-softgrey font-sans">
                Please provide your contact details for appointment confirmation and concierge updates.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-cavemen-offwhite mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Christian Vance"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-cavemen-charcoal border border-white/15 px-3.5 py-2.5 text-xs text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-cavemen-offwhite mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="christian@example.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-cavemen-charcoal border border-white/15 px-3.5 py-2.5 text-xs text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-cavemen-offwhite mb-1">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+254 700 000 000"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-cavemen-charcoal border border-white/15 px-3.5 py-2.5 text-xs text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-cavemen-offwhite mb-1">
                    Special Grooming Notes (Optional)
                  </label>
                  <textarea
                    rows="2"
                    placeholder="Skin sensitivities, beverage requests, or desired styling guidance"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full bg-cavemen-charcoal border border-white/15 px-3.5 py-2 text-xs text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW & CONFIRM */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <p className="text-xs text-cavemen-softgrey font-sans">
                Please verify your appointment parameters before final scheduling.
              </p>

              <div className="p-5 bg-cavemen-charcoal border border-cavemen-bronze/40 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs uppercase tracking-wider text-cavemen-softgrey">Service</span>
                  <span className="font-cinzel text-sm font-bold text-cavemen-offwhite">{selectedService?.name}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs uppercase tracking-wider text-cavemen-softgrey">Master Barber</span>
                  <span className="text-xs text-cavemen-offwhite font-medium">{selectedStaff?.full_name || 'Any Available Barber'}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs uppercase tracking-wider text-cavemen-softgrey">Date & Time</span>
                  <span className="text-xs text-cavemen-bronze font-semibold">{selectedDate} @ {selectedTime}</span>
                </div>

                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs uppercase tracking-wider text-cavemen-softgrey">Client Details</span>
                  <span className="text-xs text-cavemen-offwhite">{customerName} ({customerPhone})</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs uppercase tracking-wider text-cavemen-softgrey font-bold">Total Investment</span>
                  <span className="font-cinzel text-base font-bold text-cavemen-bronze">
                    KES {Number(selectedService?.price).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/5 text-[11px] text-cavemen-softgrey flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-cavemen-bronze shrink-0" />
                <span>Protected with atomic double-booking exclusion & instant server validation.</span>
              </div>
            </div>
          )}

          {/* STEP 7: CONFIRMATION OUTCOME */}
          {currentStep === 7 && confirmedBooking && (
            <div className="space-y-6 py-2 text-center">
              <div className="w-14 h-14 mx-auto rounded-full border border-cavemen-bronze bg-cavemen-bronze/10 flex items-center justify-center text-cavemen-bronze shadow-bronze-glow">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
                  Reservation Secured
                </span>
                <h4 className="font-cinzel text-2xl font-bold text-cavemen-offwhite uppercase mt-1">
                  Welcome to CAVEMEN
                </h4>
                <p className="text-xs text-cavemen-softgrey mt-1">
                  Your appointment has been registered in our schedule.
                </p>
              </div>

              {/* Reference Card */}
              <div className="p-5 bg-cavemen-charcoal border border-cavemen-bronze/50 text-left space-y-2.5 max-w-md mx-auto">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-cavemen-softgrey">Booking Reference</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-cavemen-bronze">
                      {confirmedBooking.booking_reference}
                    </span>
                    <button
                      onClick={handleCopyRef}
                      className="text-cavemen-softgrey hover:text-cavemen-offwhite"
                      title="Copy Reference"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-cavemen-softgrey">Service</span>
                  <span className="text-cavemen-offwhite font-medium">{confirmedBooking.service_name}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-cavemen-softgrey">Barber</span>
                  <span className="text-cavemen-offwhite">{confirmedBooking.staff_name}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-cavemen-softgrey">Schedule</span>
                  <span className="text-cavemen-offwhite font-medium">
                    {confirmedBooking.appointment_date} at {confirmedBooking.start_time} - {confirmedBooking.end_time}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                  <span className="text-cavemen-softgrey">Email Notification</span>
                  <span className="text-[11px] text-cavemen-bronze flex items-center">
                    <Mail className="w-3 h-3 mr-1" />
                    {emailStatus === 'sent' ? 'Sent to your inbox' : emailStatus === 'sending' ? 'Sending confirmation...' : 'Logged'}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-8 py-3 bg-cavemen-bronze text-cavemen-black text-xs font-semibold uppercase tracking-[0.2em] hover:bg-cavemen-bronzeLight transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions (Steps 1 to 6) */}
        {currentStep < 7 && (
          <div className="pt-6 border-t border-white/10 flex items-center justify-between mt-6">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="inline-flex items-center text-xs uppercase tracking-wider text-cavemen-softgrey hover:text-cavemen-offwhite transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="px-6 py-2.5 bg-cavemen-bronze text-cavemen-black font-semibold text-xs uppercase tracking-[0.2em] hover:bg-cavemen-bronzeLight transition-all flex items-center"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={loading}
                className="px-8 py-3 bg-cavemen-bronze text-cavemen-black font-bold text-xs uppercase tracking-[0.22em] hover:bg-cavemen-bronzeLight hover:shadow-bronze-glow transition-all flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                    <span>Securing Slot...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1.5" />
                    <span>Confirm & Book</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
