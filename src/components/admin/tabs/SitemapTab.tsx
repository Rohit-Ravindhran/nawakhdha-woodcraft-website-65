
import { SitemapGenerator } from '../SitemapGenerator';

export default function SitemapTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Sitemap Management</h2>
        <p className="text-muted-foreground">
          Generate and download an updated sitemap.xml file based on your current content.
        </p>
      </div>
      
      <SitemapGenerator />
    </div>
  );
}
