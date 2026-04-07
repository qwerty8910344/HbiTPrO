import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Mail, Lock, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AuthView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setSuccessMsg('Password reset link sent! Check your inbox.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Decorative Glows */}
      <div style={styles.glowGreen} />
      <div style={styles.glowTeal} />

      <header style={styles.header}>
        <div style={styles.iconBox}>
          <Crown color="white" size={32} />
        </div>
        <h1 style={styles.title}>HabitPro</h1>
        <p style={styles.subtitle}>
          <Sparkles size={16} /> Elite Tracking
        </p>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.card}
      >
        {/* Tabs */}
        {!isForgotPassword && (
          <div style={styles.tabRow}>
            <button 
              style={{ ...styles.tab, ...(isLogin ? styles.tabActive : {}) }}
              onClick={() => {setIsLogin(true); setError(null); setSuccessMsg(null);}}
            >
              Sign In
            </button>
            <button 
              style={{ ...styles.tab, ...(!isLogin ? styles.tabActive : {}) }}
              onClick={() => {setIsLogin(false); setError(null); setSuccessMsg(null);}}
            >
              Sign Up
            </button>
          </div>
        )}

        {isForgotPassword ? (
          <form onSubmit={handleForgotPassword} style={styles.form}>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#4ADE80', marginBottom: '8px' }}>Reset Password</h3>
              <p style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600, lineHeight: 1.5 }}>Enter your email and we'll send you a link to reset your password.</p>
            </div>

            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}><Mail size={20} strokeWidth={2.5} /></div>
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
            </div>

            <AnimatePresence>
              {error && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={styles.errorBox}>{error}</motion.div>)}
              {successMsg && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={styles.successBox}>{successMsg}</motion.div>)}
            </AnimatePresence>

            <button type="submit" disabled={loading} style={{ ...styles.submitBtn, ...(loading ? { opacity: 0.7 } : {}) }}>
              {loading ? <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} /> : 'Send Reset Link'}
            </button>

            <button type="button" onClick={() => { setIsForgotPassword(false); setError(null); setSuccessMsg(null); }} style={styles.backLink}>
              ← Back to Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleAuth} style={styles.form}>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}><Mail size={20} strokeWidth={2.5} /></div>
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
            </div>
            
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}><Lock size={20} strokeWidth={2.5} /></div>
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" style={styles.input} />
            </div>

            {isLogin && (
              <button type="button" onClick={() => { setIsForgotPassword(true); setError(null); setSuccessMsg(null); }} style={styles.forgotLink}>
                Forgot password?
              </button>
            )}

            <AnimatePresence>
              {error && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={styles.errorBox}>{error}</motion.div>)}
            </AnimatePresence>

            <button type="submit" disabled={loading} style={{ ...styles.submitBtn, ...(loading ? { opacity: 0.7 } : {}) }}>
              {loading ? <Loader2 size={24} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : (isLogin ? 'Enter App' : 'Create Account')}
            </button>
          </form>
        )}

        <div style={styles.footer}>
           <p style={styles.footerText}>By continuing, you agree to</p>
           <div style={styles.footerLinks}>
              <a href="#" style={styles.footerLink}>Terms of Service</a>
              <span style={{ color: '#6B7280', opacity: 0.3 }}>•</span>
              <a href="#" style={styles.footerLink}>Privacy Policy</a>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    minHeight: '90vh', gap: '32px', padding: '0 16px', position: 'relative', zIndex: 10,
    width: '100%', maxWidth: '400px', margin: '0 auto',
  },
  glowGreen: {
    position: 'absolute', top: '40px', left: '-40px', width: '256px', height: '256px',
    background: 'rgba(22, 163, 74, 0.15)', borderRadius: '50%', filter: 'blur(80px)', zIndex: -1,
  },
  glowTeal: {
    position: 'absolute', bottom: '40px', right: '-40px', width: '256px', height: '256px',
    background: 'rgba(74, 222, 128, 0.1)', borderRadius: '50%', filter: 'blur(80px)', zIndex: -1,
  },
  header: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '32px',
  },
  iconBox: {
    width: '64px', height: '64px',
    background: 'linear-gradient(135deg, #16A34A, #4ADE80)',
    borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 12px 40px rgba(22, 163, 74, 0.4)', marginBottom: '24px',
    border: '2px solid rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: '40px', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1, color: '#4ADE80',
  },
  subtitle: {
    color: 'rgba(74, 222, 128, 0.6)', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.3px',
    marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px',
  },
  card: {
    width: '100%', background: 'rgba(17, 24, 39, 0.85)', backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)', borderRadius: '40px', padding: '32px 32px 40px',
    border: '1px solid rgba(255, 255, 255, 0.06)', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
  },
  tabRow: { display: 'flex', gap: '16px', marginBottom: '32px' },
  tab: {
    flex: 1, paddingBottom: '12px', fontSize: '13px', fontWeight: 900,
    textTransform: 'uppercase', letterSpacing: '0.15em', background: 'none', border: 'none',
    borderBottom: '4px solid transparent', color: '#6B7280', cursor: 'pointer',
    transition: 'all 0.3s ease', fontFamily: 'inherit',
  },
  tabActive: { color: '#4ADE80', borderBottomColor: '#16A34A' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputWrapper: { position: 'relative' },
  inputIcon: {
    position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
    color: '#6B7280', pointerEvents: 'none',
  },
  input: {
    width: '100%', background: 'rgba(255, 255, 255, 0.05)',
    paddingLeft: '48px', paddingRight: '24px', paddingTop: '16px', paddingBottom: '16px',
    borderRadius: '20px', fontWeight: 700, fontSize: '16px', color: '#E5E7EB',
    border: '1px solid rgba(255, 255, 255, 0.06)', outline: 'none',
    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.2)', fontFamily: 'inherit', boxSizing: 'border-box',
  },
  errorBox: {
    color: '#ef4444', fontSize: '12px', fontWeight: 700, padding: '8px 12px',
    background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', textAlign: 'center',
  },
  successBox: {
    color: '#4ADE80', fontSize: '12px', fontWeight: 700, padding: '8px 12px',
    background: 'rgba(74, 222, 128, 0.1)', borderRadius: '12px', textAlign: 'center',
  },
  submitBtn: {
    width: '100%', marginTop: '8px', padding: '16px', borderRadius: '20px',
    background: 'linear-gradient(135deg, #16A34A, #4ADE80)', color: 'white',
    fontWeight: 900, fontSize: '18px', letterSpacing: '0.5px',
    boxShadow: '0 10px 30px rgba(22, 163, 74, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.1)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit',
  },
  forgotLink: {
    background: 'none', border: 'none', color: '#4ADE80', fontSize: '13px',
    fontWeight: 700, cursor: 'pointer', textAlign: 'right', marginTop: '-8px', fontFamily: 'inherit',
  },
  backLink: {
    background: 'none', border: 'none', color: '#6B7280', fontSize: '14px',
    fontWeight: 700, cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit',
  },
  footer: {
    marginTop: '32px', paddingTop: '24px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  },
  footerText: { fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#6B7280' },
  footerLinks: { display: 'flex', gap: '16px', alignItems: 'center' },
  footerLink: { fontSize: '12px', fontWeight: 700, color: '#4ADE80', textDecoration: 'none' },
};

export default AuthView;
