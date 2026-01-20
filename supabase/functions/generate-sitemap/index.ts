import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/**
 * Dynamic Sitemap Generator Edge Function
 * 
 * Generates a consolidated sitemap.xml with all valid, indexable URLs.
 * All URLs are:
 * - Self-canonical (no redirects)
 * - Return HTTP 200
 * - Not noindex
 * - Listed ONLY ONCE
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/xml",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting sitemap generation...");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const baseUrl = "https://anfurnwll.com";
    const currentDate = new Date().toISOString().split("T")[0];

    // Fetch product categories
    const { data: categories, error: categoriesError } = await supabase
      .from("product_categories")
      .select("category_slug")
      .not("category_slug", "is", null);

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
    }

    // Fetch blogs
    const { data: blogs, error: blogsError } = await supabase
      .from("blogs")
      .select("slug, date");

    if (blogsError) {
      console.error("Error fetching blogs:", blogsError);
    }

    console.log(`Found ${categories?.length || 0} product categories`);
    console.log(`Found ${blogs?.length || 0} blogs`);

    // Build sitemap XML - Single consolidated sitemap with all valid URLs
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Main Pages -->
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/products</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/our-projects</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Service Pages -->
  <url>
    <loc>${baseUrl}/fire-rated-doors-bahrain</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/interior-fitouts-bahrain</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/wooden-pallets-bahrain-saudi-arabia</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/custom-wooden-packaging-bahrain-saudi-arabia</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;

    // Add product category pages dynamically
    if (categories && categories.length > 0) {
      sitemap += `

  <!-- Product Category Pages -->`;
      for (const category of categories) {
        if (category.category_slug) {
          sitemap += `
  <url>
    <loc>${baseUrl}/product/${category.category_slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
        }
      }
    }

    // Add blog posts dynamically
    if (blogs && blogs.length > 0) {
      sitemap += `

  <!-- Blog Post Pages -->`;
      for (const blog of blogs) {
        if (blog.slug) {
          const lastmod = blog.date 
            ? new Date(blog.date).toISOString().split("T")[0]
            : currentDate;
          sitemap += `
  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;
        }
      }
    }

    sitemap += `
</urlset>`;

    console.log("Sitemap generated successfully");

    return new Response(sitemap, {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<error>Failed to generate sitemap: ${error.message}</error>`,
      {
        headers: { ...corsHeaders, "Content-Type": "application/xml" },
        status: 500,
      }
    );
  }
});
