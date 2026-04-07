import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

export const useReminders = () => {
  useEffect(() => {
    // Request permission on mount if not already granted or denied
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkReminders = async () => {
      if (!('Notification' in window) || Notification.permission !== 'granted') return;

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session) return;
        
        // Fetch habits that have a reminder configured and are not completed
        const { data: habits, error } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', sessionData.session.user.id)
          .eq('completed', false)
          .neq('reminder_type', 'none');

        if (error || !habits) return;

        const now = new Date();
        const currentHourMin = format(now, 'HH:mm');

        habits.forEach(habit => {
          // If it's a specific time
          if (habit.reminder_type === 'time') {
            if (habit.reminder_value === currentHourMin) {
              triggerNotification(habit);
            }
          } 
          // If it's an interval (e.g. "1") meaning every 1 hour
          else if (habit.reminder_type === 'interval') {
            // Simplified interval logic: if current minute is 0 and hour % interval is 0
            // This is a naive interval check intended for exact hour boundaries
            const intervalHours = parseInt(habit.reminder_value) || 1;
            if (now.getMinutes() === 0 && now.getHours() % intervalHours === 0) {
              triggerNotification(habit);
            }
          }
        });
      } catch (err) {
        console.error('Reminder check failed', err);
      }
    };

    // Check every minute (60000 ms)
    const intervalId = setInterval(checkReminders, 60000);
    // Initial check offset so it aligns roughly with minute boundaries
    setTimeout(checkReminders, (60 - new Date().getSeconds()) * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const triggerNotification = (habit) => {
    // Register local tracking so we don't spam the user within the same minute
    const cacheKey = `notified_${habit.id}_${new Date().getMinutes()}`;
    if (sessionStorage.getItem(cacheKey)) return;
    
    sessionStorage.setItem(cacheKey, 'true');

    new Notification(`HabitPro: ${habit.title}`, {
      body: `Time to crush it! Your scheduled habit is ready.`,
      icon: '/icon-192.png'
    });
  };
};
