-- ====================================================================
-- CAVEMEN PLATFORM COMPLETE SCHEMA, RLS, FUNCTIONS & SEED DATA
-- Database: PostgreSQL 17 / Supabase
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('customer', 'barber', 'manager', 'owner');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE email_delivery_status AS ENUM ('pending', 'sent', 'failed');

-- 2. HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. PROFILES
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- 4. SERVICES
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    long_description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);
CREATE INDEX idx_services_active_order ON public.services(is_active, display_order);

-- 5. STAFF
CREATE TABLE public.staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    specialties TEXT[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);
CREATE INDEX idx_staff_active ON public.staff(is_active);

-- 6. BOOKINGS
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    staff_id UUID REFERENCES public.staff(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
    status booking_status NOT NULL DEFAULT 'pending',
    customer_notes TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT check_start_before_end CHECK (start_time < end_time)
);
CREATE INDEX idx_bookings_date_status ON public.bookings(appointment_date, status);
CREATE INDEX idx_bookings_staff_date ON public.bookings(staff_id, appointment_date);
CREATE INDEX idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX idx_bookings_reference ON public.bookings(booking_reference);

-- 7. BUSINESS SETTINGS
CREATE TABLE public.business_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name TEXT NOT NULL DEFAULT 'CAVEMEN',
    tagline TEXT DEFAULT 'More Than a Haircut. It''s an Experience.',
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    whatsapp_number TEXT,
    timezone TEXT NOT NULL DEFAULT 'Africa/Nairobi',
    currency TEXT NOT NULL DEFAULT 'KES',
    opening_hours JSONB NOT NULL,
    booking_buffer_minutes INTEGER NOT NULL DEFAULT 15 CHECK (booking_buffer_minutes >= 0),
    advance_booking_days INTEGER NOT NULL DEFAULT 30 CHECK (advance_booking_days >= 1),
    cancellation_policy TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 8. BUSINESS CONTENT (CMS)
CREATE TABLE public.business_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT,
    content TEXT,
    image_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 9. TESTIMONIALS
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_title TEXT,
    testimonial TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 10. EMAIL & AUDIT LOGS
CREATE TABLE public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    recipient_email TEXT NOT NULL,
    email_type TEXT NOT NULL,
    provider_message_id TEXT,
    delivery_status email_delivery_status NOT NULL DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 11. RATE LIMITS
CREATE TABLE public.rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rate_key TEXT NOT NULL,
    action TEXT NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 1,
    window_start TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    CONSTRAINT rate_limits_unique_key_action UNIQUE(rate_key, action)
);

-- RLS & SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id UUID DEFAULT auth.uid())
RETURNS user_role AS $$
DECLARE
    v_role user_role;
BEGIN
    IF p_user_id IS NULL THEN RETURN NULL; END IF;
    SELECT role INTO v_role FROM public.profiles WHERE id = p_user_id;
    RETURN v_role;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin_or_owner()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.get_user_role() IN ('owner', 'manager');
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN public.get_user_role() = 'owner';
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- POLICIES
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin_or_owner());
CREATE POLICY "profiles_update_own_or_admin" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin_or_owner());
CREATE POLICY "services_select_active" ON public.services FOR SELECT USING (is_active = true OR public.is_admin_or_owner());
CREATE POLICY "services_admin_all" ON public.services FOR ALL USING (public.is_admin_or_owner());
CREATE POLICY "staff_select_active" ON public.staff FOR SELECT USING (is_active = true OR public.is_admin_or_owner());
CREATE POLICY "staff_admin_all" ON public.staff FOR ALL USING (public.is_admin_or_owner());
CREATE POLICY "bookings_select_own_or_staff_or_admin" ON public.bookings FOR SELECT USING (
    customer_id = auth.uid() OR staff_id IN (SELECT id FROM public.staff WHERE profile_id = auth.uid()) OR public.is_admin_or_owner()
);
CREATE POLICY "bookings_insert_public" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "bookings_update_staff_or_admin" ON public.bookings FOR UPDATE USING (
    public.is_admin_or_owner() OR staff_id IN (SELECT id FROM public.staff WHERE profile_id = auth.uid()) OR (customer_id = auth.uid() AND status = 'pending')
);
CREATE POLICY "business_settings_select_public" ON public.business_settings FOR SELECT USING (true);
CREATE POLICY "business_settings_update_admin" ON public.business_settings FOR ALL USING (public.is_admin_or_owner());
CREATE POLICY "business_content_select_public" ON public.business_content FOR SELECT USING (is_published = true OR public.is_admin_or_owner());
CREATE POLICY "business_content_admin_all" ON public.business_content FOR ALL USING (public.is_admin_or_owner());
CREATE POLICY "testimonials_select_published" ON public.testimonials FOR SELECT USING (is_published = true OR public.is_admin_or_owner());
CREATE POLICY "testimonials_insert_public" ON public.testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "testimonials_admin_all" ON public.testimonials FOR ALL USING (public.is_admin_or_owner());
CREATE POLICY "email_logs_admin_only" ON public.email_logs FOR ALL USING (public.is_admin_or_owner());
CREATE POLICY "audit_logs_admin_only" ON public.audit_logs FOR ALL USING (public.is_admin_or_owner());
CREATE POLICY "rate_limits_service_admin" ON public.rate_limits FOR ALL USING (true);
