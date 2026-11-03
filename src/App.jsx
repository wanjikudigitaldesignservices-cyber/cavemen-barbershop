import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BrandIntro from './components/BrandIntro';
import ServicesPreview from './components/ServicesPreview';
import ServicesModal from './components/ServicesModal';
import WhyChooseUs from './components/WhyChooseUs';
import AtmosphereGallery from './components/AtmosphereGallery';
import BookingSection from './components/BookingSection';
import BookingModal from './components/BookingModal';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/admin/AdminDashboard';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { getBusinessContent, getBusinessSettings } from './lib/supabase';
import { ShieldAlert, ArrowLeft, Key, Lock } from 'lucide-react';

function AppContent() {
  const { user, profile, isAdminOrOwner, loading: authLoading } = useAuth();
  
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'admin'
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Classic Haircut');
  
  // Dynamic Supabase CMS content & settings
  const [cmsContent, setCmsContent] = useState({});
  const [businessSettings, setBusinessSettings] = useState(null);

  // Sync with URL hash (#admin)
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else if (currentView === 'admin' && window.location.hash !== '#admin') {
        setCurrentView('landing');
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentView]);

  // Load published CMS content and settings on mount
  useEffect(() => {
    getBusinessContent()
      .then(content => setCmsContent(content || {}))
      .catch(err => console.warn('Using offline CMS defaults:', err));

    getBusinessSettings()
      .then(settings => setBusinessSettings(settings))
      .catch(err => console.warn('Using offline business settings:', err));
  }, []);

  const handleOpenBooking = (serviceName = 'Classic Haircut') => {
    setSelectedService(serviceName);
    setBookingModalOpen(true);
  };

  const handleOpenAllServices = () => {
    setServicesModalOpen(true);
  };

  const handleNavigateAdmin = () => {
    window.location.hash = 'admin';
    setCurrentView('admin');
  };

  const handleNavigateLanding = () => {
    window.location.hash = '';
    setCurrentView('landing');
  };

  // -------------------------------------------------------------
  // ADMIN CMS VIEW (PROTECTED)
  // -------------------------------------------------------------
  if (currentView === 'admin') {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-cavemen-black flex items-center justify-center text-cavemen-offwhite font-sans">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-2 border-cavemen-bronze border-t-transparent rounded-full animate-spin" />
            <p className="font-cinzel text-sm uppercase tracking-widest text-cavemen-bronze">
              Verifying Executive Clearance...
            </p>
          </div>
        </div>
      );
    }

    // If not logged in, prompt authentication
    if (!user) {
      return (
        <div className="min-h-screen bg-cavemen-black flex items-center justify-center p-6 text-cavemen-offwhite font-sans">
          <div className="max-w-md w-full bg-cavemen-card border border-cavemen-bronze/50 p-8 text-center space-y-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full border border-cavemen-bronze/50 bg-cavemen-black flex items-center justify-center mx-auto text-cavemen-bronze">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl font-bold uppercase text-cavemen-offwhite">
                Executive Access Required
              </h2>
              <p className="text-xs text-cavemen-softgrey mt-2">
                The CAVEMEN Concierge & CMS Dashboard is reserved for authorized personnel (Owner & Management).
              </p>
            </div>
            
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="w-full py-3 bg-cavemen-bronze text-cavemen-black font-semibold text-xs uppercase tracking-[0.2em] hover:bg-cavemen-bronzeLight transition-colors"
              >
                Sign In to Portal
              </button>

              <button
                onClick={handleNavigateLanding}
                className="w-full py-2.5 border border-white/20 text-cavemen-softgrey hover:text-cavemen-offwhite text-xs uppercase tracking-wider transition-colors flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Homepage</span>
              </button>
            </div>

            <AuthModal
              isOpen={authModalOpen}
              onClose={() => setAuthModalOpen(false)}
              onSuccess={() => {}}
            />
          </div>
        </div>
      );
    }

    // If logged in but does not hold manager or owner role
    if (!isAdminOrOwner) {
      return (
        <div className="min-h-screen bg-cavemen-black flex items-center justify-center p-6 text-cavemen-offwhite font-sans">
          <div className="max-w-md w-full bg-cavemen-card border border-amber-500/40 p-8 text-center space-y-6 shadow-2xl">
            <div className="w-12 h-12 rounded-full border border-amber-500/50 bg-cavemen-black flex items-center justify-center mx-auto text-amber-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-cinzel text-xl font-bold uppercase text-amber-400">
                Administrative Clearance Required
              </h2>
              <p className="text-xs text-cavemen-softgrey mt-2">
                Signed in as <strong className="text-cavemen-offwhite">{user.email}</strong> with role{' '}
                <span className="font-mono text-cavemen-bronze uppercase">[{profile?.role || 'customer'}]</span>.
              </p>
              <p className="text-xs text-cavemen-softgrey mt-1">
                Access to the CMS requires <strong className="text-cavemen-offwhite">Owner</strong> or <strong className="text-cavemen-offwhite">Manager</strong> privileges.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="w-full py-2.5 bg-cavemen-bronze/10 border border-cavemen-bronze text-cavemen-bronze hover:bg-cavemen-bronze hover:text-black font-semibold text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Elevate to Owner Role</span>
              </button>

              <button
                onClick={handleNavigateLanding}
                className="w-full py-2.5 border border-white/20 text-cavemen-softgrey hover:text-cavemen-offwhite text-xs uppercase tracking-wider transition-colors"
              >
                Return to Public Homepage
              </button>
            </div>

            <AuthModal
              isOpen={authModalOpen}
              onClose={() => setAuthModalOpen(false)}
              onSuccess={() => {}}
            />
          </div>
        </div>
      );
    }

    // Authorized Admin / Owner View
    return (
      <AdminDashboard onExit={handleNavigateLanding} />
    );
  }

  // -------------------------------------------------------------
  // PUBLIC HOMEPAGE VIEW
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-cavemen-black text-cavemen-offwhite flex flex-col selection:bg-cavemen-bronze selection:text-cavemen-black">
      
      {/* Navigation */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenAdmin={handleNavigateAdmin}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        
        {/* Section B: Hero Section */}
        <Hero
          onOpenBooking={() => handleOpenBooking()}
          content={cmsContent?.hero}
          businessSettings={businessSettings}
        />

        {/* Section C: Brand Introduction */}
        <BrandIntro
          onOpenBooking={() => handleOpenBooking()}
          content={cmsContent?.brand_intro}
        />

        {/* Section D: Services Preview */}
        <ServicesPreview
          onOpenBooking={handleOpenBooking}
          onOpenAllServices={handleOpenAllServices}
          content={cmsContent?.services_preview}
        />

        {/* Section E: Why Choose CAVEMEN? */}
        <WhyChooseUs
          content={cmsContent?.why_choose_us}
        />

        {/* Section F: Atmosphere / Visual Showcase */}
        <AtmosphereGallery
          content={cmsContent?.atmosphere}
        />

        {/* Section G: Booking CTA */}
        <BookingSection
          onOpenBooking={() => handleOpenBooking()}
          businessSettings={businessSettings}
        />

      </main>

      {/* Section H: Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenAdmin={handleNavigateAdmin}
        businessSettings={businessSettings}
      />

      {/* Modals */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preselectedService={selectedService}
      />

      <ServicesModal
        isOpen={servicesModalOpen}
        onClose={() => setServicesModalOpen(false)}
        onSelectServiceForBooking={handleOpenBooking}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {}}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
