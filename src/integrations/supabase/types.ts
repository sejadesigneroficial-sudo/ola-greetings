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
      admin_users: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          apk_filename: string | null
          apk_url: string | null
          apk_version: string | null
          created_at: string
          id: string
          updated_at: string
        }
        Insert: {
          apk_filename?: string | null
          apk_url?: string | null
          apk_version?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Update: {
          apk_filename?: string | null
          apk_url?: string | null
          apk_version?: string | null
          created_at?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      arremates: {
        Row: {
          created_at: string | null
          date_won: string | null
          documentation_url: string | null
          final_value: number
          id: string
          product_title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date_won?: string | null
          documentation_url?: string | null
          final_value: number
          id?: string
          product_title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          date_won?: string | null
          documentation_url?: string | null
          final_value?: number
          id?: string
          product_title?: string
          user_id?: string
        }
        Relationships: []
      }
      banners: {
        Row: {
          created_at: string | null
          cta_text: string | null
          display_order: number | null
          highlight_text: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cta_text?: string | null
          display_order?: number | null
          highlight_text?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cta_text?: string | null
          display_order?: number | null
          highlight_text?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          bid_value: number
          buyer_cpf: string
          buyer_email: string | null
          buyer_name: string
          buyer_phone: string | null
          contract_number: string
          created_at: string
          deposit_value: number | null
          freight_value: number | null
          id: string
          invoice_generated: boolean | null
          invoice_generated_at: string | null
          invoice_number: string | null
          payment_type: string
          remaining_value: number | null
          seller_cnpj: string
          seller_name: string
          total_value: number
          updated_at: string
          vehicle_description: string | null
          vehicle_lot_number: string | null
        }
        Insert: {
          bid_value?: number
          buyer_cpf: string
          buyer_email?: string | null
          buyer_name: string
          buyer_phone?: string | null
          contract_number: string
          created_at?: string
          deposit_value?: number | null
          freight_value?: number | null
          id?: string
          invoice_generated?: boolean | null
          invoice_generated_at?: string | null
          invoice_number?: string | null
          payment_type: string
          remaining_value?: number | null
          seller_cnpj: string
          seller_name: string
          total_value?: number
          updated_at?: string
          vehicle_description?: string | null
          vehicle_lot_number?: string | null
        }
        Update: {
          bid_value?: number
          buyer_cpf?: string
          buyer_email?: string | null
          buyer_name?: string
          buyer_phone?: string | null
          contract_number?: string
          created_at?: string
          deposit_value?: number | null
          freight_value?: number | null
          id?: string
          invoice_generated?: boolean | null
          invoice_generated_at?: string | null
          invoice_number?: string | null
          payment_type?: string
          remaining_value?: number | null
          seller_cnpj?: string
          seller_name?: string
          total_value?: number
          updated_at?: string
          vehicle_description?: string | null
          vehicle_lot_number?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          bid_increment: number | null
          category: string | null
          closing_date: string | null
          created_at: string | null
          current_bid: number | null
          description: string | null
          hour_meter: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          location: string | null
          lot_number: string | null
          manufacturer: string | null
          model: string | null
          opening_date: string | null
          quilometragem: string | null
          serial_number: string | null
          starting_bid: number | null
          title: string
          updated_at: string | null
          views: number | null
          year: number | null
        }
        Insert: {
          bid_increment?: number | null
          category?: string | null
          closing_date?: string | null
          created_at?: string | null
          current_bid?: number | null
          description?: string | null
          hour_meter?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string | null
          lot_number?: string | null
          manufacturer?: string | null
          model?: string | null
          opening_date?: string | null
          quilometragem?: string | null
          serial_number?: string | null
          starting_bid?: number | null
          title: string
          updated_at?: string | null
          views?: number | null
          year?: number | null
        }
        Update: {
          bid_increment?: number | null
          category?: string | null
          closing_date?: string | null
          created_at?: string | null
          current_bid?: number | null
          description?: string | null
          hour_meter?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          location?: string | null
          lot_number?: string | null
          manufacturer?: string | null
          model?: string | null
          opening_date?: string | null
          quilometragem?: string | null
          serial_number?: string | null
          starting_bid?: number | null
          title?: string
          updated_at?: string | null
          views?: number | null
          year?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          cpf: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cpf?: string | null
          created_at?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cpf?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          address: string | null
          colors: Json | null
          created_at: string | null
          edital: Json | null
          email: string | null
          financing_link: string | null
          footer: Json | null
          homepage: Json | null
          id: string
          leiloes_page: Json | null
          phone: string | null
          social_media: Json | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          address?: string | null
          colors?: Json | null
          created_at?: string | null
          edital?: Json | null
          email?: string | null
          financing_link?: string | null
          footer?: Json | null
          homepage?: Json | null
          id?: string
          leiloes_page?: Json | null
          phone?: string | null
          social_media?: Json | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          address?: string | null
          colors?: Json | null
          created_at?: string | null
          edital?: Json | null
          email?: string | null
          financing_link?: string | null
          footer?: Json | null
          homepage?: Json | null
          id?: string
          leiloes_page?: Json | null
          phone?: string | null
          social_media?: Json | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      user_status: "active" | "blocked"
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
      user_status: ["active", "blocked"],
    },
  },
} as const
