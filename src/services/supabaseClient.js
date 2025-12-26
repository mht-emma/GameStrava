import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oaumjufemwchkwyvdixm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hdW1qdWZlbXdjaGt3eXZkaXhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2MDMzNjcsImV4cCI6MjA4MjE3OTM2N30.3bPxSo_Vo6oXNMYApL6tAOKexQuYOLPD00wUXjCJHGw';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
