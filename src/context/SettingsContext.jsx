import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    dark_mode: true,
    adhd_mode: false,
    face_id: false,
    language: 'English'
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    // Apply global classes instantly
    const root = document.documentElement;
    if (settings.dark_mode) root.classList.add('dark');
    else root.classList.remove('dark');
    
    if (settings.adhd_mode) root.classList.add('adhd-mode');
    else root.classList.remove('adhd-mode');
  }, [settings.dark_mode, settings.adhd_mode]);

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

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, loading }}>
      {!loading && children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
