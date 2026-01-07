import { pgTable, uuid, text, integer, timestamp, index, boolean, numeric, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================
// ENUMS
// ============================================
export const userRoleEnum = pgEnum('user_role', ['admin', 'staff', 'user']);

// ============================================
// PROFILES TABLE
// ============================================
export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').primaryKey(), // References auth.users(id) - managed by Supabase
    username: text('username'),
    fullName: text('full_name'),
    avatarUrl: text('avatar_url'),
    email: text('email'),
    provider: text('provider'),
    githubUrl: text('github_url'),
    bio: text('bio'),
    level: integer('level').default(1),
    xp: integer('xp').default(0),
    leaderboardLabel: text('leaderboard_label'),
    role: userRoleEnum('role').notNull().default('user'),
    isBanned: boolean('is_banned').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    developerRole: text('developer_role'),
    stack: text('stack').array(),
    location: text('location'),
    onboardingCompleted: boolean('onboarding_completed').notNull().default(false),
    status: text('status').notNull().default('active'),
    xUrl: text('x_url'),
    linkedinUrl: text('linkedin_url'),
    websiteUrl: text('website_url'),
  },
  (table) => ({
    usernameIdx: index('profiles_username_idx').on(table.username),
    onboardingCompletedIdx: index('profiles_onboarding_completed_idx').on(table.onboardingCompleted),
  })
);

// ============================================
// COMPANIES TABLE
// ============================================
export const companies = pgTable('companies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logoUrl: text('logo_url'),
  websiteUrl: text('website_url'),
  linkedinUrl: text('linkedin_url'),
  twitterUrl: text('twitter_url'),
  description: text('description'),
  size: text('size'),
  industry: text('industry'),
  location: text('location'),
  isVerified: boolean('is_verified').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// ============================================
// COMPANY VERIFICATION REQUESTS TABLE
// ============================================
export const companyVerificationRequests = pgTable(
  'company_verification_requests',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    companyId: uuid('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    requestedBy: uuid('requested_by')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),

    // Business Details
    businessRegistrationNumber: text('business_registration_number').notNull(),
    registrationDocumentUrl: text('registration_document_url'),
    taxId: text('tax_id'),

    // Contact Verification
    verificationEmail: text('verification_email').notNull(),
    emailVerified: boolean('email_verified').notNull().default(false),
    verificationCode: text('verification_code'),
    codeExpiresAt: timestamp('code_expires_at', { withTimezone: true }),

    // Requester Details
    requesterName: text('requester_name').notNull(),
    requesterTitle: text('requester_title').notNull(),
    requesterPhone: text('requester_phone').notNull(),

    // Context
    reason: text('reason').notNull(),
    expectedJobCount: text('expected_job_count').notNull(),

    // Admin Review
    status: text('status').notNull().default('pending'),
    reviewedBy: uuid('reviewed_by').references(() => profiles.id),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    adminNotes: text('admin_notes'),
    rejectionReason: text('rejection_reason'),

    // Timestamps
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    companyIdIdx: index('idx_company_verification_requests_company_id').on(table.companyId),
    statusIdx: index('idx_company_verification_requests_status').on(table.status),
    createdAtIdx: index('idx_company_verification_requests_created_at').on(table.createdAt),
  })
);

// ============================================
// PAGE VIEWS TABLE
// ============================================
export const pageViews = pgTable(
  'page_views',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    pagePath: text('page_path').notNull(),
    visitorId: text('visitor_id'),
    userAgent: text('user_agent'),
    referrer: text('referrer'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    pagePathIdx: index('page_views_page_path_idx').on(table.pagePath),
    createdAtIdx: index('page_views_created_at_idx').on(table.createdAt),
    visitorIdIdx: index('page_views_visitor_id_idx').on(table.visitorId),
  })
);

// ============================================
// JOBS TABLE
// ============================================
export const jobs = pgTable(
  'jobs',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    companyId: uuid('company_id').references(() => companies.id), // Added relation
    company: text('company').notNull(),
    companyLogo: text('company_logo'),
    description: text('description').notNull(),
    location: text('location').notNull(),
    isRemote: boolean('is_remote').default(false),
    salaryMin: integer('salary_min'),
    salaryMax: integer('salary_max'),
    employmentType: text('employment_type'),
    jobType: text('job_type').default('external'), // internal vs external
    applicationMethod: text('application_method').default('url'), // url, email, etc
    applicationUrl: text('application_url'),
    sourceUrl: text('source_url'),
    sourceSite: text('source_site'),
    postedAt: timestamp('posted_at', { withTimezone: true }),
    scrapedAt: timestamp('scraped_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    isActive: boolean('is_active').default(true),
  },
  (table) => ({
    companyIdx: index('jobs_company_idx').on(table.company),
    locationIdx: index('jobs_location_idx').on(table.location),
    isActiveIdx: index('jobs_is_active_idx').on(table.isActive),
    postedAtIdx: index('jobs_posted_at_idx').on(table.postedAt),
    sourceSiteIdx: index('jobs_source_site_idx').on(table.sourceSite),
  })
);

// ============================================
// BOUNTIES TABLE
// ============================================
export const bounties = pgTable(
  'bounties',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    rewardAmount: numeric('reward_amount').notNull().default('0'),
    status: text('status').notNull().default('open'),
    type: text('type').notNull().default('bounty'),
    skills: text('skills').array().default([]),
    companyName: text('company_name'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    difficulty: text('difficulty').default('intermediate'),
    deadline: timestamp('deadline', { withTimezone: true }),
    requirements: text('requirements').array().default([]),
    repositoryUrl: text('repository_url'),
    longDescription: text('long_description'),
    bountyPostUrl: text('bounty_post_url'),
    submissionPostUrl: text('submission_post_url'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    rarity: text('rarity').default('normal'),
    winnerName: text('winner_name'),
    winnerXHandle: text('winner_x_handle'),
    winnerXUrl: text('winner_x_url'),
    winnerSubmissionUrl: text('winner_submission_url'),
    winnerUserId: uuid('winner_user_id').references(() => profiles.id, { onDelete: 'set null' }),
  },
  (table) => ({
    slugIdx: index('bounties_slug_idx').on(table.slug),
    statusIdx: index('bounties_status_idx').on(table.status),
    winnerUserIdIdx: index('idx_bounties_winner_user_id').on(table.winnerUserId),
  })
);

// ============================================
// BOUNTY INQUIRIES TABLE
// ============================================
export const bountyInquiries = pgTable('bounty_inquiries', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyName: text('company_name').notNull(),
  email: text('email').notNull(),
  budgetRange: text('budget_range').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull().default('new'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================
// BOUNTY SUBMISSIONS TABLE
// ============================================
export const bountySubmissions = pgTable(
  'bounty_submissions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    bountySlug: text('bounty_slug').notNull(),
    bountyTitle: text('bounty_title').notNull(),
    bountyReward: integer('bounty_reward').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id),
    pullRequestUrl: text('pull_request_url').notNull(),
    notes: text('notes'),
    status: text('status').notNull().default('pending'),
    reviewedBy: uuid('reviewed_by').references(() => profiles.id),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    reviewNotes: text('review_notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
    paymentRef: text('payment_ref'),
    paidAt: timestamp('paid_at', { withTimezone: true }),
  },
  (table) => ({
    bountySlugIdx: index('bounty_submissions_bounty_slug_idx').on(table.bountySlug),
    userIdIdx: index('bounty_submissions_user_id_idx').on(table.userId),
    statusIdx: index('bounty_submissions_status_idx').on(table.status),
  })
);

// ============================================
// JOB APPLICATIONS TABLE
// ============================================
export const jobApplications = pgTable(
  'job_applications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    jobId: text('job_id')
      .notNull()
      .references(() => jobs.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    resumeUrl: text('resume_url').notNull(),
    coverLetter: text('cover_letter'),
    status: text('status').notNull().default('new'), // new, reviewing, shortlisted, rejected, hired
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    jobIdIdx: index('job_applications_job_id_idx').on(table.jobId),
    userIdIdx: index('job_applications_user_id_idx').on(table.userId),
    statusIdx: index('job_applications_status_idx').on(table.status),
  })
);


// ============================================
// RELATIONS
// ============================================

export const companyVerificationRequestsRelations = relations(
  companyVerificationRequests,
  ({ one }) => ({
    company: one(companies, {
      fields: [companyVerificationRequests.companyId],
      references: [companies.id],
    }),
    requester: one(profiles, {
      fields: [companyVerificationRequests.requestedBy],
      references: [profiles.id],
    }),
    reviewer: one(profiles, {
      fields: [companyVerificationRequests.reviewedBy],
      references: [profiles.id],
    }),
  })
);
