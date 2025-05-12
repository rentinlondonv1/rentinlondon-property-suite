
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../integrations/supabase/types';

// Import the supabase client like this:
// import { supabase } from "@/lib/db";
export const supabase = createClient<Database>(
  "https://yyihajkjfslygzuvbqnh.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5aWhhamtqZnNseWd6dXZicW5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwODE2MzgsImV4cCI6MjA2MjY1NzYzOH0.yAnRxTLp5-FmXQYge_Phg5TyHUrDwDNJgFGbWdB5PsQ"
);
