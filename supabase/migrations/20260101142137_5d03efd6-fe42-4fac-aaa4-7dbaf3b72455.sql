-- Enable required extensions for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule daily keep-alive ping at 3:00 AM UTC
-- This prevents Supabase Free tier from auto-pausing after 7 days of inactivity
SELECT cron.schedule(
  'daily-keep-alive',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url := 'https://enqplizqtwvquxliiygz.supabase.co/functions/v1/keep-alive',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucXBsaXpxdHd2cXV4bGlpeWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3ODUwNDIsImV4cCI6MjA2MTM2MTA0Mn0.uWMxgXNWnrv-Kmc8rjuCRiasS1vTJ6fB0nkjVpuxGZs"}'::jsonb,
    body := '{"source": "cron"}'::jsonb
  ) AS request_id;
  $$
);