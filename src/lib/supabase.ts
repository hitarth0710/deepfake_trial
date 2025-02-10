import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Missing Supabase environment variables");
}

export const supabase = createClient(
  supabaseUrl || "https://your-project-url.supabase.co",
  supabaseAnonKey || "your-anon-key",
);
