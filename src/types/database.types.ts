export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          appointment_date: string
          booking_reference: string
          cancellation_reason: string | null
          created_at: string
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_notes: string | null
          customer_phone: string
          end_time: string
          id: string
          service_id: string
          staff_id: string | null
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number
          updated_at: string
        }
        Insert: {
          appointment_date: string
          booking_reference: string
          cancellation_reason?: string | null
          created_at?: string
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_notes?: string | null
          customer_phone: string
          end_time: string
          id?: string
          service_id: string
          staff_id?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price: number
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          booking_reference?: string
          cancellation_reason?: string | null
          created_at?: string
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_notes?: string | null
          customer_phone?: string
          end_time?: string
          id?: string
          service_id?: string
          staff_id?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      business_content: {
        Row: {
          content: string | null
          id: string
          image_url: string | null
          is_published: boolean
          metadata: Json | null
          section_key: string
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          metadata?: Json | null
          section_key: string
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean
          metadata?: Json | null
          section_key?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_settings: {
        Row: {
          address: string
          advance_booking_days: number
          booking_buffer_minutes: number
          business_name: string
          cancellation_policy: string | null
          currency: string
          email: string
          id: string
          opening_hours: Json
          phone: string
          tagline: string | null
          timezone: string
          updated_at: string
          whatsapp_number: string | null
        }
        Insert: {
          address: string
          advance_booking_days?: number
          booking_buffer_minutes?: number
          business_name?: string
          cancellation_policy?: string | null
          currency?: string
          email: string
          id?: string
          opening_hours: Json
          phone: string
          tagline?: string | null
          timezone?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Update: {
          address?: string
          advance_booking_days?: number
          booking_buffer_minutes?: number
          business_name?: string
          cancellation_policy?: string | null
          currency?: string
          email?: string
          id?: string
          opening_hours?: Json
          phone?: string
          tagline?: string | null
          timezone?: string
          updated_at?: string
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          booking_id: string | null
          created_at: string
          delivery_status: Database["public"]["Enums"]["email_delivery_status"]
          email_type: string
          error_message: string | null
          id: string
          provider_message_id: string | null
          recipient_email: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          delivery_status?: Database["public"]["Enums"]["email_delivery_status"]
          email_type: string
          error_message?: string | null
          id?: string
          provider_message_id?: string | null
          recipient_email: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          delivery_status?: Database["public"]["Enums"]["email_delivery_status"]
          email_type?: string
          error_message?: string | null
          id?: string
          provider_message_id?: string | null
          recipient_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action: string
          id: string
          rate_key: string
          request_count: number
          window_start: string
        }
        Insert: {
          action: string
          id?: string
          rate_key: string
          request_count?: number
          window_start?: string
        }
        Update: {
          action?: string
          id?: string
          rate_key?: string
          request_count?: number
          window_start?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string
          display_order: number
          duration_minutes: number
          id: string
          image_url: string | null
          is_active: boolean
          long_description: string | null
          name: string
          price: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          duration_minutes: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          long_description?: string | null
          name: string
          price: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          duration_minutes?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          long_description?: string | null
          name?: string
          price?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string
          id: string
          is_active: boolean
          profile_id: string | null
          specialties: string[] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name: string
          id?: string
          is_active?: boolean
          profile_id?: string | null
          specialties?: string[] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          is_active?: boolean
          profile_id?: string | null
          specialties?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          created_at: string
          customer_name: string
          customer_title: string | null
          id: string
          is_published: boolean
          rating: number
          testimonial: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          customer_title?: string | null
          id?: string
          is_published?: boolean
          rating: number
          testimonial: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          customer_title?: string | null
          id?: string
          is_published?: boolean
          rating?: number
          testimonial?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_action: string
          p_key: string
          p_max_requests?: number
          p_window_seconds?: number
        }
        Returns: boolean
      }
      create_booking_atomic: {
        Args: {
          p_appointment_date: string
          p_customer_email: string
          p_customer_id?: string
          p_customer_name: string
          p_customer_notes?: string
          p_customer_phone: string
          p_service_id: string
          p_staff_id?: string
          p_start_time: string
        }
        Returns: Json
      }
      get_available_slots: {
        Args: { p_date: string; p_service_id: string; p_staff_id?: string }
        Returns: Json
      }
      get_user_role: {
        Args: { p_user_id?: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin_or_owner: { Args: never; Returns: boolean }
      is_owner: { Args: never; Returns: boolean }
    }
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "no_show"
      email_delivery_status: "pending" | "sent" | "failed"
      user_role: "customer" | "barber" | "manager" | "owner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
