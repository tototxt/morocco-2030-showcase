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
      matches: {
        Row: {
          available_seats: number
          away_team: string
          city: string
          created_at: string
          home_team: string
          id: string
          match_date: string
          stadium: string
          stage: string
          total_seats: number
        }
        Insert: {
          available_seats?: number
          away_team: string
          city: string
          created_at?: string
          home_team: string
          id?: string
          match_date: string
          stadium: string
          stage?: string
          total_seats?: number
        }
        Update: {
          available_seats?: number
          away_team?: string
          city?: string
          created_at?: string
          home_team?: string
          id?: string
          match_date?: string
          stadium?: string
          stage?: string
          total_seats?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          block: string
          category_name: string
          created_at: string
          holder_email: string
          holder_name: string
          id: string
          match_id: string
          payment_method: string
          payment_status: string
          price: number
          row_number: string
          seat_id: string
          seat_number: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          block: string
          category_name: string
          created_at?: string
          holder_email: string
          holder_name: string
          id?: string
          match_id: string
          payment_method: string
          payment_status?: string
          price: number
          row_number: string
          seat_id: string
          seat_number: string
          ticket_id: string
          user_id: string
        }
        Update: {
          block?: string
          category_name?: string
          created_at?: string
          holder_email?: string
          holder_name?: string
          id?: string
          match_id?: string
          payment_method?: string
          payment_status?: string
          price?: number
          row_number?: string
          seat_id?: string
          seat_number?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_seat_id_fkey"
            columns: ["seat_id"]
            isOneToOne: false
            referencedRelation: "seats"
            referencedColumns: ["id"]
          },
        ]
      }
      seats: {
        Row: {
          block: string
          category_id: string
          created_at: string
          id: string
          match_id: string
          price: number
          reserved_by: string | null
          reserved_until: string | null
          row_number: string
          seat_number: string
          status: string
        }
        Insert: {
          block: string
          category_id: string
          created_at?: string
          id?: string
          match_id: string
          price: number
          reserved_by?: string | null
          reserved_until?: string | null
          row_number: string
          seat_number: string
          status?: string
        }
        Update: {
          block?: string
          category_id?: string
          created_at?: string
          id?: string
          match_id?: string
          price?: number
          reserved_by?: string | null
          reserved_until?: string | null
          row_number?: string
          seat_number?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "seats_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "ticket_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_categories: {
        Row: {
          color: string
          description: string | null
          id: string
          max_price: number
          min_price: number
          name: string
        }
        Insert: {
          color?: string
          description?: string | null
          id?: string
          max_price: number
          min_price: number
          name: string
        }
        Update: {
          color?: string
          description?: string | null
          id?: string
          max_price?: number
          min_price?: number
          name?: string
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
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      virtual_cards: {
        Row: {
          balance: number
          card_number_hash: string
          created_at: string
          currency: string
          expiry_date: string
          id: string
          masked_card_number: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          card_number_hash: string
          created_at?: string
          currency?: string
          expiry_date?: string
          id?: string
          masked_card_number?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          card_number_hash?: string
          created_at?: string
          currency?: string
          expiry_date?: string
          id?: string
          masked_card_number?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      virtual_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          card_id: string
          created_at: string
          description: string | null
          id: string
          reference: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          card_id: string
          created_at?: string
          description?: string | null
          id?: string
          reference: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          card_id?: string
          created_at?: string
          description?: string | null
          id?: string
          reference?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "virtual_transactions_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "virtual_cards"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_ticket_count: { Args: { _user_id: string }; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      process_virtual_payment: {
        Args: {
          p_amount: number
          p_card_number: string
          p_cvv: string
          p_description?: string
          p_expiry: string
          p_reference: string
          p_user_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    },
  },
} as const
