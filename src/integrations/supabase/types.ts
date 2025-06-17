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
      admin_notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          notification_type: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          notification_type: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          notification_type?: string
        }
        Relationships: []
      }
      casual_plan_interests: {
        Row: {
          created_at: string
          id: string
          plan_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          plan_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_casual_plan_interests_plan_id"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "casual_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      casual_plan_rsvps: {
        Row: {
          created_at: string
          id: string
          plan_id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          plan_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "casual_plan_attendees_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "casual_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      casual_plans: {
        Row: {
          created_at: string
          creator_id: string
          date: string
          description: string | null
          id: string
          location: string
          location_coordinates: string | null
          max_attendees: number | null
          time: string
          title: string
          updated_at: string
          vibe: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          date: string
          description?: string | null
          id?: string
          location: string
          location_coordinates?: string | null
          max_attendees?: number | null
          time: string
          title: string
          updated_at?: string
          vibe: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          date?: string
          description?: string | null
          id?: string
          location?: string
          location_coordinates?: string | null
          max_attendees?: number | null
          time?: string
          title?: string
          updated_at?: string
          vibe?: string
        }
        Relationships: []
      }
      creator_requests: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          reason: string | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          reason?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      event_categories: {
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
          {
            foreignKeyName: "event_rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
            referencedRelation: "event_categories"
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
          area: string | null
          booking_link: string | null
          coordinates: unknown | null
          created_at: string | null
          created_by: string | null
          creator: string | null
          description: string | null
          destination: string | null
          end_date: string | null
          end_time: string | null
          event_category: string | null
          "Extra info": string | null
          fee: string | null
          fixed_start_time: boolean | null
          google_maps: string | null
          id: string
          image_urls: string | null
          organiser_name: string | null
          organizer_email_internal: string | null
          organizer_link: string | null
          recurring_count: number | null
          slug: string | null
          start_date: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["event_status"] | null
          tags: string | null
          title: string | null
          updated_at: string | null
          venue_id: string | null
          vibe: string | null
        }
        Insert: {
          area?: string | null
          booking_link?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          created_by?: string | null
          creator?: string | null
          description?: string | null
          destination?: string | null
          end_date?: string | null
          end_time?: string | null
          event_category?: string | null
          "Extra info"?: string | null
          fee?: string | null
          fixed_start_time?: boolean | null
          google_maps?: string | null
          id?: string
          image_urls?: string | null
          organiser_name?: string | null
          organizer_email_internal?: string | null
          organizer_link?: string | null
          recurring_count?: number | null
          slug?: string | null
          start_date?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          tags?: string | null
          title?: string | null
          updated_at?: string | null
          venue_id?: string | null
          vibe?: string | null
        }
        Update: {
          area?: string | null
          booking_link?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          created_by?: string | null
          creator?: string | null
          description?: string | null
          destination?: string | null
          end_date?: string | null
          end_time?: string | null
          event_category?: string | null
          "Extra info"?: string | null
          fee?: string | null
          fixed_start_time?: boolean | null
          google_maps?: string | null
          id?: string
          image_urls?: string | null
          organiser_name?: string | null
          organizer_email_internal?: string | null
          organizer_link?: string | null
          recurring_count?: number | null
          slug?: string | null
          start_date?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["event_status"] | null
          tags?: string | null
          title?: string | null
          updated_at?: string | null
          venue_id?: string | null
          vibe?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_creator_fkey"
            columns: ["creator"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_creator_fkey1"
            columns: ["creator"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_event_category_fkey1"
            columns: ["event_category"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_venue_id_fkey1"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_vibe_fkey1"
            columns: ["vibe"]
            isOneToOne: false
            referencedRelation: "event_vibe"
            referencedColumns: ["name"]
          },
        ]
      }
      events3: {
        Row: {
          booking_link: string | null
          created_at: string | null
          creator: string | null
          description: string | null
          destination: string | null
          end_date: string | null
          end_time: string | null
          event_category: string | null
          extra_info: string | null
          fee: number | null
          fixed_start_time: boolean
          id: string
          image_urls: string | null
          organiser_name: string | null
          organizer_email_internal: string | null
          organizer_link: string | null
          slug: string | null
          start_date: string | null
          start_time: string | null
          status: Database["public"]["Enums"]["event_status"]
          tags: string[] | null
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
          end_date?: string | null
          end_time?: string | null
          event_category?: string | null
          extra_info?: string | null
          fee?: number | null
          fixed_start_time?: boolean
          id?: string
          image_urls?: string | null
          organiser_name?: string | null
          organizer_email_internal?: string | null
          organizer_link?: string | null
          slug?: string | null
          start_date?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          tags?: string[] | null
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
          end_date?: string | null
          end_time?: string | null
          event_category?: string | null
          extra_info?: string | null
          fee?: number | null
          fixed_start_time?: boolean
          id?: string
          image_urls?: string | null
          organiser_name?: string | null
          organizer_email_internal?: string | null
          organizer_link?: string | null
          slug?: string | null
          start_date?: string | null
          start_time?: string | null
          status?: Database["public"]["Enums"]["event_status"]
          tags?: string[] | null
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
            foreignKeyName: "events_event_category_fkey"
            columns: ["event_category"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_vibe_fkey"
            columns: ["vibe"]
            isOneToOne: false
            referencedRelation: "event_vibe"
            referencedColumns: ["name"]
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
      locations: {
        Row: {
          accessibility_info: string | null
          amenities_list: string | null
          country: string | null
          created_at: string
          general_description: string | null
          id: number
          is_curated: boolean
          key_surf_spots: string | null
          last_scraped_date: string | null
          local_vibe: string | null
          official_links: string[] | null
          primary_image_url: string | null
          scraped_sources: string[] | null
          surf_characteristics: string | null
          town_name: string
        }
        Insert: {
          accessibility_info?: string | null
          amenities_list?: string | null
          country?: string | null
          created_at?: string
          general_description?: string | null
          id?: number
          is_curated?: boolean
          key_surf_spots?: string | null
          last_scraped_date?: string | null
          local_vibe?: string | null
          official_links?: string[] | null
          primary_image_url?: string | null
          scraped_sources?: string[] | null
          surf_characteristics?: string | null
          town_name: string
        }
        Update: {
          accessibility_info?: string | null
          amenities_list?: string | null
          country?: string | null
          created_at?: string
          general_description?: string | null
          id?: number
          is_curated?: boolean
          key_surf_spots?: string | null
          last_scraped_date?: string | null
          local_vibe?: string | null
          official_links?: string[] | null
          primary_image_url?: string | null
          scraped_sources?: string[] | null
          surf_characteristics?: string | null
          town_name?: string
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
      user_notification_settings: {
        Row: {
          created_at: string
          event_invitations: boolean
          event_reminders: boolean
          event_updates: boolean
          friend_requests: boolean
          id: string
          new_messages: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_invitations?: boolean
          event_reminders?: boolean
          event_updates?: boolean
          friend_requests?: boolean
          id?: string
          new_messages?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_invitations?: boolean
          event_reminders?: boolean
          event_updates?: boolean
          friend_requests?: boolean
          id?: string
          new_messages?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_privacy_settings: {
        Row: {
          allow_tagging: boolean | null
          created_at: string
          id: string
          public_profile: boolean | null
          share_activity_with_friends: boolean | null
          show_event_attendance: boolean | null
          show_rsvp_status: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          allow_tagging?: boolean | null
          created_at?: string
          id?: string
          public_profile?: boolean | null
          share_activity_with_friends?: boolean | null
          show_event_attendance?: boolean | null
          show_rsvp_status?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          allow_tagging?: boolean | null
          created_at?: string
          id?: string
          public_profile?: boolean | null
          share_activity_with_friends?: boolean | null
          show_event_attendance?: boolean | null
          show_rsvp_status?: boolean | null
          updated_at?: string
          user_id?: string
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
          creator_id: string | null
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
          creator_id?: string | null
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
          creator_id?: string | null
          google_maps?: string | null
          id?: string
          name?: string | null
          postal_code?: string | null
          slug?: string | null
          street?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "venues_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      event_source_type: "Submitted" | "Scraped"
      event_status: "draft" | "pending_approval" | "published" | "rejected"
      request_status: "pending" | "approved" | "rejected"
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
    Enums: {
      event_source_type: ["Submitted", "Scraped"],
      event_status: ["draft", "pending_approval", "published", "rejected"],
      request_status: ["pending", "approved", "rejected"],
    },
  },
} as const
