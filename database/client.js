import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
  (supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL),
  (supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY)
);

export { supabaseClient };
