# CAVEMEN — Premium Modern Men's Barbershop Homepage

A bespoke, editorial-style homepage built for **CAVEMEN**, a modern grooming destination for men who appreciate precision, personal style, and exceptional service.

> **Tagline:** *"More Than a Haircut. It's an Experience."*

---

## 🏛️ Brand Aesthetics & Design Direction

- **Palette:**
  - Rich Black: `#090909`
  - Deep Charcoal: `#151515`
  - Warm Off-White: `#F2F0EA`
  - Muted Bronze: `#A78355`
  - Soft Grey: `#9E9D99`
- **Typography:**
  - Editorial Headings: *Cinzel* & *Playfair Display*
  - Body & Micro-Copy: *Plus Jakarta Sans*
- **Visuals:**
  - Cinematic background video with motion toggle and dark luxury vignette
  - Atmospheric video showcase featuring the custom 3D CAVEMEN architectural mark
  - Curated high-resolution conceptual imagery representing craftsmanship, straight razors, steamed hot towels, and private lounge styling

---

## 📂 Project Architecture

```
cavemen-barbershop/
├── public/
│   ├── favicon.svg               # Minimalist bronze & steel monogram favicon
│   ├── images/                   # Curated high-resolution imagery (self-hosted)
│   └── videos/
│       ├── cavemen-hero.mp4      # Cinematic hero atmosphere loop
│       └── cavemen-atmosphere.mp4# Studio showcase video with CAVEMEN branding
├── src/
│   ├── config/
│   │   └── siteConfig.js         # Single-source config for WhatsApp, locations, & hours
│   ├── components/
│   │   ├── Navbar.jsx            # Sticky blurred header + slide-over mobile drawer
│   │   ├── Hero.jsx              # Full-screen video hero with CTAs & location pill
│   │   ├── BrandIntro.jsx        # Editorial 2-column philosophy & hallmarks
│   │   ├── ServicesPreview.jsx   # 4 core service cards with "Price available in-store"
│   │   ├── ServicesModal.jsx     # Comprehensive grooming menu modal
│   │   ├── WhyChooseUs.jsx       # 4 core principles: Precision, Professionalism, Comfort, Consistency
│   │   ├── AtmosphereGallery.jsx # Asymmetrical editorial grid + interactive lightbox
│   │   ├── BookingSection.jsx    # Distinctive booking CTA & WhatsApp concierge
│   │   ├── BookingModal.jsx      # Interactive appointment scheduling modal
│   │   └── Footer.jsx            # Wordmark, links, placeholders, & dynamic copyright
│   ├── App.jsx                   # Homepage orchestrator
│   ├── index.css                 # Custom scrollbars, luxury utilities & Tailwind directives
│   └── main.jsx                  # React 19 entry point
├── tailwind.config.js            # Custom CAVEMEN color tokens & typography
└── vite.config.js                # Vite build configuration
```

---

## ⚙️ How to Configure Business Details

All placeholder details (phone numbers, WhatsApp booking line, studio address, hours) can be updated in one single file:

`src/config/siteConfig.js`

```javascript
export const siteConfig = {
  // Configurable booking destination
  booking: {
    // Enter official WhatsApp number in international format, e.g. "254700000000"
    whatsappNumber: "254700000000",
    defaultBookingMessage: "Hello CAVEMEN, I would like to schedule a grooming appointment.",
  },

  contact: {
    address: "Westlands Square, 3rd Floor, Nairobi, Kenya",
    phone: "+254 700 000 000",
    email: "concierge@cavemengrooming.com",
    openingHours: {
      weekdays: "Monday – Friday: 08:00 AM – 08:00 PM",
      saturday: "Saturday: 09:00 AM – 07:00 PM",
      sunday: "Sunday: By Appointment Only",
    },
  },
  // ...
};
```

Once a `whatsappNumber` is provided, clicking **"Book Your Appointment"** automatically generates a formatted WhatsApp chat pre-filled with the client's selected service, date, and preferred time slot.

---

## 🚀 Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

4. **Preview Production Build:**
   ```bash
   npm run preview
   ```
