
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
          seo_title: string;
          seo_description: string;
        };
        Insert: {
          id?: number;
          page_name: string;
          title: string;
          content: string;
          seo_title?: string;
          seo_description?: string;
        };
        Update: {
          id?: number;
          page_name?: string;
          title?: string;
          content?: string;
          seo_title?: string;
          seo_description?: string;
        };
      };
      products: {
        Row: {
          id: number;
          product_name: string;
          description: string;
          category_name: string;
          gallery_images: { url: string; caption: string }[];
        };
        Insert: {
          id?: number;
          product_name: string;
          description: string;
          category_name: string;
          gallery_images?: { url: string; caption: string }[];
        };
        Update: {
          id?: number;
          product_name?: string;
          description?: string;
          category_name?: string;
          gallery_images?: { url: string; caption: string }[];
        };
      };
      blogs: {
        Row: {
          id: number;
          title: string;
          body_content: string;
          featured_image_url: string;
          slug: string;
          date: string;
          excerpt: string;
        };
        Insert: {
          id?: number;
          title: string;
          body_content: string;
          featured_image_url?: string;
          slug: string;
          date: string;
          excerpt?: string;
        };
        Update: {
          id?: number;
          title?: string;
          body_content?: string;
          featured_image_url?: string;
          slug?: string;
          date?: string;
          excerpt?: string;
        };
      };
      gallery: {
        Row: {
          id: number;
          image_url: string;
          caption: string;
        };
        Insert: {
          id?: number;
          image_url: string;
          caption?: string;
        };
        Update: {
          id?: number;
          image_url?: string;
          caption?: string;
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
