/**
 * Keep-Alive Edge Function
 * 
 * Purpose: Prevents Supabase Free tier projects from auto-pausing due to inactivity.
 * Supabase pauses free projects after 7 days of no database activity.
 * This function runs a simple read-only query daily via a cron job.
 * 
 * Endpoint: https://enqplizqtwvquxliiygz.supabase.co/functions/v1/keep-alive
 * Schedule: Once per day via pg_cron
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const startTime = Date.now()
  
  try {
    // Initialize Supabase client with service role for server-side access
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Simple read-only query that touches the database without modifying data
    const { data, error } = await supabase
      .from('pages')
      .select('id')
      .limit(1)

    if (error) {
      console.error('[Keep-Alive] Database query failed:', error.message)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message,
          timestamp: new Date().toISOString()
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const duration = Date.now() - startTime
    console.log(`[Keep-Alive] Success - Database pinged in ${duration}ms at ${new Date().toISOString()}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Supabase keep-alive ping successful',
        duration_ms: duration,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (err) {
    console.error('[Keep-Alive] Unexpected error:', err)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
