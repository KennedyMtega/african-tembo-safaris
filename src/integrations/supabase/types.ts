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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string
          description: string | null
          entity_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          entity_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          entity_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      booking_travelers: {
        Row: {
          booking_id: string
          dietary_needs: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          special_needs: string | null
        }
        Insert: {
          booking_id: string
          dietary_needs?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          special_needs?: string | null
        }
        Update: {
          booking_id?: string
          dietary_needs?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          special_needs?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_travelers_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_ref: string
          created_at: string
          end_date: string
          id: string
          package_id: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          special_requests: string | null
          start_date: string
          status: Database["public"]["Enums"]["booking_status"]
          total_amount: number
          user_id: string
        }
        Insert: {
          booking_ref: string
          created_at?: string
          end_date: string
          id?: string
          package_id: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          special_requests?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount?: number
          user_id: string
        }
        Update: {
          booking_ref?: string
          created_at?: string
          end_date?: string
          id?: string
          package_id?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          special_requests?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_amount?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          country: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          package_count: number
          updated_at: string
        }
        Insert: {
          country: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          package_count?: number
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          package_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          priority: Database["public"]["Enums"]["inquiry_priority"]
          resolved_at: string | null
          status: Database["public"]["Enums"]["inquiry_status"]
          subject: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          priority?: Database["public"]["Enums"]["inquiry_priority"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          subject?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          priority?: Database["public"]["Enums"]["inquiry_priority"]
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["inquiry_status"]
          subject?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          entity_id: string | null
          id: string
          message: string | null
          read: boolean
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          id?: string
          message?: string | null
          read?: boolean
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          id?: string
          message?: string | null
          read?: boolean
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      package_itinerary: {
        Row: {
          accommodation: string | null
          created_at: string
          day_number: number
          description: string | null
          id: string
          meals: string[] | null
          package_id: string
          title: string
        }
        Insert: {
          accommodation?: string | null
          created_at?: string
          day_number: number
          description?: string | null
          id?: string
          meals?: string[] | null
          package_id: string
          title: string
        }
        Update: {
          accommodation?: string | null
          created_at?: string
          day_number?: number
          description?: string | null
          id?: string
          meals?: string[] | null
          package_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_itinerary_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string
          description: string | null
          destination_id: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          duration: number
          excludes: string[] | null
          featured: boolean
          group_price_max: number | null
          group_price_min: number | null
          highlights: string[] | null
          id: string
          images: string[] | null
          includes: string[] | null
          max_group_size: number
          price_max: number
          price_min: number
          rating: number
          review_count: number
          short_description: string | null
          slug: string
          status: Database["public"]["Enums"]["package_status"]
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          destination_id?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          duration?: number
          excludes?: string[] | null
          featured?: boolean
          group_price_max?: number | null
          group_price_min?: number | null
          highlights?: string[] | null
          id?: string
          images?: string[] | null
          includes?: string[] | null
          max_group_size?: number
          price_max?: number
          price_min?: number
          rating?: number
          review_count?: number
          short_description?: string | null
          slug: string
          status?: Database["public"]["Enums"]["package_status"]
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          destination_id?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          duration?: number
          excludes?: string[] | null
          featured?: boolean
          group_price_max?: number | null
          group_price_min?: number | null
          highlights?: string[] | null
          id?: string
          images?: string[] | null
          includes?: string[] | null
          max_group_size?: number
          price_max?: number
          price_min?: number
          rating?: number
          review_count?: number
          short_description?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["package_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "packages_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          booking_ref: string | null
          created_at: string
          currency: string
          id: string
          method: string | null
          paid_at: string | null
          status: Database["public"]["Enums"]["payment_status"]
        }
        Insert: {
          amount?: number
          booking_id: string
          booking_ref?: string | null
          created_at?: string
          currency?: string
          id?: string
          method?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Update: {
          amount?: number
          booking_id?: string
          booking_ref?: string | null
          created_at?: string
          currency?: string
          id?: string
          method?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
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
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          featured: boolean
          id: string
          package_id: string
          rating: number
          status: Database["public"]["Enums"]["review_status"]
          text: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          featured?: boolean
          id?: string
          package_id: string
          rating?: number
          status?: Database["public"]["Enums"]["review_status"]
          text?: string | null
          title?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          featured?: boolean
          id?: string
          package_id?: string
          rating?: number
          status?: Database["public"]["Enums"]["review_status"]
          text?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
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
      wishlists: {
        Row: {
          created_at: string
          id: string
          package_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          package_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          package_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
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
      app_role: "admin" | "user"
      booking_status: "pending" | "confirmed" | "completed" | "cancelled"
      difficulty_level: "easy" | "moderate" | "challenging"
      inquiry_priority: "low" | "medium" | "high"
      inquiry_status: "new" | "in_progress" | "resolved"
      package_status: "draft" | "published" | "archived"
      payment_status: "pending" | "paid" | "refunded"
      review_status: "pending" | "approved" | "rejected"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "user"],
      booking_status: ["pending", "confirmed", "completed", "cancelled"],
      difficulty_level: ["easy", "moderate", "challenging"],
      inquiry_priority: ["low", "medium", "high"],
      inquiry_status: ["new", "in_progress", "resolved"],
      package_status: ["draft", "published", "archived"],
      payment_status: ["pending", "paid", "refunded"],
      review_status: ["pending", "approved", "rejected"],
    },
  },
} as const
