import { z } from 'zod';

export const developerRoles = [
    { value: 'student', label: 'Student' },
    { value: 'junior', label: 'Junior Developer' },
    { value: 'mid', label: 'Mid-Level Developer' },
    { value: 'senior', label: 'Senior Developer' },
    { value: 'lead', label: 'Tech Lead' },
    { value: 'principal', label: 'Principal Engineer' },
] as const;

export const techStacks = [
    'React', 'Next.js', 'Vue', 'Angular', 'Svelte',
    'Node.js', 'Express', 'NestJS', 'Python', 'Django', 'FastAPI',
    'Java', 'Spring', 'Go', 'Rust', 'C#', '.NET',
    'TypeScript', 'JavaScript', 'PHP', 'Laravel', 'Ruby', 'Rails',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase',
    'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes',
    'React Native', 'Flutter', 'Swift', 'Kotlin',
    'TailwindCSS', 'Sass', 'GraphQL', 'REST API',
] as const;

const developerRoleValues = ['student', 'junior', 'mid', 'senior', 'lead', 'principal'] as const;

export const onboardingSchema = z.object({
    fullName: z.string().max(100).optional(),
    username: z.string().min(3, 'Username must be at least 3 characters').optional(),
    developerRole: z.enum(developerRoleValues),
    stack: z.array(z.string()).min(1, 'Please select at least one technology'),
    location: z.string().min(2, 'Please enter your location'),
    country: z.string().optional(),
    state: z.string().optional(),
    otherCountry: z.string().optional(),
    xUrl: z.string().url().optional().or(z.literal('')),
    linkedinUrl: z.string().url().optional().or(z.literal('')),
    websiteUrl: z.string().url().optional().or(z.literal('')),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
