'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { habitClient, caloClient } from '@/lib/supabase';

interface AppSettings {
  adhd_mode: boolean;
  language: string;
  dob: string | null;
  target_calories: number;
  xp: number;
  level: number;
}

interface AppContextType {
  settings: AppSettings;
  updateSetting: (key: keyof AppSettings, value: any) => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>({
    adhd_mode: false,
    language: 'English',
    dob: null,
    target_calories: 2100,
    xp: 0,
    level: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data: sessionData } = await habitClient.auth.getSession();
      if (!sessionData?.session) {
        setLoading(false);
        return;
      }

      // Fetch from Habit DB (User Settings + Gamification)
      const { data, error } = await habitClient
        .from('user_settings')
        .select('*')
        .eq('user_id', sessionData.session.user.id)
        .single();

      if (data) {
        setSettings(prev => ({
          ...prev,
          adhd_mode: data.adhd_mode || false,
          language: data.language || 'English',
          dob: data.dob,
          xp: data.xp || 0,
          level: data.level || 1
        }));
      }

      // Fetch from Calo DB (User Profile)
      const { data: caloData } = await caloClient
        .from('profiles')
        .select('target_calories')
        .eq('id', sessionData.session.user.id)
        .single();

      if (caloData) {
        setSettings(prev => ({
          ...prev,
          target_calories: caloData.target_calories || 2100
        }));
      }

    } catch (err) {
      console.warn("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: keyof AppSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    try {
      const { data: sessionData } = await habitClient.auth.getSession();
      if (!sessionData?.session) return;

      if (['adhd_mode', 'language', 'dob', 'xp', 'level'].includes(key)) {
        await habitClient
          .from('user_settings')
          .update({ [key]: value })
          .eq('user_id', sessionData.session.user.id);
      } else if (key === 'target_calories') {
        await caloClient
          .from('profiles')
          .update({ target_calories: value })
          .eq('id', sessionData.session.user.id);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
      setSettings(settings);
    }
  };

  const addXP = async (amount: number) => {
    const newXP = settings.xp + amount;
    const nextLevelXP = settings.level * 100;
    
    let newLevel = settings.level;
    let finalXP = newXP;
    
    if (newXP >= nextLevelXP) {
      newLevel += 1;
      finalXP = newXP - nextLevelXP; // Reset XP towards next level
    }

    setSettings(prev => ({ ...prev, xp: finalXP, level: newLevel }));
    
    try {
      const { data: sessionData } = await habitClient.auth.getSession();
      if (!sessionData?.session) return;

      await habitClient
        .from('user_settings')
        .update({ xp: finalXP, level: newLevel })
        .eq('user_id', sessionData.session.user.id);
    } catch (err) {
      console.error('Failed to update XP:', err);
    }
  };

  return (
    <AppContext.Provider value={{ settings, updateSetting, addXP, loading }}>
      {!loading ? children : (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
           <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
