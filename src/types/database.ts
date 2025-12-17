// Supabase Database Types for KrackedDevs

export type UserRole = 'admin' | 'user';

export type DeveloperRole = 'junior' | 'mid' | 'senior' | 'lead' | 'principal' | 'student';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  provider: string | null;
  github_url: string | null;
  bio: string | null;
  level: number;
  xp: number;
  role: UserRole;
  developer_role: DeveloperRole | null;
  stack: string[] | null;
  location: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface PageView {
  id: string;
  page_path: string;
  visitor_id: string | null;
  user_agent: string | null;
  referrer: string | null;
  created_at: string;
}

export interface BountySubmissionRow {
  id: string;
  bounty_slug: string;
  bounty_title: string;
  bounty_reward: number;
  user_id: string;
  pull_request_url: string;
  notes: string | null;
  status: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at" | "role"> & {
          created_at?: string;
          updated_at?: string;
          role?: UserRole;
        };
        Update: Partial<Omit<Profile, "id" | "created_at">>;
        Relationships: [];
      };
      page_views: {
        Row: PageView;
        Insert: Omit<PageView, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<PageView, "id" | "created_at">>;
        Relationships: [];
      };
      bounty_submissions: {
        Row: BountySubmissionRow;
        Insert: {
          bounty_slug: string;
          bounty_title: string;
          bounty_reward: number;
          user_id: string;
          pull_request_url: string;
          notes?: string | null;
          status?: string;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          review_notes?: string | null;
          id?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Omit<BountySubmissionRow, "id" | "created_at">>;
        Relationships: [
          {
            foreignKeyName: "bounty_submissions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

