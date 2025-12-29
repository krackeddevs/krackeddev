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
  developer_role: string | null;
  stack: string[] | null;
  location: string | null;
  onboarding_completed: boolean;
  status: 'active' | 'banned';
  created_at: string;
  updated_at: string;
  x_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  // Drizzle compatible fields (mapped)
  fullName?: string | null;
  avatarUrl?: string | null;
  githubUrl?: string | null;
  developerRole?: string | null;
  onboardingCompleted?: boolean;
  xUrl?: string | null;
  linkedinUrl?: string | null;
  websiteUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PageView {
  id: string;
  page_path: string;
  visitor_id: string | null;
  user_agent: string | null;
  referrer: string | null;
  created_at: string;
  // Drizzle
  pagePath?: string;
  visitorId?: string | null;
  userAgent?: string | null;
  createdAt?: string;
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
  payment_ref: string | null;
  paid_at: string | null;
  // Drizzle
  bountySlug?: string;
  bountyTitle?: string;
  bountyReward?: number;
  userId?: string;
  pullRequestUrl?: string;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  reviewNotes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  paymentRef?: string | null;
  paidAt?: string | null;
}

export interface Bounty {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  reward_amount: number;
  status: string;
  type: string;
  skills: string[] | null;
  company_name: string | null;
  created_at: string;
  updated_at: string;
  // New fields
  difficulty?: string | null;
  deadline?: string | null;
  requirements?: string[] | null;
  repository_url?: string | null;
  long_description?: string | null;
  bounty_post_url?: string | null;
  submission_post_url?: string | null;
  completed_at?: string | null;
  rarity?: string | null;
  winner_name?: string | null;
  winner_x_handle?: string | null;
  winner_x_url?: string | null;
  winner_submission_url?: string | null;
  // Drizzle
  rewardAmount?: string | number;
  companyName?: string | null;
  createdAt?: string;
  updatedAt?: string;
  repositoryUrl?: string | null;
  longDescription?: string | null;
  bountyPostUrl?: string | null;
  submissionPostUrl?: string | null;
  completedAt?: string | null;
  winnerName?: string | null;
  winnerXHandle?: string | null;
  winnerXUrl?: string | null;
  winnerSubmissionUrl?: string | null;
}

export interface BountyInquiry {
  id: string;
  company_name: string;
  email: string;
  budget_range: string;
  description: string;
  status: string;
  created_at: string;
  // Drizzle
  companyName?: string;
  budgetRange?: string;
  createdAt?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  created_at: string;
  company_logo?: string | null;
  is_remote?: boolean;
  employment_type?: string | null;
  source_url?: string | null;
  source_site?: string | null;
  posted_at?: string | null;
  scraped_at?: string | null;
  updated_at?: string | null;
  is_active?: boolean;
  salary_min?: number | null;
  salary_max?: number | null;
  company_id?: string | null;
  application_url?: string | null;
  job_type?: 'internal' | 'external' | null;
  application_method?: 'email' | 'url' | 'internal_form' | null;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  website_url: string | null;
  banner_url: string | null;
  size: string | null;
  description: string | null;
  is_verified?: boolean;
  industry?: string | null;
  location?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyMember {
  id: string;
  company_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  created_at: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  user_id: string;
  resume_url: string;
  cover_letter?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
        Relationships: [];
      };
      page_views: {
        Row: PageView;
        Insert: Partial<PageView>;
        Update: Partial<PageView>;
        Relationships: [];
      };
      bounty_submissions: {
        Row: BountySubmissionRow;
        Insert: Partial<BountySubmissionRow>;
        Update: Partial<BountySubmissionRow>;
        Relationships: [];
      };
      bounties: {
        Row: Bounty;
        Insert: Partial<Bounty>;
        Update: Partial<Bounty>;
        Relationships: [];
      };
      bounty_inquiries: {
        Row: BountyInquiry;
        Insert: Partial<BountyInquiry>;
        Update: Partial<BountyInquiry>;
        Relationships: [];
      };
      jobs: {
        Row: Job;
        Insert: Partial<Job>;
        Update: Partial<Job>;
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          }
        ];
      };
      companies: {
        Row: Company;
        Insert: Partial<Company>;
        Update: Partial<Company>;
        Relationships: [];
      };
      company_members: {
        Row: CompanyMember;
        Insert: Partial<CompanyMember>;
        Update: Partial<CompanyMember>;
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "company_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      job_applications: {
        Row: JobApplication;
        Insert: Partial<JobApplication>;
        Update: Partial<JobApplication>;
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey";
            columns: ["job_id"];
            isOneToOne: false;
            referencedRelation: "jobs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "job_applications_user_id_fkey";
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
      register_new_company: {
        Args: {
          p_name: string;
          p_slug: string;
          p_size: string;
          p_website_url?: string | null;
        };
        Returns: string;
      };
    };
    Enums: {
      user_role: UserRole;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
