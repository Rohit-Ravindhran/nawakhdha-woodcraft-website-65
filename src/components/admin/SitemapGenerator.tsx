
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Download, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { generateSitemap } from '@/utils/sitemapGenerator';
import { toast } from 'sonner';

export function SitemapGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [sitemapData, setSitemapData] = useState<{
    sitemap: string;
    stats: {
      categories: number;
      blogs: number;
      categorySlugs: string[];
      blogSlugs: string[];
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSitemap = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateSitemap();
      setSitemapData(result);
      toast.success('Sitemap generated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate sitemap';
      setError(errorMessage);
      toast.error('Failed to generate sitemap');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!sitemapData) return;
    
    const blob = new Blob([sitemapData.sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Sitemap downloaded!');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Sitemap Generator
        </CardTitle>
        <CardDescription>
          Generate an updated sitemap.xml file based on current product categories and blog posts in the database.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button 
            onClick={handleGenerateSitemap} 
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Generate Sitemap
          </Button>
          
          {sitemapData && (
            <Button 
              onClick={handleDownload}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Sitemap
            </Button>
          )}
        </div>

        {sitemapData && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p><strong>Sitemap generated successfully!</strong></p>
                  <div className="text-sm">
                    <p>• Product categories: {sitemapData.stats.categories}</p>
                    <p>• Blog posts: {sitemapData.stats.blogs}</p>
                    <p>• Total URLs: {5 + sitemapData.stats.categories + sitemapData.stats.blogs}</p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            {sitemapData.stats.categorySlugs.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Product Category URLs:</h4>
                <div className="text-sm space-y-1 max-h-32 overflow-y-auto">
                  {sitemapData.stats.categorySlugs.map((slug, index) => (
                    <div key={index} className="font-mono text-xs">
                      https://anfurnwll.com/product/{slug}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {sitemapData.stats.blogSlugs.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Blog Post URLs:</h4>
                <div className="text-sm space-y-1 max-h-32 overflow-y-auto">
                  {sitemapData.stats.blogSlugs.map((slug, index) => (
                    <div key={index} className="font-mono text-xs">
                      https://anfurnwll.com/blog/{slug}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
