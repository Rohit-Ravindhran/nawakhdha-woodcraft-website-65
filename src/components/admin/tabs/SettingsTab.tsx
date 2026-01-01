import { useState } from 'react';
import { SitemapGenerator } from '../SitemapGenerator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export default function SettingsTab() {
  const [isTestingKeepAlive, setIsTestingKeepAlive] = useState(false);
  const [keepAliveResult, setKeepAliveResult] = useState<{
    success: boolean;
    message: string;
    duration?: number;
  } | null>(null);

  const testKeepAlive = async () => {
    setIsTestingKeepAlive(true);
    setKeepAliveResult(null);
    
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('keep-alive');
      const duration = Date.now() - startTime;
      
      if (error) {
        setKeepAliveResult({
          success: false,
          message: `Error: ${error.message}`,
          duration,
        });
      } else {
        setKeepAliveResult({
          success: true,
          message: data?.message || 'Keep-alive ping successful!',
          duration,
        });
      }
    } catch (err: any) {
      const duration = Date.now() - startTime;
      setKeepAliveResult({
        success: false,
        message: `Failed: ${err.message}`,
        duration,
      });
    } finally {
      setIsTestingKeepAlive(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sitemap Section */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Sitemap Management</h2>
        <p className="text-muted-foreground">
          Generate and download an updated sitemap.xml file based on your current content.
        </p>
      </div>
      <SitemapGenerator />

      {/* Keep-Alive Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Database Keep-Alive
          </CardTitle>
          <CardDescription>
            Test the keep-alive endpoint that prevents Supabase Free tier from auto-pausing.
            A daily cron job runs this automatically at 3:00 AM UTC.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testKeepAlive} 
            disabled={isTestingKeepAlive}
            variant="outline"
          >
            {isTestingKeepAlive ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Activity className="mr-2 h-4 w-4" />
                Test Keep-Alive Endpoint
              </>
            )}
          </Button>

          {keepAliveResult && (
            <div className={`flex items-start gap-3 p-4 rounded-lg border ${
              keepAliveResult.success 
                ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
                : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
            }`}>
              {keepAliveResult.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${
                  keepAliveResult.success 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {keepAliveResult.success ? 'Success' : 'Failed'}
                </p>
                <p className={`text-sm ${
                  keepAliveResult.success 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {keepAliveResult.message}
                </p>
                {keepAliveResult.duration && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Response time: {keepAliveResult.duration}ms
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
