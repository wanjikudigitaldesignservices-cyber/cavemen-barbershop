import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, Key, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { bootstrapOwner } from '../lib/supabase';

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const { signIn, signUp, resetPassword, profile, isOwner, isManager } = useAuth();
  
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'reset' | 'bootstrap'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bootstrapKey, setBootstrapKey] = useState('CAVEMEN_INITIAL_OWNER_KEY_2026');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const resetState = () => {
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    resetState();
    setLoading(true);
    try {
      await signIn(email, password);
      setSuccessMsg('Authenticated successfully.');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    resetState();
    setLoading(true);
    try {
      await signUp(email, password, fullName, phoneNumber);
      setSuccessMsg('Account created! Please check your email to confirm your account or sign in directly.');
      setTimeout(() => {
        setMode('signin');
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message || 'Error creating account.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    resetState();
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccessMsg('Password reset link sent! Check your email inbox.');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  const handleBootstrap = async (e) => {
    e.preventDefault();
    resetState();
    setLoading(true);
    try {
      const res = await bootstrapOwner(email, bootstrapKey);
      setSuccessMsg(res?.message || 'Account successfully elevated to Owner!');
      setTimeout(() => {
        setMode('signin');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Bootstrap failed. Verify email and master key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-cavemen-black/90 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-md bg-cavemen-card border border-cavemen-bronze/40 p-6 sm:p-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-cavemen-bronze font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cavemen-bronze" />
              CAVEMEN Portal
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-cavemen-offwhite uppercase">
              {mode === 'signin' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'reset' && 'Reset Password'}
              {mode === 'bootstrap' && 'Elevate to Owner'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-cavemen-softgrey hover:text-cavemen-offwhite transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-sans">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-5 p-3.5 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-sans flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* SIGN IN FORM */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-cavemen-softgrey mb-1.5 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-cavemen-softgrey" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-cavemen-black border border-white/10 pl-10 pr-4 py-2.5 text-sm text-cavemen-offwhite placeholder-white/20 focus:border-cavemen-bronze focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs uppercase tracking-widest text-cavemen-softgrey font-medium">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { resetState(); setMode('reset'); }}
                  className="text-[11px] text-cavemen-bronze hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-cavemen-softgrey" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-cavemen-black border border-white/10 pl-10 pr-4 py-2.5 text-sm text-cavemen-offwhite placeholder-white/20 focus:border-cavemen-bronze focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-cavemen-bronze text-cavemen-black font-semibold text-xs uppercase tracking-[0.2em] hover:bg-cavemen-bronzeLight transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-4 border-t border-white/10 text-center space-y-3">
              <p className="text-xs text-cavemen-softgrey font-sans">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { resetState(); setMode('signup'); }}
                  className="text-cavemen-bronze hover:underline font-semibold"
                >
                  Create one now
                </button>
              </p>

              <button
                type="button"
                onClick={() => { resetState(); setMode('bootstrap'); }}
                className="text-[11px] text-white/40 hover:text-cavemen-bronze flex items-center justify-center gap-1 mx-auto transition-colors"
              >
                <Key className="w-3 h-3" />
                <span>Executive Owner Setup</span>
              </button>
            </div>
          </form>
        )}

        {/* SIGN UP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-cavemen-softgrey mb-1.5 font-medium">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-cavemen-softgrey" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alexander Vance"
                  className="w-full bg-cavemen-black border border-white/10 pl-10 pr-4 py-2.5 text-sm text-cavemen-offwhite placeholder-white/20 focus:border-cavemen-bronze focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-cavemen-softgrey mb-1.5 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-cavemen-softgrey" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-cavemen-black border border-white/10 pl-10 pr-4 py-2.5 text-sm text-cavemen-offwhite placeholder-white/20 focus:border-cavemen-bronze focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-cavemen-softgrey mb-1.5 font-medium">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-cavemen-softgrey" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+254 700 000 000"
                  className="w-full bg-cavemen-black border border-white/10 pl-10 pr-4 py-2.5 text-sm text-cavemen-offwhite placeholder-white/20 focus:border-cavemen-bronze focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-cavemen-softgrey mb-1.5 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-cavemen-softgrey" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-cavemen-black border border-white/10 pl-10 pr-4 py-2.5 text-sm text-cavemen-offwhite placeholder-white/20 focus:border-cavemen-bronze focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-cavemen-bronze text-cavemen-black font-semibold text-xs uppercase tracking-[0.2em] hover:bg-cavemen-bronzeLight transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="pt-4 border-t border-white/10 text-center">
              <p className="text-xs text-cavemen-softgrey font-sans">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { resetState(); setMode('signin'); }}
                  className="text-cavemen-bronze hover:underline font-semibold"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4">
            <p className="text-xs text-cavemen-softgrey font-sans">
              Enter the email address registered with CAVEMEN. We will deliver a secure password reset link.
            </p>

            <div>
              <label className="block text-xs uppercase tracking-widest text-cavemen-softgrey mb-1.5 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-cavemen-softgrey" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-cavemen-black border border-white/10 pl-10 pr-4 py-2.5 text-sm text-cavemen-offwhite placeholder-white/20 focus:border-cavemen-bronze focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-cavemen-bronze text-cavemen-black font-semibold text-xs uppercase tracking-[0.2em] hover:bg-cavemen-bronzeLight transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending instructions...</span>
                </>
              ) : (
                <span>Send Reset Link</span>
              )}
            </button>

            <div className="pt-4 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={() => { resetState(); setMode('signin'); }}
                className="text-xs text-cavemen-softgrey hover:text-cavemen-offwhite transition-colors"
              >
                ← Return to Sign In
              </button>
            </div>
          </form>
        )}

        {/* BOOTSTRAP OWNER PRIVILEGES */}
        {mode === 'bootstrap' && (
          <form onSubmit={handleBootstrap} className="space-y-4">
            <div className="p-3 bg-cavemen-bronze/10 border border-cavemen-bronze/30 text-[11px] text-cavemen-offwhite font-sans space-y-1">
              <p className="font-semibold text-cavemen-bronze">Owner Role Elevation</p>
              <p className="text-cavemen-softgrey">
                Promote a registered user profile to the <strong className="text-cavemen-offwhite">Owner</strong> role using the system master key.
              </p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-cavemen-softgrey mb-1.5 font-medium">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-cavemen-softgrey" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@cavemen.co.ke"
                  className="w-full bg-cavemen-black border border-white/10 pl-10 pr-4 py-2.5 text-sm text-cavemen-offwhite placeholder-white/20 focus:border-cavemen-bronze focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-cavemen-softgrey mb-1.5 font-medium">
                Master Secret Key
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-3 w-4 h-4 text-cavemen-softgrey" />
                <input
                  type="password"
                  required
                  value={bootstrapKey}
                  onChange={(e) => setBootstrapKey(e.target.value)}
                  className="w-full bg-cavemen-black border border-white/10 pl-10 pr-4 py-2.5 text-sm text-cavemen-offwhite placeholder-white/20 focus:border-cavemen-bronze focus:outline-none transition-colors font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-cavemen-bronze text-cavemen-black font-semibold text-xs uppercase tracking-[0.2em] hover:bg-cavemen-bronzeLight transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Master Credentials...</span>
                </>
              ) : (
                <span>Elevate to Owner Role</span>
              )}
            </button>

            <div className="pt-4 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={() => { resetState(); setMode('signin'); }}
                className="text-xs text-cavemen-softgrey hover:text-cavemen-offwhite transition-colors"
              >
                ← Return to Sign In
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
