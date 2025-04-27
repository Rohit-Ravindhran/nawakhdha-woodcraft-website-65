
import { createClient } from '@supabase/supabase-js';

export type Database = {
  public: {
    Tables: {
      pages: {
        Row: {
          id: number;
          page_name: string;
          title: string;
          content: string;
          seo_title: string | null;
          seo_description: string | null;
        };
        Insert: {
          id?: number;
          page_name: string;
          title: string;
          content: string;
          seo_title?: string | null;
          seo_description?: string | null;
        };
        Update: {
          id?: number;
          page_name?: string;
          title?: string;
          content?: string;
          seo_title?: string | null;
          seo_description?: string | null;
        };
      };
      products: {
        Row: {
          id: number;
          product_name: string;
          description: string;
          category_name: string;
          gallery_images: { url: string; caption: string }[] | null;
        };
        Insert: {
          id?: number;
          product_name: string;
          description: string;
          category_name: string;
          gallery_images?: { url: string; caption: string }[] | null;
        };
        Update: {
          id?: number;
          product_name?: string;
          description?: string;
          category_name?: string;
          gallery_images?: { url: string; caption: string }[] | null;
        };
      };
      blogs: {
        Row: {
          id: number;
          title: string;
          body_content: string;
          featured_image_url: string | null;
          slug: string;
          date: string;
          excerpt: string | null;
        };
        Insert: {
          id?: number;
          title: string;
          body_content: string;
          featured_image_url?: string | null;
          slug: string;
          date: string;
          excerpt?: string | null;
        };
        Update: {
          id?: number;
          title?: string;
          body_content?: string;
          featured_image_url?: string | null;
          slug?: string;
          date?: string;
          excerpt?: string | null;
        };
      };
      gallery: {
        Row: {
          id: number;
          image_url: string;
          caption: string | null;
        };
        Insert: {
          id?: number;
          image_url: string;
          caption?: string | null;
        };
        Update: {
          id?: number;
          image_url?: string;
          caption?: string | null;
        };
      };
      settings: {
        Row: {
          id: number;
          background_color: string;
          site_title: string;
          site_description: string;
        };
        Insert: {
          id?: number;
          background_color: string;
          site_title: string;
          site_description: string;
        };
        Update: {
          id?: number;
          background_color?: string;
          site_title?: string;
          site_description?: string;
        };
      };
    };
  };
};

const supabaseUrl = 'https://enqplizqtwvquxliiygz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucXBsaXpxdHd2cXV4bGlpeWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3ODUwNDIsImV4cCI6MjA2MTM2MTA0Mn0.uWMxgXNWnrv-Kmc8rjuCRiasS1vTJ6fB0nkjVpuxGZs';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
