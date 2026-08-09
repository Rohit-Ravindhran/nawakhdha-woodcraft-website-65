import type { TablesInsert } from '@/integrations/supabase/types';

/**
 * Helpers that strip fields which do not exist as columns on the
 * corresponding Supabase tables before an insert/update is issued.
 * Extra keys would otherwise be rejected by PostgREST at runtime.
 */

const pick = (
  data: Record<string, unknown>,
  columns: readonly string[]
): Record<string, unknown> => {
  const row: Record<string, unknown> = {};
  for (const key of columns) {
    if (data[key] !== undefined) row[key] = data[key];
  }
  return row;
};

export const BLOG_COLUMNS = [
  'slug',
  'title',
  'content',
  'image_url',
  'alt_text',
  'body_content',
  'date',
  'featured_image_url',
  'excerpt',
] as const;

export const PRODUCT_CATEGORY_COLUMNS = [
  'category_slug',
  'category_name',
  'category_image_url',
  'alt_text',
  'product_name',
  'seo_title',
  'seo_description',
  'seo_keywords',
] as const;

export const PAGE_COLUMNS = [
  'page_name',
  'hero',
  'seo_title',
  'seo_description',
  'seo_keywords',
] as const;

export const pickBlogColumns = (data: Record<string, unknown>) =>
  pick(data, BLOG_COLUMNS) as TablesInsert<'blogs'>;

export const pickProductCategoryColumns = (data: Record<string, unknown>) =>
  pick(data, PRODUCT_CATEGORY_COLUMNS) as TablesInsert<'product_categories'>;

export const pickPageColumns = (data: Record<string, unknown>) =>
  pick(data, PAGE_COLUMNS) as TablesInsert<'pages'>;
