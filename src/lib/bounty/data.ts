import { Bounty } from "./types";

export const bounties: Bounty[] = [
  {
    id: "1",
    slug: "kracked-devs-landing-page",
    title: "Kracked Devs Landing Page",
    description:
      "Create a creative, standout landing page design for 'Kracked Devs' – a vibrant developer community dedicated to leveling up skills, tackling bounties, and building epic projects together.",
    longDescription: `## Description

Create a creative, standout landing page design for "Kracked Devs" – a vibrant developer community dedicated to leveling up skills, tackling bounties, and building epic projects together. 

Submit mockups, code, links, or previews in the comments. The most creative and coolest concept wins!

## Requirements
- Creative and standout design
- Reflect the vibrant developer community spirit
- Showcase bounties and projects
- Modern, engaging UI/UX

## Submission
Submit your work via Twitter/X by replying to the bounty post with:
- Mockups, code, links, or previews
- Tag @KrackedDevs

## Winner
🏆 Winner: [@zafranudin_z](https://x.com/zafranudin_z)`,
    reward: 100,
    difficulty: "intermediate",
    status: "completed",
    tags: ["design", "ui", "frontend", "landing-page"],
    requirements: [
      "Creative landing page design",
      "Reflect developer community vibe",
      "Modern and engaging UI",
      "Submit mockups/code/preview",
    ],
    repositoryUrl: "https://github.com/solahidris/krackeddev",
    issueUrl: "https://x.com/masterofnone/status/1992362597862240318",
    createdAt: "2025-11-20T10:00:00Z",
    deadline: "2025-11-23T21:00:00Z",
    completedAt: "2025-11-23T21:00:00Z",
    submissions: [
      {
        id: "sub-1",
        bountyId: "1",
        pullRequestUrl: "https://x.com/masterofnone/status/1992914421883248878",
        submittedBy: "zafranudin_z",
        submittedAt: "2025-11-23T20:00:00Z",
        status: "approved",
        notes: "Winner - Creative landing page design",
      },
    ],
  },
  {
    id: "2",
    slug: "gamified-tech-job-board",
    title: "Build a Gamified Tech Job Board for Kracked Devs",
    description:
      "Build something epic – implement gamification features into a tech job board (e.g., points, badges, leaderboards for job applications, postings, or hires).",
    longDescription: `## Description

The @KrackedDev community has voted for a "Gamified Tech Job Board" theme. 

Build something epic – implement gamification features into a tech job board (e.g., points, badges, leaderboards for job applications, postings, or hires). 

Contribute directly to the repo via Pull Request. Make it creative, functional, and standout!

## Gamification Features
- Points system for activities
- Badges and achievements
- Leaderboards for applications, postings, or hires
- User profiles with progress tracking
- Challenge system

## Technical Requirements
- Contribute via Pull Request to the main repository
- Next.js App Router + TypeScript + Tailwind CSS
- Creative and functional implementation
- Well-documented code

## Repository
[https://github.com/solahidris/krackeddev](https://github.com/solahidris/krackeddev)

## Winner
🏆 Winner: [@iffathaikal1](https://x.com/iffathaikal1)`,
    reward: 150,
    difficulty: "advanced",
    status: "completed",
    tags: ["gamification", "job-board", "fullstack", "feature"],
    requirements: [
      "Implement gamification features (points, badges, leaderboards)",
      "Contribute via Pull Request",
      "Creative and functional",
      "Next.js + TypeScript + Tailwind",
    ],
    repositoryUrl: "https://github.com/solahidris/krackeddev",
    issueUrl: "https://x.com/solahidris_/status/1993586176419414145",
    createdAt: "2025-11-24T10:00:00Z",
    deadline: "2025-11-30T23:59:59Z",
    completedAt: "2025-11-30T23:59:59Z",
    submissions: [
      {
        id: "sub-2",
        bountyId: "2",
        pullRequestUrl: "https://x.com/iffathaikal1/status/1995088727497158927",
        submittedBy: "iffathaikal1",
        submittedAt: "2025-11-30T20:00:00Z",
        status: "approved",
        notes: "Winner - Gamified job board implementation",
      },
    ],
  },
  {
    id: "3",
    slug: "github-profile-widget",
    title: "Build a Kracked Devs Profile GitHub Widget",
    description:
      "Build a customizable GitHub widget for Kracked Devs profiles with OAuth, contribution graph, in-profile editor with themes, and embeddable component.",
    longDescription: `## Description

Build a customizable GitHub widget for Kracked Devs profiles:

## Core Features
- **OAuth to GitHub** - Secure authentication
- **Fetch & render the user's contribution graph**
- **In-profile editor**: Themes (Colors, Size, Layout, Shapes), Live Preview
- **Output**: Embeddable component on the Kracked Devs Profile

Ship something you'd use on your own profile! Make it creative, functional, and impressive.

## How to Submit
Reply to the bounty post with:
1. A 3–5 min screen recording (GitHub connect → graph → editing)
2. Public repo link (with README/setup)
3. Tag @KrackedDevs
4. **Bonus**: Live demo URL + short bullets on stack/features

## Technical Stack
- Next.js App Router + TypeScript + Tailwind CSS
- GitHub OAuth integration
- Customizable themes and layouts
- Real-time preview

## Winner
🏆 Winner: [@4kmal4lif](https://x.com/4kmal4lif)`,
    reward: 150,
    difficulty: "advanced",
    status: "completed",
    tags: ["github", "oauth", "widget", "profile", "feature"],
    requirements: [
      "GitHub OAuth integration",
      "Fetch and render contribution graph",
      "In-profile editor with themes",
      "Live preview functionality",
      "Embeddable component output",
      "3-5 min demo video + repo + README",
    ],
    repositoryUrl: "https://github.com/solahidris/krackeddev",
    issueUrl: "https://x.com/KrackedDevs/status/1996442362634174677",
    createdAt: "2025-12-01T10:00:00Z",
    deadline: "2025-12-07T23:59:59Z",
    completedAt: "2025-12-07T23:59:59Z",
    submissions: [
      {
        id: "sub-3",
        bountyId: "3",
        pullRequestUrl: "https://x.com/masterofnone/status/1997925687320342770",
        submittedBy: "4kmal4lif",
        submittedAt: "2025-12-07T20:00:00Z",
        status: "approved",
        notes: "Winner - GitHub widget with customization features",
      },
    ],
  },
  {
    id: "4",
    slug: "viral-food-directory-map",
    title: "Viral Food Directory (Map Edition)",
    description:
      "Create a map-first web app to discover viral food spots, powered by reviews from Google plus one other source (e.g. Yelp, TripAdvisor, Foursquare).",
    longDescription: `## Bounty Brief

Create a map-first web app to discover viral food spots, powered by reviews from Google plus one other source (e.g. Yelp, TripAdvisor, Foursquare).

## Must-Have Features

### 1. Map Interface
- Map with pins for food locations
- Synced list view alongside the map
- Interactive markers

### 2. Place Page
Display comprehensive information for each location:
- Name and address
- Tags/categories
- Must-try item
- Opening hours
- Price range
- Photos

### 3. Search & Filters
- **Near me** - Location-based search
- **Open now** - Filter by current operating hours
- **Category** - Filter by food type/cuisine
- **Price range** - Budget filtering
- Show distance from user

### 4. Trending & Ratings
- Simple "Trending" sort algorithm
- Aggregate rating using Google + one extra review source
- Display combined scores

### 5. Deliverables
- Live demo (deployed)
- Public repository
- Short README with setup instructions

## Technical Stack
- Next.js App Router + TypeScript + Tailwind CSS
- Google Maps/Places API
- One additional review source API (Yelp, TripAdvisor, or Foursquare)
- Cloudflare Pages deployment

## How to Submit
Reply to the bounty post with:
1. Live demo URL
2. Public GitHub repository link
3. Short description of features and tech stack
4. Tag @KrackedDevs

## Social Caption Idea
"New Kracked Devs bounty: Build a Viral Food Directory in 5 days. Map UI, real reviews from Google + one more source, and your own 'trending' score. Ship a live demo + repo and drop your link to enter."

## Timeline
5-day build challenge`,
    reward: 200,
    difficulty: "advanced",
    status: "active",
    tags: ["maps", "api-integration", "fullstack", "food-tech", "feature"],
    requirements: [
      "Map with pins + synced list view",
      "Place page with comprehensive info",
      "Search and filters (near me, open now, category, price)",
      "Distance calculation and Trending sort",
      "Aggregate ratings from Google + one other source",
      "Live demo + public repo + README",
    ],
    repositoryUrl: "https://github.com/solahidris/krackeddev",
    issueUrl: "https://x.com/KrackedDevs/status/PENDING",
    createdAt: "2025-12-12T10:00:00Z",
    deadline: "2025-12-17T23:59:59Z",
    submissions: [],
  },
];

export function getBountyBySlug(slug: string): Bounty | undefined {
  return bounties.find((b) => b.slug === slug);
}

export function getActiveBounties(): Bounty[] {
  return bounties.filter((b) => b.status === "active");
}

export function getAllBounties(): Bounty[] {
  return bounties;
}

export function getBountiesByStatus(status: Bounty["status"]): Bounty[] {
  return bounties.filter((b) => b.status === status);
}
