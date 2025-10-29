import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          user_id: string;
          wallet_address: string | null;
          name: string;
          phone: string;
          email: string | null;
          blood_type: string | null;
          photo: string | null;
          emergency_contacts: any;
          medical_info: string | null;
          digital_id: string;
          qr_code: string | null;
          created_at: string;
          last_active: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      emergencies: {
        Row: {
          id: string;
          alert_id: string;
          user_id: string;
          user_name: string;
          user_phone: string;
          timestamp: string;
          location: any;
          type: string;
          status: string;
          police_notified: boolean;
          ambulance_notified: boolean;
          verified_by: string | null;
          verified_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['emergencies']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['emergencies']['Insert']>;
      };
      efirs: {
        Row: {
          id: string;
          fir_id: string;
          user_id: string;
          title: string;
          description: string;
          incident_date: string;
          location: any;
          evidence: any;
          status: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['efirs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['efirs']['Insert']>;
      };
      nfts: {
        Row: {
          id: string;
          nft_id: string;
          user_id: string;
          type: string;
          metadata: any;
          minted: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['nfts']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['nfts']['Insert']>;
      };
    };
  };
}
