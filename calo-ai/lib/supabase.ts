import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Calo AI Database Client
export const caloClient = createClient(supabaseUrl, supabaseAnonKey);

// HabitPro Database Client (Separate instances as per requirement)
export const habitClient = createClient(supabaseUrl, supabaseAnonKey);

// Default export for backward compatibility during transition
export const supabase = caloClient;
