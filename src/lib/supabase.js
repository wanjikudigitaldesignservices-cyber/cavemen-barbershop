import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 'https://rdaudofnzkilnsyhtahk.supabase.co';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkYXVkb2ZuemtpbG5zeWh0YWhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3MDI0NTQsImV4cCI6MjEwOTI3ODQ1NH0.CKDkkp1SPHwy8dlizloDyNBQD-d2ThvuapOkJKvAviM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Fetch all active services ordered by display_order
 */
export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
  return data || [];
}

/**
 * Fetch all active staff / barbers
 */
export async function getStaff() {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('is_active', true)
    .order('full_name', { ascending: true });

  if (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
  return data || [];
}

/**
 * Fetch business settings
 */
export async function getBusinessSettings() {
  const { data, error } = await supabase
    .from('business_settings')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error('Error fetching business settings:', error);
    return null;
  }
  return data;
}

/**
 * Fetch business CMS content
 */
export async function getBusinessContent() {
  const { data, error } = await supabase
    .from('business_content')
    .select('*')
    .eq('is_published', true);

  if (error) {
    console.error('Error fetching content:', error);
    return {};
  }
  
  // Transform into map by section_key
  const contentMap = {};
  data?.forEach(item => {
    contentMap[item.section_key] = item;
  });
  return contentMap;
}

/**
 * Fetch available time slots calculated on the server
 */
export async function getAvailableSlots(date, serviceId, staffId = null) {
  const { data, error } = await supabase.rpc('get_available_slots', {
    p_date: date,
    p_service_id: serviceId,
    p_staff_id: staffId || null,
  });

  if (error) {
    console.error('Error calculating slots:', error);
    throw error;
  }
  return Array.isArray(data) ? data : [];
}

/**
 * Atomic Server-Side Booking Creation
 * Ensures zero double-bookings with PostgreSQL row locking
 */
export async function createBookingAtomic({
  serviceId,
  appointmentDate,
  startTime,
  customerName,
  customerEmail,
  customerPhone,
  customerNotes = '',
  staffId = null,
  customerId = null,
}) {
  const { data, error } = await supabase.rpc('create_booking_atomic', {
    p_service_id: serviceId,
    p_appointment_date: appointmentDate,
    p_start_time: startTime,
    p_customer_name: customerName,
    p_customer_email: customerEmail,
    p_customer_phone: customerPhone,
    p_customer_notes: customerNotes || null,
    p_staff_id: staffId || null,
    p_customer_id: customerId || null,
  });

  if (error) {
    console.error('Atomic booking error:', error);
    throw error;
  }

  return data;
}

/**
 * Fetch customer bookings
 */
export async function getCustomerBookings(userId) {
  if (!userId) return [];
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      service:services(name, duration_minutes, price),
      staff:staff(full_name, avatar_url)
    `)
    .eq('customer_id', userId)
    .order('appointment_date', { ascending: false });

  if (error) {
    console.error('Error fetching customer bookings:', error);
    throw error;
  }
  return data || [];
}

/**
 * Fetch all bookings for Admin CMS with optional filtering
 */
export async function getAllBookings({
  search = '',
  status = 'all',
  date = '',
  staffId = '',
  limit = 50,
  page = 1,
} = {}) {
  let query = supabase
    .from('bookings')
    .select(`
      *,
      service:services(name, duration_minutes, price),
      staff:staff(full_name, avatar_url)
    `, { count: 'exact' });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (date) {
    query = query.eq('appointment_date', date);
  }

  if (staffId && staffId !== 'all') {
    query = query.eq('staff_id', staffId);
  }

  if (search) {
    query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,booking_reference.ilike.%${search}%,customer_phone.ilike.%${search}%`);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.order('appointment_date', { ascending: false })
               .order('start_time', { ascending: false })
               .range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching admin bookings:', error);
    throw error;
  }

  return { bookings: data || [], totalCount: count || 0 };
}

/**
 * Update booking status
 */
export async function updateBookingStatus(bookingId, status, cancellationReason = null) {
  const updates = { status, updated_at: new Date().toISOString() };
  if (cancellationReason) {
    updates.cancellation_reason = cancellationReason;
  }

  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
  return data;
}

/**
 * Reschedule booking
 */
export async function rescheduleBooking(bookingId, newDate, newStartTime, serviceDurationMinutes) {
  // calculate end time
  const [hours, minutes] = newStartTime.split(':').map(Number);
  const totalMins = hours * 60 + minutes + serviceDurationMinutes;
  const endHours = Math.floor(totalMins / 60).toString().padStart(2, '0');
  const endMins = (totalMins % 60).toString().padStart(2, '0');
  const newEndTime = `${endHours}:${endMins}`;

  const { data, error } = await supabase
    .from('bookings')
    .update({
      appointment_date: newDate,
      start_time: newStartTime,
      end_time: newEndTime,
      status: 'confirmed',
      updated_at: new Date().toISOString()
    })
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error('Error rescheduling booking:', error);
    throw error;
  }
  return data;
}

/**
 * Fetch analytics metrics for Admin Dashboard
 */
export async function getAnalyticsMetrics() {
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      id,
      appointment_date,
      total_price,
      status,
      service_id,
      service:services(name),
      customer_email
    `);

  if (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }

  const total = bookings?.length || 0;
  const completed = bookings?.filter(b => b.status === 'completed') || [];
  const confirmed = bookings?.filter(b => b.status === 'confirmed') || [];
  const pending = bookings?.filter(b => b.status === 'pending') || [];
  const cancelled = bookings?.filter(b => b.status === 'cancelled') || [];
  const noShow = bookings?.filter(b => b.status === 'no_show') || [];

  const totalRevenue = completed.reduce((sum, b) => sum + Number(b.total_price || 0), 0);

  // Today's appointments (Africa/Nairobi date)
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings?.filter(b => b.appointment_date === todayStr) || [];

  // Services distribution
  const serviceCounts = {};
  bookings?.forEach(b => {
    const sName = b.service?.name || 'Other';
    serviceCounts[sName] = (serviceCounts[sName] || 0) + 1;
  });

  // Returning customers
  const emailCounts = {};
  bookings?.forEach(b => {
    if (b.customer_email) {
      emailCounts[b.customer_email] = (emailCounts[b.customer_email] || 0) + 1;
    }
  });
  const returningCustomers = Object.values(emailCounts).filter(c => c > 1).length;

  return {
    totalBookings: total,
    todayAppointments: todayBookings.length,
    pendingBookings: pending.length,
    confirmedBookings: confirmed.length,
    completedBookings: completed.length,
    cancelledBookings: cancelled.length,
    noShowBookings: noShow.length,
    totalRevenue,
    returningCustomers,
    completionRate: total > 0 ? Math.round((completed.length / total) * 100) : 0,
    cancellationRate: total > 0 ? Math.round((cancelled.length / total) * 100) : 0,
    serviceCounts,
    recentBookings: bookings?.slice(0, 8) || [],
  };
}

/**
 * Admin: Fetch all services (both active and inactive)
 */
export async function getAllServicesAdmin() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching admin services:', error);
    throw error;
  }
  return data || [];
}

/**
 * Admin: Create a new service
 */
export async function createService(serviceData) {
  const { data, error } = await supabase
    .from('services')
    .insert([serviceData])
    .select()
    .single();

  if (error) {
    console.error('Error creating service:', error);
    throw error;
  }
  return data;
}

/**
 * Admin: Update service
 */
export async function updateService(id, updates) {
  const { data, error } = await supabase
    .from('services')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating service:', error);
    throw error;
  }
  return data;
}

/**
 * Admin: Delete service
 */
export async function deleteService(id) {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
  return true;
}

/**
 * Admin: Fetch all staff (both active and inactive)
 */
export async function getAllStaffAdmin() {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('full_name', { ascending: true });

  if (error) {
    console.error('Error fetching admin staff:', error);
    throw error;
  }
  return data || [];
}

/**
 * Admin: Create staff member
 */
export async function createStaff(staffData) {
  const { data, error } = await supabase
    .from('staff')
    .insert([staffData])
    .select()
    .single();

  if (error) {
    console.error('Error creating staff:', error);
    throw error;
  }
  return data;
}

/**
 * Admin: Update staff member
 */
export async function updateStaff(id, updates) {
  const { data, error } = await supabase
    .from('staff')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating staff:', error);
    throw error;
  }
  return data;
}

/**
 * Admin: Delete staff member
 */
export async function deleteStaff(id) {
  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting staff:', error);
    throw error;
  }
  return true;
}

/**
 * Admin: Get all business content entries
 */
export async function getAllBusinessContentAdmin() {
  const { data, error } = await supabase
    .from('business_content')
    .select('*')
    .order('section_key', { ascending: true });

  if (error) {
    console.error('Error fetching all business content:', error);
    throw error;
  }
  return data || [];
}

/**
 * Admin: Update business CMS content
 */
export async function updateBusinessContent(sectionKey, updates) {
  const { data, error } = await supabase
    .from('business_content')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('section_key', sectionKey)
    .select()
    .single();

  if (error) {
    console.error('Error updating business content:', error);
    throw error;
  }
  return data;
}

/**
 * Admin: Update business settings
 */
export async function updateBusinessSettings(id, updates) {
  const { data, error } = await supabase
    .from('business_settings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating business settings:', error);
    throw error;
  }
  return data;
}

/**
 * Admin: Get email activity logs
 */
export async function getEmailLogs(limit = 50) {
  const { data, error } = await supabase
    .from('email_logs')
    .select(`
      *,
      booking:bookings(booking_reference, customer_name)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching email logs:', error);
    throw error;
  }
  return data || [];
}

/**
 * Admin: Get audit logs
 */
export async function getAuditLogs(limit = 50) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
  return data || [];
}

/**
 * Bootstrap owner account
 */
export async function bootstrapOwner(email, secretKey = 'CAVEMEN_INITIAL_OWNER_KEY_2026') {
  const { data, error } = await supabase.rpc('bootstrap_owner', {
    p_email: email,
    p_secret_key: secretKey,
  });

  if (error) {
    console.error('Error bootstrapping owner:', error);
    throw error;
  }
  return data;
}

/**
 * Invoke transactional email via Supabase Edge Function
 */
export async function triggerBookingEmail(bookingId, emailType = 'booking_confirmation') {
  const { data, error } = await supabase.functions.invoke('send-booking-email', {
    body: {
      booking_id: bookingId,
      email_type: emailType,
    },
  });

  if (error) {
    console.error('Edge function trigger error:', error);
    throw error;
  }
  return data;
}
