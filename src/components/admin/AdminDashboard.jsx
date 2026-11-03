import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  Scissors,
  Users,
  FileEdit,
  Settings,
  Activity,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  AlertCircle,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Check,
  Calendar,
  DollarSign,
  TrendingUp,
  UserCheck,
  ChevronRight,
  Send,
  Loader2,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  getAllBookings,
  updateBookingStatus,
  rescheduleBooking,
  getAnalyticsMetrics,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
  getAllStaffAdmin,
  createStaff,
  updateStaff,
  deleteStaff,
  getAllBusinessContentAdmin,
  updateBusinessContent,
  getBusinessSettings,
  updateBusinessSettings,
  getEmailLogs,
  getAuditLogs,
  triggerBookingEmail,
  getAvailableSlots
} from '../../lib/supabase';

export default function AdminDashboard({ onExit }) {
  const { user, profile, isOwner, isManager, signOut } = useAuth();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('overview'); // overview, bookings, services, staff, cms, settings, logs

  // Global loading & alerts
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', message: '' }

  // 1. Overview state
  const [metrics, setMetrics] = useState(null);

  // 2. Bookings state
  const [bookings, setBookings] = useState([]);
  const [bookingFilterStatus, setBookingFilterStatus] = useState('all');
  const [bookingFilterStaff, setBookingFilterStaff] = useState('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  
  // Reschedule & Cancel Modal States
  const [rescheduleModal, setRescheduleModal] = useState({ open: false, booking: null, newDate: '', newTime: '', availableSlots: [] });
  const [cancelModal, setCancelModal] = useState({ open: false, booking: null, reason: '' });

  // 3. Services state
  const [servicesList, setServicesList] = useState([]);
  const [serviceModal, setServiceModal] = useState({ open: false, mode: 'create', data: null });

  // 4. Staff state
  const [staffList, setStaffList] = useState([]);
  const [staffModal, setStaffModal] = useState({ open: false, mode: 'create', data: null });

  // 5. CMS Content state
  const [cmsSections, setCmsSections] = useState([]);
  const [editingSection, setEditingSection] = useState(null);

  // 6. Settings state
  const [settingsData, setSettingsData] = useState(null);

  // 7. Logs state
  const [emailLogs, setEmailLogs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4500);
  };

  // Initial Data Fetching
  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const met = await getAnalyticsMetrics();
      setMetrics(met);
    } catch (err) {
      console.error(err);
      showAlert('Failed to load metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadBookingsData = async () => {
    try {
      setLoading(true);
      const res = await getAllBookings({
        search: bookingSearch,
        status: bookingFilterStatus,
        staffId: bookingFilterStaff,
        date: bookingDate,
      });
      setBookings(res.bookings);
    } catch (err) {
      console.error(err);
      showAlert('Failed to load bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadServicesData = async () => {
    try {
      setLoading(true);
      const data = await getAllServicesAdmin();
      setServicesList(data);
    } catch (err) {
      console.error(err);
      showAlert('Failed to load services', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStaffData = async () => {
    try {
      setLoading(true);
      const data = await getAllStaffAdmin();
      setStaffList(data);
    } catch (err) {
      console.error(err);
      showAlert('Failed to load staff list', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadCmsData = async () => {
    try {
      setLoading(true);
      const data = await getAllBusinessContentAdmin();
      setCmsSections(data);
    } catch (err) {
      console.error(err);
      showAlert('Failed to load CMS content', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadSettingsData = async () => {
    try {
      setLoading(true);
      const data = await getBusinessSettings();
      setSettingsData(data);
    } catch (err) {
      console.error(err);
      showAlert('Failed to load settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadLogsData = async () => {
    try {
      setLoading(true);
      const [eLogs, aLogs] = await Promise.all([
        getEmailLogs(40),
        getAuditLogs(40)
      ]);
      setEmailLogs(eLogs);
      setAuditLogs(aLogs);
    } catch (err) {
      console.error(err);
      showAlert('Failed to load system logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Switch tabs and load relevant dataset
  useEffect(() => {
    if (activeTab === 'overview') loadOverviewData();
    if (activeTab === 'bookings') {
      loadBookingsData();
      if (staffList.length === 0) loadStaffData();
    }
    if (activeTab === 'services') loadServicesData();
    if (activeTab === 'staff') loadStaffData();
    if (activeTab === 'cms') loadCmsData();
    if (activeTab === 'settings') loadSettingsData();
    if (activeTab === 'logs') loadLogsData();
  }, [activeTab]);

  // Handle Booking Status Update
  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      await updateBookingStatus(bookingId, newStatus);
      showAlert(`Booking marked as ${newStatus}`);
      
      // If confirmed or cancelled, trigger email notification asynchronously
      if (newStatus === 'confirmed' || newStatus === 'cancelled') {
        triggerBookingEmail(bookingId, 'status_update').catch(err => 
          console.warn('Email notification failed to send:', err)
        );
      }

      loadBookingsData();
      if (metrics) loadOverviewData();
    } catch (err) {
      console.error(err);
      showAlert(err.message || 'Error updating status', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Booking Cancellation Confirm
  const handleConfirmCancel = async () => {
    if (!cancelModal.booking) return;
    try {
      setLoading(true);
      await updateBookingStatus(cancelModal.booking.id, 'cancelled', cancelModal.reason);
      showAlert(`Booking ${cancelModal.booking.booking_reference} cancelled`);
      
      triggerBookingEmail(cancelModal.booking.id, 'status_update').catch(err => 
        console.warn('Cancel email notification failed to send:', err)
      );

      setCancelModal({ open: false, booking: null, reason: '' });
      loadBookingsData();
    } catch (err) {
      console.error(err);
      showAlert(err.message || 'Error cancelling appointment', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle Reschedule Fetch Slots
  const handleFetchRescheduleSlots = async (date) => {
    if (!rescheduleModal.booking || !date) return;
    try {
      const slots = await getAvailableSlots(
        date,
        rescheduleModal.booking.service_id,
        rescheduleModal.booking.staff_id
      );
      setRescheduleModal(prev => ({
        ...prev,
        newDate: date,
        availableSlots: slots,
        newTime: slots.length > 0 ? slots[0] : ''
      }));
    } catch (err) {
      console.error(err);
      showAlert('Could not load slots for this date', 'error');
    }
  };

  // Confirm Reschedule
  const handleConfirmReschedule = async () => {
    const { booking, newDate, newTime } = rescheduleModal;
    if (!booking || !newDate || !newTime) {
      showAlert('Please select both a date and an available slot', 'error');
      return;
    }

    try {
      setLoading(true);
      const duration = booking.service?.duration_minutes || 45;
      await rescheduleBooking(booking.id, newDate, newTime, duration);
      showAlert(`Booking successfully rescheduled to ${newDate} at ${newTime}`);
      
      triggerBookingEmail(booking.id, 'status_update').catch(err => 
        console.warn('Reschedule email notification failed to send:', err)
      );

      setRescheduleModal({ open: false, booking: null, newDate: '', newTime: '', availableSlots: [] });
      loadBookingsData();
    } catch (err) {
      console.error(err);
      showAlert(err.message || 'Failed to reschedule appointment', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Service CRUD operations
  const handleSaveService = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.serviceName.value,
      slug: form.serviceSlug.value,
      description: form.serviceDescription.value,
      price: parseFloat(form.servicePrice.value),
      duration_minutes: parseInt(form.serviceDuration.value, 10),
      image_url: form.serviceImageUrl.value,
      is_active: form.serviceIsActive.checked,
      display_order: parseInt(form.serviceDisplayOrder.value, 10) || 0,
    };

    try {
      setLoading(true);
      if (serviceModal.mode === 'create') {
        await createService(payload);
        showAlert('New service added successfully');
      } else {
        await updateService(serviceModal.data.id, payload);
        showAlert('Service updated successfully');
      }
      setServiceModal({ open: false, mode: 'create', data: null });
      loadServicesData();
    } catch (err) {
      console.error(err);
      showAlert(err.message || 'Error saving service', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId, serviceName) => {
    if (!window.confirm(`Are you sure you want to delete service "${serviceName}"?`)) return;
    try {
      setLoading(true);
      await deleteService(serviceId);
      showAlert('Service deleted');
      loadServicesData();
    } catch (err) {
      console.error(err);
      showAlert('Could not delete service. It may be referenced by existing bookings. Consider deactivating it instead.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Staff CRUD operations
  const handleSaveStaff = async (e) => {
    e.preventDefault();
    const form = e.target;
    const specialtiesArr = form.staffSpecialties.value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      full_name: form.staffFullName.value,
      bio: form.staffBio.value,
      avatar_url: form.staffAvatarUrl.value,
      specialties: specialtiesArr,
      is_active: form.staffIsActive.checked,
    };

    try {
      setLoading(true);
      if (staffModal.mode === 'create') {
        await createStaff(payload);
        showAlert('New master barber profile created');
      } else {
        await updateStaff(staffModal.data.id, payload);
        showAlert('Barber profile updated');
      }
      setStaffModal({ open: false, mode: 'create', data: null });
      loadStaffData();
    } catch (err) {
      console.error(err);
      showAlert(err.message || 'Error saving staff member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (staffId, staffName) => {
    if (!window.confirm(`Are you sure you want to delete barber "${staffName}"?`)) return;
    try {
      setLoading(true);
      await deleteStaff(staffId);
      showAlert('Barber profile deleted');
      loadStaffData();
    } catch (err) {
      console.error(err);
      showAlert('Cannot delete barber who has recorded bookings. Deactivate their status instead.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // CMS Content Save
  const handleSaveCmsSection = async (sectionKey, title, subtitle, content, isPublished) => {
    try {
      setLoading(true);
      await updateBusinessContent(sectionKey, {
        title,
        subtitle,
        content,
        is_published: isPublished,
      });
      showAlert(`CMS section "${sectionKey}" updated successfully`);
      loadCmsData();
    } catch (err) {
      console.error(err);
      showAlert(err.message || 'Error updating CMS content', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Settings Save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!settingsData) return;
    const form = e.target;

    const payload = {
      business_name: form.bizName.value,
      address: form.bizAddress.value,
      phone: form.bizPhone.value,
      email: form.bizEmail.value,
      whatsapp_number: form.bizWhatsapp.value,
      booking_buffer_minutes: parseInt(form.bizBuffer.value, 10),
      advance_booking_days: parseInt(form.bizAdvance.value, 10),
      cancellation_policy: form.bizPolicy.value,
    };

    try {
      setLoading(true);
      await updateBusinessSettings(settingsData.id, payload);
      showAlert('Business configuration saved successfully');
      loadSettingsData();
    } catch (err) {
      console.error(err);
      showAlert(err.message || 'Error saving settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cavemen-black text-cavemen-offwhite flex flex-col font-sans selection:bg-cavemen-bronze selection:text-cavemen-black">
      
      {/* Top Administrative Bar */}
      <header className="bg-cavemen-charcoal/90 border-b border-white/10 px-4 sm:px-8 py-3.5 sticky top-0 z-40 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 rounded border border-cavemen-bronze/60 flex items-center justify-center bg-cavemen-black text-cavemen-bronze font-cinzel font-bold text-sm">
            C
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-cinzel text-base sm:text-lg font-bold tracking-wider text-cavemen-offwhite uppercase">
                CAVEMEN Executive Concierge
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 border border-cavemen-bronze/40 bg-cavemen-bronze/10 text-cavemen-bronze rounded">
                {profile?.role === 'owner' ? 'Owner Portal' : 'Manager CMS'}
              </span>
            </div>
            <p className="text-[11px] text-cavemen-softgrey font-mono">
              Live Supabase DB: Connected • Timezone: Africa/Nairobi
            </p>
          </div>
        </div>

        {/* Right Admin Controls */}
        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={onExit}
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-white/20 hover:border-cavemen-bronze text-cavemen-softgrey hover:text-cavemen-offwhite transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cavemen-bronze" />
            <span>View Public Site</span>
          </button>

          <button
            onClick={async () => {
              await signOut();
              onExit();
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-red-300 transition-colors bg-red-950/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-cavemen-card border-r border-white/10 p-4 shrink-0 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
              Management Suite
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-medium tracking-wide transition-colors ${
                activeTab === 'overview'
                  ? 'bg-cavemen-bronze/20 text-cavemen-bronze border-l-2 border-cavemen-bronze'
                  : 'text-cavemen-softgrey hover:text-cavemen-offwhite hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Overview & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-medium tracking-wide transition-colors ${
                activeTab === 'bookings'
                  ? 'bg-cavemen-bronze/20 text-cavemen-bronze border-l-2 border-cavemen-bronze'
                  : 'text-cavemen-softgrey hover:text-cavemen-offwhite hover:bg-white/5'
              }`}
            >
              <CalendarCheck className="w-4 h-4 shrink-0" />
              <div className="flex-1 flex items-center justify-between">
                <span>Bookings</span>
                {metrics?.pendingBookings > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full">
                    {metrics.pendingBookings}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-medium tracking-wide transition-colors ${
                activeTab === 'services'
                  ? 'bg-cavemen-bronze/20 text-cavemen-bronze border-l-2 border-cavemen-bronze'
                  : 'text-cavemen-softgrey hover:text-cavemen-offwhite hover:bg-white/5'
              }`}
            >
              <Scissors className="w-4 h-4 shrink-0" />
              <span>Services Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab('staff')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-medium tracking-wide transition-colors ${
                activeTab === 'staff'
                  ? 'bg-cavemen-bronze/20 text-cavemen-bronze border-l-2 border-cavemen-bronze'
                  : 'text-cavemen-softgrey hover:text-cavemen-offwhite hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Master Barbers</span>
            </button>

            <button
              onClick={() => setActiveTab('cms')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-medium tracking-wide transition-colors ${
                activeTab === 'cms'
                  ? 'bg-cavemen-bronze/20 text-cavemen-bronze border-l-2 border-cavemen-bronze'
                  : 'text-cavemen-softgrey hover:text-cavemen-offwhite hover:bg-white/5'
              }`}
            >
              <FileEdit className="w-4 h-4 shrink-0" />
              <span>Website Content (CMS)</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-medium tracking-wide transition-colors ${
                activeTab === 'settings'
                  ? 'bg-cavemen-bronze/20 text-cavemen-bronze border-l-2 border-cavemen-bronze'
                  : 'text-cavemen-softgrey hover:text-cavemen-offwhite hover:bg-white/5'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Business Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-medium tracking-wide transition-colors ${
                activeTab === 'logs'
                  ? 'bg-cavemen-bronze/20 text-cavemen-bronze border-l-2 border-cavemen-bronze'
                  : 'text-cavemen-softgrey hover:text-cavemen-offwhite hover:bg-white/5'
              }`}
            >
              <Activity className="w-4 h-4 shrink-0" />
              <span>System & Email Logs</span>
            </button>
          </div>

          {/* User Profile Footer */}
          <div className="pt-6 border-t border-white/10 mt-6">
            <div className="flex items-center space-x-3 px-2">
              <div className="w-8 h-8 rounded-full border border-cavemen-bronze flex items-center justify-center bg-cavemen-black text-cavemen-bronze text-xs font-bold">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 truncate">
                <p className="text-xs font-semibold text-cavemen-offwhite truncate">
                  {profile?.full_name || 'Authenticated User'}
                </p>
                <p className="text-[10px] text-cavemen-softgrey truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          
          {/* Global Alert Notification */}
          {alert && (
            <div className={`mb-6 p-4 border flex items-center justify-between text-xs transition-all ${
              alert.type === 'error'
                ? 'bg-red-950/40 border-red-500/50 text-red-200'
                : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
            }`}>
              <div className="flex items-center space-x-2.5">
                {alert.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span>{alert.message}</span>
              </div>
              <button onClick={() => setAlert(null)} className="text-white/40 hover:text-white">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
                    Real-time Operations
                  </span>
                  <h2 className="font-cinzel text-2xl font-bold uppercase text-cavemen-offwhite">
                    Executive Dashboard
                  </h2>
                </div>
                <button
                  onClick={loadOverviewData}
                  disabled={loading}
                  className="inline-flex items-center space-x-2 px-3 py-2 border border-white/20 hover:border-cavemen-bronze text-xs font-medium text-cavemen-softgrey hover:text-cavemen-offwhite transition-colors self-start"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-cavemen-bronze ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh Metrics</span>
                </button>
              </div>

              {/* Top Key Performance Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-cavemen-card border border-white/10 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider text-cavemen-softgrey font-medium">Total Appointments</span>
                    <Calendar className="w-4 h-4 text-cavemen-bronze" />
                  </div>
                  <div className="text-3xl font-bold text-cavemen-offwhite font-cinzel">
                    {metrics ? metrics.totalBookings : '—'}
                  </div>
                  <div className="mt-2 text-[11px] text-cavemen-softgrey flex items-center space-x-1">
                    <span className="text-cavemen-bronze font-semibold">{metrics?.todayAppointments || 0}</span>
                    <span>scheduled for today</span>
                  </div>
                </div>

                <div className="p-5 bg-cavemen-card border border-white/10 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider text-cavemen-softgrey font-medium">Verified Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-bold text-cavemen-offwhite font-cinzel">
                    {metrics ? `KES ${metrics.totalRevenue.toLocaleString()}` : '—'}
                  </div>
                  <div className="mt-2 text-[11px] text-cavemen-softgrey">
                    Completed appointments value
                  </div>
                </div>

                <div className="p-5 bg-cavemen-card border border-white/10 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider text-cavemen-softgrey font-medium">Appointment Status</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-cavemen-offwhite font-cinzel">
                      {metrics ? metrics.confirmedBookings : '—'}
                    </span>
                    <span className="text-xs text-cavemen-softgrey">confirmed</span>
                  </div>
                  <div className="mt-2 text-[11px] text-amber-300">
                    {metrics?.pendingBookings || 0} pending review
                  </div>
                </div>

                <div className="p-5 bg-cavemen-card border border-white/10 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider text-cavemen-softgrey font-medium">Client Loyalty</span>
                    <UserCheck className="w-4 h-4 text-cavemen-bronze" />
                  </div>
                  <div className="text-3xl font-bold text-cavemen-offwhite font-cinzel">
                    {metrics ? metrics.returningCustomers : '—'}
                  </div>
                  <div className="mt-2 text-[11px] text-cavemen-softgrey">
                    Repeat guests with 2+ bookings
                  </div>
                </div>
              </div>

              {/* Services Popularity & Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 bg-cavemen-card border border-white/10">
                  <h3 className="font-cinzel text-base font-bold uppercase text-cavemen-offwhite mb-4 flex items-center justify-between">
                    <span>Popular Services Requested</span>
                    <TrendingUp className="w-4 h-4 text-cavemen-bronze" />
                  </h3>

                  {metrics?.serviceCounts && Object.keys(metrics.serviceCounts).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(metrics.serviceCounts).map(([svcName, count]) => {
                        const pct = metrics.totalBookings > 0 ? Math.round((count / metrics.totalBookings) * 100) : 0;
                        return (
                          <div key={svcName} className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="font-medium text-cavemen-offwhite">{svcName}</span>
                              <span className="text-cavemen-softgrey">{count} bookings ({pct}%)</span>
                            </div>
                            <div className="h-1.5 w-full bg-cavemen-black rounded overflow-hidden">
                              <div
                                className="h-full bg-cavemen-bronze transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-cavemen-softgrey py-6 text-center">
                      No service data recorded yet.
                    </p>
                  )}
                </div>

                <div className="p-6 bg-cavemen-card border border-white/10 flex flex-col justify-between">
                  <div>
                    <h3 className="font-cinzel text-base font-bold uppercase text-cavemen-offwhite mb-4">
                      Operational Health
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-cavemen-softgrey">Completion Rate</span>
                        <span className="font-semibold text-emerald-400">{metrics?.completionRate || 0}%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-cavemen-softgrey">Cancellation Rate</span>
                        <span className="font-semibold text-red-400">{metrics?.cancellationRate || 0}%</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="text-cavemen-softgrey">No Shows Recorded</span>
                        <span className="font-semibold text-amber-400">{metrics?.noShowBookings || 0}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-cavemen-softgrey">Concurrency Engine</span>
                        <span className="text-emerald-400 font-mono text-[10px]">Zero-Conflict (Active)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="w-full mt-6 py-2.5 bg-cavemen-bronze/10 border border-cavemen-bronze text-cavemen-bronze hover:bg-cavemen-bronze hover:text-cavemen-black font-semibold text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <span>Manage Bookings</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: BOOKINGS MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
                    Concierge Schedule
                  </span>
                  <h2 className="font-cinzel text-2xl font-bold uppercase text-cavemen-offwhite">
                    Appointments Management
                  </h2>
                </div>
                <button
                  onClick={loadBookingsData}
                  disabled={loading}
                  className="inline-flex items-center space-x-2 px-3 py-2 border border-white/20 hover:border-cavemen-bronze text-xs font-medium text-cavemen-softgrey hover:text-cavemen-offwhite transition-colors self-start"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-cavemen-bronze ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Filters Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-cavemen-card p-4 border border-white/10">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-cavemen-softgrey" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadBookingsData()}
                    placeholder="Search name, ref, phone..."
                    className="w-full bg-cavemen-black border border-white/10 pl-9 pr-3 py-2 text-xs text-cavemen-offwhite placeholder-white/20 focus:border-cavemen-bronze focus:outline-none"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={bookingFilterStatus}
                  onChange={(e) => {
                    setBookingFilterStatus(e.target.value);
                  }}
                  className="bg-cavemen-black border border-white/10 px-3 py-2 text-xs text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No Show</option>
                </select>

                {/* Barber Filter */}
                <select
                  value={bookingFilterStaff}
                  onChange={(e) => setBookingFilterStaff(e.target.value)}
                  className="bg-cavemen-black border border-white/10 px-3 py-2 text-xs text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                >
                  <option value="all">All Barbers</option>
                  {staffList.map((stf) => (
                    <option key={stf.id} value={stf.id}>
                      {stf.full_name}
                    </option>
                  ))}
                </select>

                {/* Date Filter */}
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="bg-cavemen-black border border-white/10 px-3 py-2 text-xs text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                />
              </div>

              {/* Bookings Table */}
              <div className="border border-white/10 overflow-x-auto bg-cavemen-card">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cavemen-black border-b border-white/10 uppercase tracking-wider text-[10px] text-cavemen-softgrey font-mono">
                    <tr>
                      <th className="p-3.5">Reference</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Service & Barber</th>
                      <th className="p-3.5">Date & Time</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.length > 0 ? (
                      bookings.map((b) => {
                        return (
                          <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                            {/* Reference */}
                            <td className="p-3.5">
                              <span className="font-mono text-cavemen-bronze font-bold">
                                {b.booking_reference}
                              </span>
                            </td>

                            {/* Customer */}
                            <td className="p-3.5">
                              <div className="font-medium text-cavemen-offwhite">{b.customer_name}</div>
                              <div className="text-[11px] text-cavemen-softgrey font-mono">{b.customer_phone}</div>
                              <div className="text-[10px] text-white/40 truncate max-w-[160px]">{b.customer_email}</div>
                              {b.customer_notes && (
                                <div className="text-[10px] text-cavemen-bronze/90 italic mt-0.5 max-w-[180px]">
                                  Note: "{b.customer_notes}"
                                </div>
                              )}
                            </td>

                            {/* Service & Staff */}
                            <td className="p-3.5">
                              <div className="font-semibold text-cavemen-offwhite">
                                {b.service?.name || 'Service'}
                              </div>
                              <div className="text-[11px] text-cavemen-softgrey">
                                {b.staff?.full_name || 'Assigned Barber'}
                              </div>
                            </td>

                            {/* Date & Time */}
                            <td className="p-3.5 font-mono">
                              <div className="text-cavemen-offwhite">{b.appointment_date}</div>
                              <div className="text-cavemen-softgrey text-[11px]">
                                {b.start_time.slice(0, 5)} - {b.end_time.slice(0, 5)}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="p-3.5">
                              <span className={`inline-flex px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                                b.status === 'confirmed'
                                  ? 'bg-blue-950/60 text-blue-400 border border-blue-500/40'
                                  : b.status === 'completed'
                                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                                  : b.status === 'pending'
                                  ? 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
                                  : b.status === 'cancelled'
                                  ? 'bg-red-950/60 text-red-400 border border-red-500/40'
                                  : 'bg-purple-950/60 text-purple-400 border border-purple-500/40'
                              }`}>
                                {b.status}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="p-3.5 font-mono font-semibold text-cavemen-offwhite">
                              KES {b.total_price ? Number(b.total_price).toLocaleString() : '0'}
                            </td>

                            {/* Actions */}
                            <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                              {b.status === 'pending' && (
                                <button
                                  onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                                  title="Confirm Appointment"
                                  className="px-2 py-1 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors rounded"
                                >
                                  Confirm
                                </button>
                              )}

                              {b.status === 'confirmed' && (
                                <button
                                  onClick={() => handleUpdateStatus(b.id, 'completed')}
                                  title="Mark as Completed"
                                  className="px-2 py-1 bg-blue-950/40 border border-blue-500/40 text-blue-400 hover:bg-blue-500 hover:text-black transition-colors rounded"
                                >
                                  Complete
                                </button>
                              )}

                              {b.status !== 'cancelled' && b.status !== 'completed' && (
                                <>
                                  <button
                                    onClick={() => {
                                      setRescheduleModal({
                                        open: true,
                                        booking: b,
                                        newDate: b.appointment_date,
                                        newTime: b.start_time.slice(0, 5),
                                        availableSlots: []
                                      });
                                      handleFetchRescheduleSlots(b.appointment_date);
                                    }}
                                    title="Reschedule"
                                    className="px-2 py-1 bg-cavemen-black border border-white/20 text-cavemen-softgrey hover:border-cavemen-bronze hover:text-cavemen-offwhite transition-colors rounded"
                                  >
                                    Reschedule
                                  </button>

                                  <button
                                    onClick={() => setCancelModal({ open: true, booking: b, reason: '' })}
                                    title="Cancel"
                                    className="px-2 py-1 bg-red-950/30 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-colors rounded"
                                  >
                                    Cancel
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-cavemen-softgrey font-mono">
                          No matching appointments found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: SERVICES CATALOG */}
          {/* ========================================================= */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
                    Offerings Management
                  </span>
                  <h2 className="font-cinzel text-2xl font-bold uppercase text-cavemen-offwhite">
                    Services Catalog
                  </h2>
                </div>
                <button
                  onClick={() => setServiceModal({ open: true, mode: 'create', data: null })}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-cavemen-bronze text-cavemen-black font-semibold text-xs uppercase tracking-widest hover:bg-cavemen-bronzeLight transition-colors self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Service</span>
                </button>
              </div>

              {/* Services Table */}
              <div className="border border-white/10 overflow-x-auto bg-cavemen-card">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cavemen-black border-b border-white/10 uppercase tracking-wider text-[10px] text-cavemen-softgrey font-mono">
                    <tr>
                      <th className="p-3.5">Order</th>
                      <th className="p-3.5">Service Name</th>
                      <th className="p-3.5">Duration</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {servicesList.map((s) => (
                      <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-3.5 font-mono text-cavemen-softgrey">{s.display_order}</td>
                        <td className="p-3.5">
                          <div className="font-semibold text-cavemen-offwhite">{s.name}</div>
                          <div className="text-[11px] text-cavemen-softgrey max-w-sm truncate">{s.description}</div>
                        </td>
                        <td className="p-3.5 font-mono text-cavemen-softgrey">{s.duration_minutes} mins</td>
                        <td className="p-3.5 font-mono font-semibold text-cavemen-bronze">
                          KES {Number(s.price).toLocaleString()}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
                            s.is_active
                              ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-950/50 text-red-400 border border-red-500/30'
                          }`}>
                            {s.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => setServiceModal({ open: true, mode: 'edit', data: s })}
                            className="p-1.5 text-cavemen-softgrey hover:text-cavemen-bronze transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(s.id, s.name)}
                            className="p-1.5 text-cavemen-softgrey hover:text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: MASTER BARBERS */}
          {/* ========================================================= */}
          {activeTab === 'staff' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
                    Artisans & Stylists
                  </span>
                  <h2 className="font-cinzel text-2xl font-bold uppercase text-cavemen-offwhite">
                    Master Barbers
                  </h2>
                </div>
                <button
                  onClick={() => setStaffModal({ open: true, mode: 'create', data: null })}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-cavemen-bronze text-cavemen-black font-semibold text-xs uppercase tracking-widest hover:bg-cavemen-bronzeLight transition-colors self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Barber</span>
                </button>
              </div>

              {/* Staff Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffList.map((stf) => (
                  <div key={stf.id} className="bg-cavemen-card border border-white/10 p-5 space-y-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={stf.avatar_url || '/images/gallery-craft-tools.jpg'}
                        alt={stf.full_name}
                        className="w-14 h-14 object-cover border border-cavemen-bronze/40 shrink-0"
                      />
                      <div className="flex-1 truncate">
                        <h3 className="font-cinzel text-base font-bold text-cavemen-offwhite truncate">
                          {stf.full_name}
                        </h3>
                        <span className={`inline-block mt-1 px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest ${
                          stf.is_active ? 'text-emerald-400 bg-emerald-950/40' : 'text-red-400 bg-red-950/40'
                        }`}>
                          {stf.is_active ? 'Active on Roster' : 'Inactive'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-cavemen-softgrey line-clamp-3">
                      {stf.bio || 'Master craftsman dedicated to bespoke grooming.'}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {stf.specialties?.map((spec, i) => (
                        <span key={i} className="px-2 py-0.5 bg-cavemen-black border border-white/10 text-[10px] text-cavemen-softgrey font-mono">
                          {spec}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-end space-x-2 text-xs">
                      <button
                        onClick={() => setStaffModal({ open: true, mode: 'edit', data: stf })}
                        className="px-3 py-1 bg-cavemen-black border border-white/20 text-cavemen-softgrey hover:text-cavemen-offwhite hover:border-cavemen-bronze transition-colors"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(stf.id, stf.full_name)}
                        className="p-1 text-cavemen-softgrey hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: WEBSITE CONTENT (CMS) */}
          {/* ========================================================= */}
          {activeTab === 'cms' && (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-5">
                <span className="text-[10px] uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
                  Content Management Engine
                </span>
                <h2 className="font-cinzel text-2xl font-bold uppercase text-cavemen-offwhite">
                  Live Homepage Content
                </h2>
                <p className="text-xs text-cavemen-softgrey mt-1">
                  Updates saved here will instantly reflect on the public CAVEMEN homepage.
                </p>
              </div>

              <div className="space-y-6">
                {cmsSections.map((sec) => (
                  <div key={sec.id} className="bg-cavemen-card border border-white/10 p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-cavemen-bronze">
                          Section Key: {sec.section_key}
                        </span>
                        <h3 className="font-cinzel text-base font-bold text-cavemen-offwhite">
                          {sec.title}
                        </h3>
                      </div>
                      <span className={`px-2 py-0.5 text-[9px] uppercase font-bold tracking-widest ${
                        sec.is_published ? 'text-emerald-400 bg-emerald-950/40' : 'text-amber-400 bg-amber-950/40'
                      }`}>
                        {sec.is_published ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const f = e.target;
                        handleSaveCmsSection(
                          sec.section_key,
                          f.secTitle.value,
                          f.secSubtitle.value,
                          f.secContent.value,
                          f.secPublished.checked
                        );
                      }}
                      className="space-y-4 text-xs"
                    >
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-cavemen-softgrey mb-1">
                          Heading / Title
                        </label>
                        <input
                          type="text"
                          name="secTitle"
                          defaultValue={sec.title || ''}
                          className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-cavemen-softgrey mb-1">
                          Subtitle / Tagline
                        </label>
                        <input
                          type="text"
                          name="secSubtitle"
                          defaultValue={sec.subtitle || ''}
                          className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-cavemen-softgrey mb-1">
                          Body Copy / Description
                        </label>
                        <textarea
                          name="secContent"
                          rows={3}
                          defaultValue={sec.content || ''}
                          className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center space-x-2 cursor-pointer text-cavemen-softgrey">
                          <input
                            type="checkbox"
                            name="secPublished"
                            defaultChecked={sec.is_published}
                            className="rounded border-white/20 bg-cavemen-black text-cavemen-bronze focus:ring-0"
                          />
                          <span>Visible on Public Website</span>
                        </label>

                        <button
                          type="submit"
                          disabled={loading}
                          className="px-4 py-2 bg-cavemen-bronze text-cavemen-black font-semibold text-xs uppercase tracking-widest hover:bg-cavemen-bronzeLight transition-colors"
                        >
                          Save Section
                        </button>
                      </div>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: BUSINESS SETTINGS */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div className="border-b border-white/10 pb-5">
                <span className="text-[10px] uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
                  Global Configuration
                </span>
                <h2 className="font-cinzel text-2xl font-bold uppercase text-cavemen-offwhite">
                  Business Settings
                </h2>
                <p className="text-xs text-cavemen-softgrey mt-1">
                  Manage contact details, booking lead time, buffer windows, and operating hours.
                </p>
              </div>

              {settingsData && (
                <form onSubmit={handleSaveSettings} className="bg-cavemen-card border border-white/10 p-6 space-y-5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-cavemen-softgrey mb-1 font-medium">
                        Business Name
                      </label>
                      <input
                        type="text"
                        name="bizName"
                        defaultValue={settingsData.business_name}
                        className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-cavemen-softgrey mb-1 font-medium">
                        Physical Address
                      </label>
                      <input
                        type="text"
                        name="bizAddress"
                        defaultValue={settingsData.address}
                        className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-cavemen-softgrey mb-1 font-medium">
                        Direct Phone Number
                      </label>
                      <input
                        type="text"
                        name="bizPhone"
                        defaultValue={settingsData.phone}
                        className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-cavemen-softgrey mb-1 font-medium">
                        WhatsApp Booking Line
                      </label>
                      <input
                        type="text"
                        name="bizWhatsapp"
                        defaultValue={settingsData.whatsapp_number}
                        className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-cavemen-softgrey mb-1 font-medium">
                        Official Concierge Email
                      </label>
                      <input
                        type="email"
                        name="bizEmail"
                        defaultValue={settingsData.email}
                        className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-cavemen-softgrey mb-1 font-medium">
                        Booking Buffer (Minutes between appointments)
                      </label>
                      <input
                        type="number"
                        name="bizBuffer"
                        defaultValue={settingsData.booking_buffer_minutes}
                        className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-cavemen-softgrey mb-1 font-medium">
                        Max Advance Booking Window (Days)
                      </label>
                      <input
                        type="number"
                        name="bizAdvance"
                        defaultValue={settingsData.advance_booking_days}
                        className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-cavemen-softgrey mb-1 font-medium">
                      Cancellation Policy Notice
                    </label>
                    <textarea
                      name="bizPolicy"
                      rows={2}
                      defaultValue={settingsData.cancellation_policy}
                      className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-cavemen-bronze text-cavemen-black font-semibold text-xs uppercase tracking-widest hover:bg-cavemen-bronzeLight transition-colors"
                    >
                      Save Business Settings
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: SYSTEM & EMAIL LOGS */}
          {/* ========================================================= */}
          {activeTab === 'logs' && (
            <div className="space-y-8">
              <div className="border-b border-white/10 pb-5">
                <span className="text-[10px] uppercase tracking-[0.25em] text-cavemen-bronze font-semibold">
                  Transparency & Auditing
                </span>
                <h2 className="font-cinzel text-2xl font-bold uppercase text-cavemen-offwhite">
                  System & Email Logs
                </h2>
              </div>

              {/* Email Activity Log */}
              <div className="space-y-3">
                <h3 className="font-cinzel text-sm font-bold uppercase text-cavemen-offwhite flex items-center space-x-2">
                  <Send className="w-4 h-4 text-cavemen-bronze" />
                  <span>Transactional Resend Delivery History</span>
                </h3>
                <div className="border border-white/10 overflow-x-auto bg-cavemen-card">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-cavemen-black border-b border-white/10 uppercase tracking-wider text-[10px] text-cavemen-softgrey font-mono">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Recipient</th>
                        <th className="p-3">Template Type</th>
                        <th className="p-3">Booking Ref</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                      {emailLogs.length > 0 ? (
                        emailLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-white/[0.02]">
                            <td className="p-3 text-cavemen-softgrey">{new Date(log.created_at).toLocaleString()}</td>
                            <td className="p-3 text-cavemen-offwhite">{log.recipient_email}</td>
                            <td className="p-3 text-cavemen-bronze">{log.email_type}</td>
                            <td className="p-3">{log.booking?.booking_reference || '—'}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                log.delivery_status === 'sent' ? 'text-emerald-400 bg-emerald-950/40' : 'text-red-400 bg-red-950/40'
                              }`}>
                                {log.delivery_status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-cavemen-softgrey">
                            No email activity recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Security Audit Trail */}
              <div className="space-y-3">
                <h3 className="font-cinzel text-sm font-bold uppercase text-cavemen-offwhite flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-cavemen-bronze" />
                  <span>Administrative Security Audit Log</span>
                </h3>
                <div className="border border-white/10 overflow-x-auto bg-cavemen-card">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-cavemen-black border-b border-white/10 uppercase tracking-wider text-[10px] text-cavemen-softgrey font-mono">
                      <tr>
                        <th className="p-3">Timestamp</th>
                        <th className="p-3">Action</th>
                        <th className="p-3">Entity Type</th>
                        <th className="p-3">Entity ID</th>
                        <th className="p-3">Metadata</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                      {auditLogs.length > 0 ? (
                        auditLogs.map((a) => (
                          <tr key={a.id} className="hover:bg-white/[0.02]">
                            <td className="p-3 text-cavemen-softgrey">{new Date(a.created_at).toLocaleString()}</td>
                            <td className="p-3 text-cavemen-bronze">{a.action}</td>
                            <td className="p-3 text-cavemen-offwhite">{a.entity_type}</td>
                            <td className="p-3 text-cavemen-softgrey truncate max-w-[120px]">{a.entity_id}</td>
                            <td className="p-3 text-[10px] text-white/40 truncate max-w-[200px]">
                              {JSON.stringify(a.metadata || {})}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-cavemen-softgrey">
                            No security audit records logged.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ========================================================= */}
      {/* MODAL: RESCHEDULE BOOKING */}
      {/* ========================================================= */}
      {rescheduleModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setRescheduleModal({ open: false, booking: null, newDate: '', newTime: '', availableSlots: [] })}
            className="fixed inset-0 bg-cavemen-black/85 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-md bg-cavemen-card border border-cavemen-bronze/50 p-6 space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-cavemen-offwhite uppercase">
              Reschedule Appointment
            </h3>
            <p className="text-xs text-cavemen-softgrey">
              Select a new date and available time slot for{' '}
              <strong className="text-cavemen-offwhite">{rescheduleModal.booking?.customer_name}</strong> ({rescheduleModal.booking?.booking_reference}).
            </p>

            <div>
              <label className="block text-xs uppercase text-cavemen-softgrey mb-1">New Date</label>
              <input
                type="date"
                value={rescheduleModal.newDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleFetchRescheduleSlots(e.target.value)}
                className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-xs text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-cavemen-softgrey mb-1">Available Slots</label>
              {rescheduleModal.availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
                  {rescheduleModal.availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setRescheduleModal(prev => ({ ...prev, newTime: slot }))}
                      className={`p-2 text-xs font-mono border transition-all ${
                        rescheduleModal.newTime === slot
                          ? 'border-cavemen-bronze bg-cavemen-bronze text-cavemen-black font-bold'
                          : 'border-white/10 bg-cavemen-black text-cavemen-offwhite hover:border-white/30'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-cavemen-softgrey py-3 italic">
                  No slots available on this date or date not selected yet.
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setRescheduleModal({ open: false, booking: null, newDate: '', newTime: '', availableSlots: [] })}
                className="px-4 py-2 border border-white/20 text-xs text-cavemen-softgrey hover:text-cavemen-offwhite"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReschedule}
                disabled={!rescheduleModal.newTime}
                className="px-4 py-2 bg-cavemen-bronze text-cavemen-black text-xs font-semibold uppercase tracking-wider hover:bg-cavemen-bronzeLight disabled:opacity-40"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CANCEL BOOKING WITH REASON */}
      {/* ========================================================= */}
      {cancelModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setCancelModal({ open: false, booking: null, reason: '' })}
            className="fixed inset-0 bg-cavemen-black/85 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-md bg-cavemen-card border border-red-500/40 p-6 space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-red-400 uppercase">
              Cancel Appointment
            </h3>
            <p className="text-xs text-cavemen-softgrey">
              Are you sure you want to cancel booking{' '}
              <strong className="text-cavemen-offwhite">{cancelModal.booking?.booking_reference}</strong>? An automated cancellation email will be delivered to the client.
            </p>

            <div>
              <label className="block text-xs uppercase text-cavemen-softgrey mb-1">
                Reason for Cancellation
              </label>
              <textarea
                rows={3}
                value={cancelModal.reason}
                onChange={(e) => setCancelModal(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="e.g., Client requested cancellation via phone..."
                className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-xs text-cavemen-offwhite focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setCancelModal({ open: false, booking: null, reason: '' })}
                className="px-4 py-2 border border-white/20 text-xs text-cavemen-softgrey hover:text-cavemen-offwhite"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-600 text-white text-xs font-semibold uppercase tracking-wider hover:bg-red-500"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT SERVICE */}
      {/* ========================================================= */}
      {serviceModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setServiceModal({ open: false, mode: 'create', data: null })}
            className="fixed inset-0 bg-cavemen-black/85 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-lg bg-cavemen-card border border-cavemen-bronze/40 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-cinzel text-lg font-bold text-cavemen-offwhite uppercase">
              {serviceModal.mode === 'create' ? 'Add New Service' : 'Edit Service'}
            </h3>

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-cavemen-softgrey mb-1 uppercase tracking-wider">Service Name</label>
                  <input
                    type="text"
                    name="serviceName"
                    required
                    defaultValue={serviceModal.data?.name || ''}
                    placeholder="e.g. Royal Shave"
                    className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-cavemen-softgrey mb-1 uppercase tracking-wider">Slug</label>
                  <input
                    type="text"
                    name="serviceSlug"
                    required
                    defaultValue={serviceModal.data?.slug || ''}
                    placeholder="royal-shave"
                    className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-cavemen-softgrey mb-1 uppercase tracking-wider">Description</label>
                <textarea
                  name="serviceDescription"
                  rows={2}
                  defaultValue={serviceModal.data?.description || ''}
                  className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-cavemen-softgrey mb-1 uppercase tracking-wider">Price (KES)</label>
                  <input
                    type="number"
                    name="servicePrice"
                    required
                    defaultValue={serviceModal.data?.price || 2000}
                    className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-cavemen-softgrey mb-1 uppercase tracking-wider">Duration (Min)</label>
                  <input
                    type="number"
                    name="serviceDuration"
                    required
                    defaultValue={serviceModal.data?.duration_minutes || 45}
                    className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-cavemen-softgrey mb-1 uppercase tracking-wider">Display Order</label>
                  <input
                    type="number"
                    name="serviceDisplayOrder"
                    defaultValue={serviceModal.data?.display_order || 1}
                    className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-cavemen-softgrey mb-1 uppercase tracking-wider">Image URL</label>
                <input
                  type="text"
                  name="serviceImageUrl"
                  defaultValue={serviceModal.data?.image_url || '/images/gallery-craft-tools.jpg'}
                  className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="serviceIsActive"
                  id="serviceIsActive"
                  defaultChecked={serviceModal.data ? serviceModal.data.is_active : true}
                  className="rounded border-white/20 bg-cavemen-black text-cavemen-bronze focus:ring-0"
                />
                <label htmlFor="serviceIsActive" className="text-cavemen-offwhite">
                  Active (available for bookings)
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setServiceModal({ open: false, mode: 'create', data: null })}
                  className="px-4 py-2 border border-white/20 text-xs text-cavemen-softgrey hover:text-cavemen-offwhite"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-cavemen-bronze text-cavemen-black text-xs font-semibold uppercase tracking-wider hover:bg-cavemen-bronzeLight"
                >
                  {serviceModal.mode === 'create' ? 'Create Service' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT MASTER BARBER */}
      {/* ========================================================= */}
      {staffModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setStaffModal({ open: false, mode: 'create', data: null })}
            className="fixed inset-0 bg-cavemen-black/85 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-md bg-cavemen-card border border-cavemen-bronze/40 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-cinzel text-lg font-bold text-cavemen-offwhite uppercase">
              {staffModal.mode === 'create' ? 'Add Master Barber' : 'Edit Barber Profile'}
            </h3>

            <form onSubmit={handleSaveStaff} className="space-y-4 text-xs">
              <div>
                <label className="block text-cavemen-softgrey mb-1 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  name="staffFullName"
                  required
                  defaultValue={staffModal.data?.full_name || ''}
                  placeholder="e.g. Tariq 'Blade' Vance"
                  className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-cavemen-softgrey mb-1 uppercase tracking-wider">Bio / Experience</label>
                <textarea
                  name="staffBio"
                  rows={3}
                  defaultValue={staffModal.data?.bio || ''}
                  placeholder="Specialist in precision skin fades..."
                  className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-cavemen-softgrey mb-1 uppercase tracking-wider">
                  Specialties (comma separated)
                </label>
                <input
                  type="text"
                  name="staffSpecialties"
                  defaultValue={staffModal.data?.specialties ? staffModal.data.specialties.join(', ') : 'Skin Fades, Scissor Craft, Beard Sculpting'}
                  className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-cavemen-softgrey mb-1 uppercase tracking-wider">Avatar / Photo URL</label>
                <input
                  type="text"
                  name="staffAvatarUrl"
                  defaultValue={staffModal.data?.avatar_url || '/images/gallery-craft-tools.jpg'}
                  className="w-full bg-cavemen-black border border-white/10 px-3 py-2 text-cavemen-offwhite focus:border-cavemen-bronze focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="staffIsActive"
                  id="staffIsActive"
                  defaultChecked={staffModal.data ? staffModal.data.is_active : true}
                  className="rounded border-white/20 bg-cavemen-black text-cavemen-bronze focus:ring-0"
                />
                <label htmlFor="staffIsActive" className="text-cavemen-offwhite">
                  Active (available for bookings)
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setStaffModal({ open: false, mode: 'create', data: null })}
                  className="px-4 py-2 border border-white/20 text-xs text-cavemen-softgrey hover:text-cavemen-offwhite"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-cavemen-bronze text-cavemen-black text-xs font-semibold uppercase tracking-wider hover:bg-cavemen-bronzeLight"
                >
                  {staffModal.mode === 'create' ? 'Create Barber' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
