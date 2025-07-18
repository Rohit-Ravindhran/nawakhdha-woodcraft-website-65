
import { supabase } from '@/integrations/supabase/client';

export async function generateSitemap() {
  try {
    // Fetch actual product categories with slugs
    const { data: categories, error: categoriesError } = await supabase
      .from('product_categories')
      .select('category_slug')
      .not('category_slug', 'is', null);

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
    }

    // Fetch actual blog posts with slugs
    const { data: blogs, error: blogsError } = await supabase
      .from('blogs')
      .select('slug')
      .not('slug', 'is', null);

    if (blogsError) {
      console.error('Error fetching blogs:', blogsError);
    }

    const currentDate = new Date().toISOString().split('T')[0];
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>https://anfurnwll.com/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Main Pages -->
  <url>
    <loc>https://anfurnwll.com/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://anfurnwll.com/products</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://anfurnwll.com/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>https://anfurnwll.com/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <url>
    <loc>https://anfurnwll.com/fire-rated-doors-bahrain</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;

    // Add product category pages
    if (categories && categories.length > 0) {
      sitemap += `
  <!-- Product Category Pages -->`;
      
      categories.forEach(category => {
        if (category.category_slug) {
          sitemap += `
  <url>
    <loc>https://anfurnwll.com/product/${category.category_slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
        }
      });
    }

    // Add blog post pages
    if (blogs && blogs.length > 0) {
      sitemap += `
  
  <!-- Blog Post Pages -->`;
      
      blogs.forEach(blog => {
        if (blog.slug) {
          sitemap += `
  <url>
    <loc>https://anfurnwll.com/blog/${blog.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;
        }
      });
    }

    sitemap += `
</urlset>
`;

    return {
      sitemap,
      stats: {
        categories: categories?.length || 0,
        blogs: blogs?.length || 0,
        categorySlugs: categories?.map(c => c.category_slug).filter(Boolean) || [],
        blogSlugs: blogs?.map(b => b.slug).filter(Boolean) || []
      }
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
}
