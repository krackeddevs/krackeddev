-- Create government_inquiries table for partnership requests
CREATE TABLE IF NOT EXISTS government_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('policy_maker', 'mdec_ministry', 'glc_company')),
    organization_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    position_title TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'contacted', 'scheduled', 'completed', 'archived')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster filtering
CREATE INDEX idx_government_inquiries_status ON government_inquiries(status);
CREATE INDEX idx_government_inquiries_type ON government_inquiries(inquiry_type);
CREATE INDEX idx_government_inquiries_created_at ON government_inquiries(created_at DESC);
CREATE INDEX idx_government_inquiries_assigned_to ON government_inquiries(assigned_to);

-- Enable RLS
ALTER TABLE government_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public form submission)
CREATE POLICY "Anyone can submit government inquiries"
    ON government_inquiries
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Only admins can view and manage inquiries
CREATE POLICY "Admins can view all government inquiries"
    ON government_inquiries
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update government inquiries"
    ON government_inquiries
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_government_inquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER government_inquiries_updated_at
    BEFORE UPDATE ON government_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_government_inquiries_updated_at();

-- Add comment for documentation
COMMENT ON TABLE government_inquiries IS 'Stores partnership inquiries from government entities, MDEC, ministries, and GLCs';
