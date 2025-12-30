-- Migration: Company Verification Requests
-- Story: 9.7 - Company Verification Flow
-- Description: Creates table for company verification requests with email verification and admin review workflow

-- Create company_verification_requests table
CREATE TABLE IF NOT EXISTS public.company_verification_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    
    -- Business Details
    business_registration_number TEXT NOT NULL,
    registration_document_url TEXT, -- Supabase Storage path
    tax_id TEXT,
    
    -- Contact Verification
    verification_email TEXT NOT NULL,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    verification_code TEXT,
    code_expires_at TIMESTAMPTZ,
    
    -- Requester Details
    requester_name TEXT NOT NULL,
    requester_title TEXT NOT NULL,
    requester_phone TEXT NOT NULL,
    
    -- Context
    reason TEXT NOT NULL,
    expected_job_count TEXT NOT NULL,
    
    -- Admin Review
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_info')),
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    admin_notes TEXT,
    rejection_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_company_verification_requests_company_id ON public.company_verification_requests(company_id);
CREATE INDEX idx_company_verification_requests_status ON public.company_verification_requests(status);
CREATE INDEX idx_company_verification_requests_created_at ON public.company_verification_requests(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_company_verification_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_company_verification_requests_updated_at
    BEFORE UPDATE ON public.company_verification_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_company_verification_requests_updated_at();

-- RLS Policies
ALTER TABLE public.company_verification_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Company members can create requests for their company
CREATE POLICY "Company members can create verification requests"
    ON public.company_verification_requests
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.company_members
            WHERE company_members.company_id = company_verification_requests.company_id
            AND company_members.user_id = auth.uid()
        )
    );

-- Policy: Company members can view their own company's requests
CREATE POLICY "Company members can view own company requests"
    ON public.company_verification_requests
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.company_members
            WHERE company_members.company_id = company_verification_requests.company_id
            AND company_members.user_id = auth.uid()
        )
    );

-- Policy: Company members can update their own pending/needs_info requests
CREATE POLICY "Company members can update own pending requests"
    ON public.company_verification_requests
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.company_members
            WHERE company_members.company_id = company_verification_requests.company_id
            AND company_members.user_id = auth.uid()
        )
        AND status IN ('pending', 'needs_info')
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.company_members
            WHERE company_members.company_id = company_verification_requests.company_id
            AND company_members.user_id = auth.uid()
        )
        AND status IN ('pending', 'needs_info')
    );

-- Policy: Admins can view all requests
CREATE POLICY "Admins can view all verification requests"
    ON public.company_verification_requests
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy: Admins can update all requests
CREATE POLICY "Admins can update all verification requests"
    ON public.company_verification_requests
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create Supabase Storage bucket for verification documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-verification-docs', 'company-verification-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Company members can upload to their own company folder
CREATE POLICY "Company members can upload verification docs"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'company-verification-docs'
        AND (storage.foldername(name))[1] IN (
            SELECT company_id::text FROM public.company_members
            WHERE user_id = auth.uid()
        )
    );

-- Storage RLS: Company members can view their own company docs
CREATE POLICY "Company members can view own verification docs"
    ON storage.objects
    FOR SELECT
    USING (
        bucket_id = 'company-verification-docs'
        AND (storage.foldername(name))[1] IN (
            SELECT company_id::text FROM public.company_members
            WHERE user_id = auth.uid()
        )
    );

-- Storage RLS: Admins can view all verification docs
CREATE POLICY "Admins can view all verification docs"
    ON storage.objects
    FOR SELECT
    USING (
        bucket_id = 'company-verification-docs'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Comment on table
COMMENT ON TABLE public.company_verification_requests IS 'Stores company verification requests with business documents and admin review workflow';
