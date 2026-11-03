import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BrandIntro from './components/BrandIntro';
import ServicesPreview from './components/ServicesPreview';
import ServicesModal from './components/ServicesModal';
import WhyChooseUs from './components/WhyChooseUs';
import AtmosphereGallery from './components/AtmosphereGallery';
import BookingSection from './components/BookingSection';
import BookingModal from './components/BookingModal';
import Footer from './components/Footer';

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [servicesModalOpen, setServicesModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Classic Haircut');

  const handleOpenBooking = (serviceName = 'Classic Haircut') => {
    setSelectedService(serviceName);
    setBookingModalOpen(true);
  };

  const handleOpenAllServices = () => {
    setServicesModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-cavemen-black text-cavemen-offwhite flex flex-col selection:bg-cavemen-bronze selection:text-cavemen-black">
      
      {/* Navigation */}
      <Navbar onOpenBooking={() => handleOpenBooking()} />

      {/* Main Content Sections */}
      <main className="flex-1">
        
        {/* Section B: Hero Section */}
        <Hero onOpenBooking={() => handleOpenBooking()} />

        {/* Section C: Brand Introduction */}
        <BrandIntro onOpenBooking={() => handleOpenBooking()} />

        {/* Section D: Services Preview */}
        <ServicesPreview
          onOpenBooking={handleOpenBooking}
          onOpenAllServices={handleOpenAllServices}
        />

        {/* Section E: Why Choose CAVEMEN? */}
        <WhyChooseUs />

        {/* Section F: Atmosphere / Visual Showcase */}
        <AtmosphereGallery />

        {/* Section G: Booking CTA */}
        <BookingSection onOpenBooking={() => handleOpenBooking()} />

      </main>

      {/* Section H: Footer */}
      <Footer onOpenBooking={() => handleOpenBooking()} />

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

    </div>
  );
}
