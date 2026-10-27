import { createClient } from '@supabase/supabase-js';
import { ENV } from './env.js';

let supabaseClient = null;
let supabaseAdminClient = null;

if (ENV.SUPABASE_URL && ENV.SUPABASE_KEY) {
  try {
    supabaseClient = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_KEY, {
      auth: { persistSession: false },
    });
    console.log('✓ Supabase Client initialized successfully');
  } catch (err) {
    console.warn('⚠ Could not initialize Supabase client:', err.message);
  }
}

if (ENV.SUPABASE_URL && ENV.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    supabaseAdminClient = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
    console.log('✓ Supabase Admin (Service Role) client initialized');
  } catch (err) {
    console.warn('⚠ Could not initialize Supabase Admin client:', err.message);
  }
}

export { supabaseClient, supabaseAdminClient };
