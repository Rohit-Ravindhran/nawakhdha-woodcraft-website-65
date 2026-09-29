export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      about_team: {
        Row: {
          alt_text: string | null
          bio: string | null
          id: string
          image_url: string | null
          name: string | null
          position: number | null
          role: string | null
        }
        Insert: {
          alt_text?: string | null
          bio?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          position?: number | null
          role?: string | null
        }
        Update: {
          alt_text?: string | null
          bio?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          position?: number | null
          role?: string | null
        }
        Relationships: []
      }
      blogs: {
        Row: {
          alt_text: string | null
          body_content: string | null
          content: string | null
          date: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          image_url: string | null
          slug: string | null
          title: string | null
        }
        Insert: {
          alt_text?: string | null
          body_content?: string | null
          content?: string | null
          date?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          image_url?: string | null
          slug?: string | null
          title?: string | null
        }
        Update: {
          alt_text?: string | null
          body_content?: string | null
          content?: string | null
          date?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          image_url?: string | null
          slug?: string | null
          title?: string | null
        }
        Relationships: []
      }
      contact_form_submissions: {
        Row: {
          email: string | null
          id: string
          message: string | null
          name: string | null
          phone: string | null
          subject: string | null
          submitted_at: string | null
        }
        Insert: {
          email?: string | null
          id?: string
          message?: string | null
          name?: string | null
          phone?: string | null
          subject?: string | null
          submitted_at?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          message?: string | null
          name?: string | null
          phone?: string | null
          subject?: string | null
          submitted_at?: string | null
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          address: string | null
          business_hours_json: Json | null
          email: string | null
          id: string
          map_url: string | null
          phone: string | null
        }
        Insert: {
          address?: string | null
          business_hours_json?: Json | null
          email?: string | null
          id?: string
          map_url?: string | null
          phone?: string | null
        }
        Update: {
          address?: string | null
          business_hours_json?: Json | null
          email?: string | null
          id?: string
          map_url?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      content_change_requests: {
        Row: {
          applied_at: string | null
          can_rollback: boolean | null
          change_reason: string | null
          content_type: string
          created_at: string
          current_content: string
          id: string
          original_content_before_change: string | null
          page_slug: string
          page_title: string
          proposed_content: string
          reviewed_at: string | null
          reviewed_by: string | null
          rollback_of_request_id: string | null
          scheduled_publish_at: string | null
          section_identifier: string
          seo_keywords_added: string[] | null
          status: string
        }
        Insert: {
          applied_at?: string | null
          can_rollback?: boolean | null
          change_reason?: string | null
          content_type: string
          created_at?: string
          current_content: string
          id?: string
          original_content_before_change?: string | null
          page_slug: string
          page_title: string
          proposed_content: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          rollback_of_request_id?: string | null
          scheduled_publish_at?: string | null
          section_identifier: string
          seo_keywords_added?: string[] | null
          status?: string
        }
        Update: {
          applied_at?: string | null
          can_rollback?: boolean | null
          change_reason?: string | null
          content_type?: string
          created_at?: string
          current_content?: string
          id?: string
          original_content_before_change?: string | null
          page_slug?: string
          page_title?: string
          proposed_content?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          rollback_of_request_id?: string | null
          scheduled_publish_at?: string | null
          section_identifier?: string
          seo_keywords_added?: string[] | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_change_requests_rollback_of_request_id_fkey"
            columns: ["rollback_of_request_id"]
            isOneToOne: false
            referencedRelation: "content_change_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      home_blog_cards: {
        Row: {
          alt_text: string | null
          description: string | null
          id: string
          image_url: string | null
          slug: string | null
          title: string | null
        }
        Insert: {
          alt_text?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          slug?: string | null
          title?: string | null
        }
        Update: {
          alt_text?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          slug?: string | null
          title?: string | null
        }
        Relationships: []
      }
      home_products: {
        Row: {
          alt_text: string | null
          category_name: string | null
          id: string
          image_url: string | null
          slug: string | null
        }
        Insert: {
          alt_text?: string | null
          category_name?: string | null
          id?: string
          image_url?: string | null
          slug?: string | null
        }
        Update: {
          alt_text?: string | null
          category_name?: string | null
          id?: string
          image_url?: string | null
          slug?: string | null
        }
        Relationships: []
      }
      home_services: {
        Row: {
          alt_text: string | null
          description: string | null
          id: string
          image_url: string | null
          title: string | null
        }
        Insert: {
          alt_text?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          title?: string | null
        }
        Update: {
          alt_text?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          title?: string | null
        }
        Relationships: []
      }
      maintenance_categories: {
        Row: {
          alt_text: string | null
          category_image_url: string | null
          category_name: string | null
          category_slug: string | null
          created_at: string
          id: string
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          service_name: string | null
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          category_image_url?: string | null
          category_name?: string | null
          category_slug?: string | null
          created_at?: string
          id?: string
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          service_name?: string | null
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          category_image_url?: string | null
          category_name?: string | null
          category_slug?: string | null
          created_at?: string
          id?: string
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          service_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      maintenance_category_details: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          service_name: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          service_name?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          service_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_category_details_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "maintenance_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_gallery: {
        Row: {
          alt_text: string | null
          caption: string | null
          category_id: string | null
          created_at: string
          id: string
          image_url: string | null
          position: number | null
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          category_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          position?: number | null
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          category_id?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          position?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_gallery_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "maintenance_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      page_content: {
        Row: {
          content_type: string
          content_value: string
          created_at: string
          id: string
          page_slug: string
          section_identifier: string
          updated_at: string
        }
        Insert: {
          content_type: string
          content_value: string
          created_at?: string
          id?: string
          page_slug: string
          section_identifier: string
          updated_at?: string
        }
        Update: {
          content_type?: string
          content_value?: string
          created_at?: string
          id?: string
          page_slug?: string
          section_identifier?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_content_analysis: {
        Row: {
          brand_voice_analysis: Json | null
          business_context: Json | null
          created_at: string
          current_content_snapshot: Json
          id: string
          key_services: string[] | null
          last_analyzed_at: string
          page_slug: string
          target_keywords: string[] | null
          updated_at: string
        }
        Insert: {
          brand_voice_analysis?: Json | null
          business_context?: Json | null
          created_at?: string
          current_content_snapshot: Json
          id?: string
          key_services?: string[] | null
          last_analyzed_at?: string
          page_slug: string
          target_keywords?: string[] | null
          updated_at?: string
        }
        Update: {
          brand_voice_analysis?: Json | null
          business_context?: Json | null
          created_at?: string
          current_content_snapshot?: Json
          id?: string
          key_services?: string[] | null
          last_analyzed_at?: string
          page_slug?: string
          target_keywords?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          hero: string | null
          id: string
          page_name: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
        }
        Insert: {
          hero?: string | null
          id?: string
          page_name?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
        }
        Update: {
          hero?: string | null
          id?: string
          page_name?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          alt_text: string | null
          category_image_url: string | null
          category_name: string | null
          category_slug: string | null
          id: string
          product_name: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
        }
        Insert: {
          alt_text?: string | null
          category_image_url?: string | null
          category_name?: string | null
          category_slug?: string | null
          id?: string
          product_name?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
        }
        Update: {
          alt_text?: string | null
          category_image_url?: string | null
          category_name?: string | null
          category_slug?: string | null
          id?: string
          product_name?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
        }
        Relationships: []
      }
      product_category_details: {
        Row: {
          category_id: string | null
          description: string | null
          id: string
          product_name: string | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
        }
        Insert: {
          category_id?: string | null
          description?: string | null
          id?: string
          product_name?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
        }
        Update: {
          category_id?: string | null
          description?: string | null
          id?: string
          product_name?: string | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_category_details_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_gallery: {
        Row: {
          alt_text: string | null
          caption: string | null
          category_id: string | null
          id: string
          image_url: string | null
          position: number | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          category_id?: string | null
          id?: string
          image_url?: string | null
          position?: number | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          category_id?: string | null
          id?: string
          image_url?: string | null
          position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_gallery_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      projects_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          id: string
          image_url: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          page_slug: string
          position: number | null
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          page_slug?: string
          position?: number | null
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          page_slug?: string
          position?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      projects_videos: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          id: string
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          page_slug: string
          position: number | null
          updated_at: string
          video_url: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          page_slug?: string
          position?: number | null
          updated_at?: string
          video_url: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          id?: string
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          page_slug?: string
          position?: number | null
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
