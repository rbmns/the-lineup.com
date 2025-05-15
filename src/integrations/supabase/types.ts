export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_notification_settings: {
        Row: {
          created_at: string
          email_notifications: boolean | null
          id: string
          notify_on_signup: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          notify_on_signup?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean | null
          id?: string
          notify_on_signup?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event_rsvps: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_types: {
        Row: {
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      event_types_tags: {
        Row: {
          created_at: string
          event_type: string | null
          id: number
          tag: string | null
        }
        Insert: {
          created_at?: string
          event_type?: string | null
          id?: number
          tag?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string | null
          id?: number
          tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_types_tags_event_type_fkey"
            columns: ["event_type"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "event_types_tags_tag_fkey"
            columns: ["tag"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      event_vibe: {
        Row: {
          created_at: string
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          booking_link: string | null
          created_at: string | null
          creator: string | null
          description: string | null
          destination: string | null
          end_time: string | null
          event_type: string | null
          "Extra info": string | null
          fee: number | null
          id: string
          image_urls: string[] | null
          organiser_name: string | null
          organizer_link: string | null
          slug: string | null
          start_date: string | null
          start_time: string | null
          tags: string | null
          title: string
          updated_at: string | null
          venue_id: string | null
          vibe: string | null
        }
        Insert: {
          booking_link?: string | null
          created_at?: string | null
          creator?: string | null
          description?: string | null
          destination?: string | null
          end_time?: string | null
          event_type?: string | null
          "Extra info"?: string | null
          fee?: number | null
          id?: string
          image_urls?: string[] | null
          organiser_name?: string | null
          organizer_link?: string | null
          slug?: string | null
          start_date?: string | null
          start_time?: string | null
          tags?: string | null
          title: string
          updated_at?: string | null
          venue_id?: string | null
          vibe?: string | null
        }
        Update: {
          booking_link?: string | null
          created_at?: string | null
          creator?: string | null
          description?: string | null
          destination?: string | null
          end_time?: string | null
          event_type?: string | null
          "Extra info"?: string | null
          fee?: number | null
          id?: string
          image_urls?: string[] | null
          organiser_name?: string | null
          organizer_link?: string | null
          slug?: string | null
          start_date?: string | null
          start_time?: string | null
          tags?: string | null
          title?: string
          updated_at?: string | null
          venue_id?: string | null
          vibe?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_creator_fkey"
            columns: ["creator"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_event_type_fkey"
            columns: ["event_type"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      friendships: {
        Row: {
          created_at: string | null
          friend_id: string | null
          id: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          friend_id?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          friend_id?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string[] | null
          created_at: string | null
          email: string | null
          id: string
          location: string | null
          location_category: string | null
          location_coordinates: string | null
          location_lat: number | null
          location_long: number | null
          status: string | null
          status_details: string | null
          tagline: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string[] | null
          created_at?: string | null
          email?: string | null
          id: string
          location?: string | null
          location_category?: string | null
          location_coordinates?: string | null
          location_lat?: number | null
          location_long?: number | null
          status?: string | null
          status_details?: string | null
          tagline?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string[] | null
          created_at?: string | null
          email?: string | null
          id?: string
          location?: string | null
          location_category?: string | null
          location_coordinates?: string | null
          location_lat?: number | null
          location_long?: number | null
          status?: string | null
          status_details?: string | null
          tagline?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      search_tracking: {
        Row: {
          clicked: boolean | null
          id: string
          query: string
          result_id: string | null
          result_type: string | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          clicked?: boolean | null
          id?: string
          query: string
          result_id?: string | null
          result_type?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          clicked?: boolean | null
          id?: string
          query?: string
          result_id?: string | null
          result_type?: string | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      seo_metadata: {
        Row: {
          author: string | null
          created_at: string
          description: string
          favicon_url: string | null
          id: string
          keywords: string | null
          og_image_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          created_at?: string
          description?: string
          favicon_url?: string | null
          id?: string
          keywords?: string | null
          og_image_url?: string | null
          title?: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          created_at?: string
          description?: string
          favicon_url?: string | null
          id?: string
          keywords?: string | null
          og_image_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      test: {
        Row: {
          created_at: string | null
          creator: string | null
          description: string | null
          end_time: string | null
          event_type: string | null
          "Extra info": string | null
          fee: string | null
          id: string | null
          image_urls: string | null
          organizer_link: string | null
          start_time: string | null
          title: string | null
          updated_at: string | null
          venue_id: string | null
        }
        Insert: {
          created_at?: string | null
          creator?: string | null
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          "Extra info"?: string | null
          fee?: string | null
          id?: string | null
          image_urls?: string | null
          organizer_link?: string | null
          start_time?: string | null
          title?: string | null
          updated_at?: string | null
          venue_id?: string | null
        }
        Update: {
          created_at?: string | null
          creator?: string | null
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          "Extra info"?: string | null
          fee?: string | null
          id?: string | null
          image_urls?: string | null
          organizer_link?: string | null
          start_time?: string | null
          title?: string | null
          updated_at?: string | null
          venue_id?: string | null
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          anonymous_id: string | null
          created_at: string
          event_data: Json | null
          event_name: string
          id: string
          ip_address: string | null
          page_url: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          event_data?: Json | null
          event_name: string
          id?: string
          ip_address?: string | null
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          event_data?: Json | null
          event_name?: string
          id?: string
          ip_address?: string | null
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          city: string | null
          created_at: string | null
          google_maps: string | null
          id: string
          name: string | null
          postal_code: string | null
          slug: string | null
          street: string | null
          website: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          google_maps?: string | null
          id?: string
          name?: string | null
          postal_code?: string | null
          slug?: string | null
          street?: string | null
          website?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          google_maps?: string | null
          id?: string
          name?: string | null
          postal_code?: string | null
          slug?: string | null
          street?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      event_rsvp_counts: {
        Row: {
          event_id: string | null
          rsvp_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvp_status_counts: {
        Row: {
          count: number | null
          event_id: string | null
          status: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      has_role: {
        Args: { user_id: string; role_name: string }
        Returns: boolean
      }
      upload_avatar_to_github: {
        Args: { profile_id: number; avatar_data: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
