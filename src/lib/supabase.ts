
// This file is being deprecated in favor of src/integrations/supabase/client.ts
// Import the supabase client from "@/integrations/supabase/client" instead

import { supabase } from "@/integrations/supabase/client";

// Re-export for backward compatibility
export { supabase };

// Type re-export for backward compatibility
export type { Database } from '@/integrations/supabase/types';
