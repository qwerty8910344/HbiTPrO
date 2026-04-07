import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Mail, Lock, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AuthView = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

  return (
    <div style={styles.wrapper}>
      {/* Decorative Glows */}
      <div style={styles.glowPink} />
      <div style={styles.glowPurple} />

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
        <div style={styles.tabRow}>
          <button 
            style={{
              ...styles.tab,
              ...(isLogin ? styles.tabActive : {})
            }}
            onClick={() => {setIsLogin(true); setError(null);}}
          >
            Sign In
          </button>
          <button 
            style={{
              ...styles.tab,
              ...(!isLogin ? styles.tabActive : {})
            }}
            onClick={() => {setIsLogin(false); setError(null);}}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleAuth} style={styles.form}>
          <div style={styles.inputWrapper}>
            <div style={styles.inputIcon}>
              <Mail size={20} strokeWidth={2.5} />
            </div>
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputWrapper}>
            <div style={styles.inputIcon}>
              <Lock size={20} strokeWidth={2.5} />
            </div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={styles.errorBox}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              ...(loading ? { opacity: 0.7 } : {})
            }}
          >
            {loading ? <Loader2 size={24} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : (isLogin ? 'Enter App' : 'Create Account')}
          </button>
        </form>

        <div style={styles.footer}>
           <p style={styles.footerText}>By continuing, you agree to</p>
           <div style={styles.footerLinks}>
              <a href="#" style={styles.footerLink}>Terms of Service</a>
              <span style={{ color: '#8E8E93', opacity: 0.3 }}>•</span>
              <a href="#" style={styles.footerLink}>Privacy Policy</a>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '90vh',
    gap: '32px',
    padding: '0 16px',
    position: 'relative',
    zIndex: 10,
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
  },
  glowPink: {
    position: 'absolute',
    top: '40px',
    left: '-40px',
    width: '256px',
    height: '256px',
    background: 'rgba(255, 77, 109, 0.15)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    zIndex: -1,
  },
  glowPurple: {
    position: 'absolute',
    bottom: '40px',
    right: '-40px',
    width: '256px',
    height: '256px',
    background: 'rgba(192, 132, 252, 0.15)',
    borderRadius: '50%',
    filter: 'blur(80px)',
    zIndex: -1,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: '32px',
  },
  iconBox: {
    width: '64px',
    height: '64px',
    background: 'linear-gradient(135deg, #FF69B4, #FFD700)',
    borderRadius: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 12px 40px rgba(255, 105, 180, 0.4)',
    marginBottom: '24px',
    border: '2px solid white',
  },
  title: {
    fontSize: '40px',
    fontWeight: 900,
    letterSpacing: '-2px',
    lineHeight: 1,
    color: '#a12b76',
  },
  subtitle: {
    color: 'rgba(161, 43, 118, 0.6)',
    fontWeight: 700,
    fontSize: '18px',
    letterSpacing: '-0.3px',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  card: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    borderRadius: '40px',
    padding: '32px 32px 40px',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    boxShadow: '0 20px 60px rgba(161, 43, 118, 0.15)',
  },
  tabRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '32px',
  },
  tab: {
    flex: 1,
    paddingBottom: '12px',
    fontSize: '13px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    background: 'none',
    border: 'none',
    borderBottom: '4px solid transparent',
    color: '#8E8E93',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
  },
  tabActive: {
    color: '#a12b76',
    borderBottomColor: '#a12b76',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#8E8E93',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    background: 'rgba(218, 221, 223, 0.3)',
    paddingLeft: '48px',
    paddingRight: '24px',
    paddingTop: '16px',
    paddingBottom: '16px',
    borderRadius: '20px',
    fontWeight: 700,
    fontSize: '16px',
    color: '#1C1C1E',
    border: 'none',
    outline: 'none',
    boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.04)',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  errorBox: {
    color: '#ef4444',
    fontSize: '12px',
    fontWeight: 700,
    padding: '8px 12px',
    background: '#fef2f2',
    borderRadius: '12px',
    textAlign: 'center',
  },
  submitBtn: {
    width: '100%',
    marginTop: '8px',
    padding: '16px',
    borderRadius: '20px',
    background: 'linear-gradient(to right, #FF69B4, #FFD700)',
    color: 'white',
    fontWeight: 900,
    fontSize: '18px',
    letterSpacing: '0.5px',
    boxShadow: '0 10px 30px rgba(255, 105, 180, 0.4)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'inherit',
  },
  footer: {
    marginTop: '32px',
    paddingTop: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    borderTop: '1px solid rgba(142, 142, 147, 0.2)',
  },
  footerText: {
    fontSize: '10px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#8E8E93',
  },
  footerLinks: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  footerLink: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#a12b76',
    textDecoration: 'none',
  },
};

export default AuthView;
