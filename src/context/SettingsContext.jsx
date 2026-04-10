import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    dark_mode: true,
    adhd_mode: false,
    face_id: false,
    language: 'English',
    dob: null,
    avatar_url: null,
    subscription_tier: 'free',
    subscription_status: 'trialing',
    created_at: null
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle Theme and Layout Changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.dark_mode) root.classList.add('dark');
    else root.classList.remove('dark');

    if (settings.adhd_mode) root.classList.add('adhd-mode');
    else root.classList.remove('adhd-mode');

    // RTL Support for Arabic
    if (settings.language === 'Arabic') {
      root.setAttribute('dir', 'rtl');
      root.classList.add('rtl');
    } else {
      root.setAttribute('dir', 'ltr');
      root.classList.remove('rtl');
    }
  }, [settings.dark_mode, settings.adhd_mode, settings.language]);

  const fetchSettings = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', sessionData.session.user.id)
        .single();
        
      if (data) {
        setSettings(data);
      } else {
        // If no settings exist yet, create default settings
        await supabase.from('user_settings').insert({ user_id: sessionData.session.user.id });
      }
    } catch (err) {
      console.warn("Error fetching config, returning to defaults:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings); // Optimistic UI update

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) return;
      
      await supabase
        .from('user_settings')
        .update({ [key]: value })
        .eq('user_id', sessionData.session.user.id);
    } catch (err) {
      console.error('Failed to save settings:', err);
      // Revert if failed
      setSettings(settings);
    }
  };

  // Derived Trial Logic
  const getTrialDaysLeft = () => {
    if (!settings.created_at) return 0;
    const signupDate = new Date(settings.created_at);
    const trialEndDate = new Date(signupDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    const today = new Date();
    const diff = trialEndDate - today;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const isPremium = settings.subscription_tier !== 'free' || getTrialDaysLeft() > 0;

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateSetting, 
      loading, 
      isPremium, 
      trialDaysLeft: getTrialDaysLeft() 
    }}>
      {!loading && children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
