/**
 * CAVEMEN Brand & Website Configuration
 * 
 * Central configuration file for all configurable business information,
 * placeholders, and booking destinations.
 * 
 * To update contact details when officially available:
 * - Set `whatsappNumber` to the official phone number (e.g., "+254700000000")
 * - Update `address`, `phone`, `email`, and `openingHours`
 */

export const siteConfig = {
  brand: {
    name: "CAVEMEN",
    tagline: "More Than a Haircut. It's an Experience.",
    shortDescription: "A modern grooming destination for men who appreciate precision, personal style and quality service.",
    established: "EST. 2026",
    personality: ["Masculine", "Sophisticated", "Confident", "Modern", "Professional"],
  },

  // Configurable booking destination
  booking: {
    // Leave null or empty string to use placeholder / in-store booking mode
    // Once provided, enter in international format without spaces, e.g. "254700000000"
    whatsappNumber: "", 
    defaultBookingMessage: "Hello CAVEMEN, I would like to schedule a grooming appointment.",
    placeholderNotice: "Official WhatsApp booking line will be activated shortly. You can submit your appointment request or visit our studio in person.",
  },

  // Contact details with clearly identifiable placeholders
  contact: {
    address: "[Studio Flagship Address — Nairobi / To be announced]",
    city: "Nairobi",
    phone: "[Phone Number to be announced]",
    email: "[Concierge Email to be announced]",
    openingHours: {
      weekdays: "Monday – Friday: [Hours to be announced]",
      saturday: "Saturday: [Hours to be announced]",
      sunday: "Sunday: [Hours to be announced]",
    },
  },

  // Social media placeholders
  socials: [
    { name: "Instagram", href: "#", placeholder: "@cavemen_grooming [Pending Official Launch]" },
    { name: "WhatsApp", href: "#", placeholder: "[WhatsApp Concierge — Coming Soon]" },
    { name: "TikTok", href: "#", placeholder: "@cavemen [Pending Official Launch]" },
    { name: "Facebook", href: "#", placeholder: "CAVEMEN Grooming [Pending Official Launch]" },
  ],

  // 4 Featured Services (exact specifications from brand brief)
  services: [
    {
      id: "classic-haircut",
      name: "Classic Haircut",
      description: "Clean cuts, sharp finishes and timeless style.",
      longDescription: "A bespoke haircut tailored to your personal aesthetic, bone structure, and lifestyle. Includes a personalized consultation, precision shear work, clean nape line, and styled finish with premium styling tonics.",
      duration: "45 mins",
      price: "Price available in-store",
      image: "/images/service-classic-cut.jpg",
      featured: true,
    },
    {
      id: "skin-fade",
      name: "Skin Fade",
      description: "Precision blending and detailed finishing.",
      longDescription: "Flawless gradient transitions from bare skin to desired length. Masterful clipper craftsmanship, razor-sharp edge detailing, and foil finish for a clean, enduring blend.",
      duration: "45 mins",
      price: "Price available in-store",
      image: "/images/service-skin-fade.jpg",
      featured: true,
    },
    {
      id: "beard-grooming",
      name: "Beard Grooming",
      description: "Expert shaping, trimming and definition.",
      longDescription: "Sculpted to frame your jawline with authority. Includes beard length consultation, contour trimming, hot towel infusion, straight razor cheek and neck alignment, finished with conditioning beard elixir.",
      duration: "30 mins",
      price: "Price available in-store",
      image: "/images/service-beard-grooming.jpg",
      featured: true,
    },
    {
      id: "complete-grooming",
      name: "Complete Grooming",
      description: "A combined haircut and beard grooming experience.",
      longDescription: "The definitive CAVEMEN signature ritual. Combines our precision haircut, complete beard sculpting or luxury straight razor shave, hot eucalyptus towel treatment, soothing scalp massage, and bespoke styling.",
      duration: "75 mins",
      price: "Price available in-store",
      image: "/images/service-complete-grooming.jpg",
      featured: true,
    },
  ],

  // Expanded menu for "VIEW ALL SERVICES" modal
  additionalServices: [
    {
      id: "traditional-hot-shave",
      name: "Traditional Hot Towel Shave",
      description: "Classic straight-razor shave with warm lather, hot steam towels and soothing cold balm.",
      duration: "40 mins",
      price: "Price available in-store",
    },
    {
      id: "scalp-treatment",
      name: "Revitalizing Scalp Treatment",
      description: "Deep cleansing scalp exfoliation, invigorating head massage and restorative organic oils.",
      duration: "30 mins",
      price: "Price available in-store",
    },
    {
      id: "beard-colour-enhancement",
      name: "Beard & Hair Enhancement",
      description: "Subtle natural grey blending and hairline definition for a fuller, sharp appearance.",
      duration: "35 mins",
      price: "Price available in-store",
    },
    {
      id: "father-son-duo",
      name: "Gentlemen's Duo",
      description: "Dual grooming appointments for friends, father & son, or colleagues in our private studio lounge.",
      duration: "90 mins",
      price: "Price available in-store",
    },
  ],

  // 4 Core Principles
  principles: [
    {
      number: "01",
      title: "Precision",
      description: "Attention to every detail.",
      elaboration: "From immaculate line-ups to calibrated scissor balance, every millimeter is cut with intentional discipline.",
    },
    {
      number: "02",
      title: "Professionalism",
      description: "A quality experience from start to finish.",
      elaboration: "Dedicated master barbers, punctual appointments, courteous hospitality, and unwavering craft etiquette.",
    },
    {
      number: "03",
      title: "Comfort",
      description: "A welcoming and well-considered grooming environment.",
      elaboration: "Custom leather barber chairs, warm ambient lighting, curated music, and a calm space free from rush.",
    },
    {
      number: "04",
      title: "Consistency",
      description: "A commitment to excellent service.",
      elaboration: "Your standard never fluctuates. Expect the identical caliber of craftsmanship and care at every single visit.",
    },
  ],

  // Atmosphere visuals (conceptual showcases)
  atmosphereGallery: [
    {
      id: "hero-video",
      title: "The Flagship Ambience",
      caption: "Cinematic architecture, bespoke leather seating, and warm amber illumination.",
      type: "video",
      src: "/videos/cavemen-atmosphere.mp4",
      poster: "/images/gallery-chair-lights.jpg",
      span: "col-span-12 md:col-span-8",
    },
    {
      id: "craft-instruments",
      title: "Tools of the Craft",
      caption: "Hand-honed straight razors and Japanese steel shears on matte slate.",
      type: "image",
      src: "/images/gallery-straight-razor.jpg",
      span: "col-span-12 md:col-span-4",
    },
    {
      id: "hot-towel-steam",
      title: "The Hot Towel Ritual",
      caption: "Steamed essential oil infusions to open pores and soften beard foliage.",
      type: "image",
      src: "/images/gallery-hot-towel.jpg",
      span: "col-span-12 md:col-span-4",
    },
    {
      id: "lounge-reflection",
      title: "Private Lounge & Barbershop",
      caption: "Where modern masculine style meets relaxed personal sanctuary.",
      type: "image",
      src: "/images/gallery-interior-lounge.jpg",
      span: "col-span-12 md:col-span-4",
    },
    {
      id: "artisan-barbering",
      title: "Scissor Craft & Tapering",
      caption: "Meticulous freehand technique tailored to natural growth patterns.",
      type: "image",
      src: "/images/gallery-styling-detail.jpg",
      span: "col-span-12 md:col-span-4",
    },
  ],
};
