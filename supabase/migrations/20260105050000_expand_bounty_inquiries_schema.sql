-- Add new columns to bounty_inquiries to match bounties table
ALTER TABLE "bounty_inquiries"
ADD COLUMN "repository_url" text,
ADD COLUMN "requirements" text[],
ADD COLUMN "long_description" text;
