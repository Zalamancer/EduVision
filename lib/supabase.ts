import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder";

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string; name: string | null; avatar_url: string | null; created_at: string };
        Insert: { id: string; email: string; name?: string; avatar_url?: string };
        Update: { name?: string; avatar_url?: string };
      };
      circuits: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          circuit_json: string;
          created_at: string;
          updated_at: string;
        };
        Insert: { user_id: string; name: string; circuit_json: string };
        Update: { name?: string; circuit_json?: string; updated_at?: string };
      };
      episodes: {
        Row: {
          id: string;
          chapter: number;
          episode: number;
          title: string;
          description: string;
          duration_seconds: number;
          video_url: string | null;
          thumbnail_url: string | null;
          created_at: string;
        };
        Insert: {
          chapter: number;
          episode: number;
          title: string;
          description: string;
          duration_seconds: number;
          video_url?: string;
          thumbnail_url?: string;
        };
      };
      watch_progress: {
        Row: { id: string; user_id: string; episode_id: string; watched_seconds: number; completed: boolean; updated_at: string };
        Insert: { user_id: string; episode_id: string; watched_seconds: number; completed: boolean };
        Update: { watched_seconds?: number; completed?: boolean; updated_at?: string };
      };
      challenges: {
        Row: {
          id: string;
          slug: string;
          title: string;
          difficulty: string;
          instructions_md: string;
          starter_circuit: string | null;
          solution_circuit: string;
          created_at: string;
        };
      };
    };
  };
};
