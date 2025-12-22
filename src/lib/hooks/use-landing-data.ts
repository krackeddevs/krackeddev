import { useQuery } from '@tanstack/react-query';
import { Bounty } from '@/types/database';

export interface LandingStats {
  payoutVolume: number;
  activeBounties: number;
  travelers: number;
}

export interface LocationData {
  name: string;
  value: number;
}

export function useLandingStats() {
  return useQuery<LandingStats>({
    queryKey: ['landing-stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats/landing');
      if (!res.ok) throw new Error('Failed to fetch landing stats');
      return res.json();
    },
  });
}

export function useRecentBounties() {
  return useQuery<Bounty[]>({
    queryKey: ['recent-bounties'],
    queryFn: async () => {
      const res = await fetch('/api/bounties/recent');
      if (!res.ok) throw new Error('Failed to fetch recent bounties');
      return res.json();
    },
  });
}

export function useCommunityLocations() {
  return useQuery<LocationData[]>({
    queryKey: ['community-locations'],
    queryFn: async () => {
      const res = await fetch('/api/community/locations');
      if (!res.ok) throw new Error('Failed to fetch community locations');
      return res.json();
    },
  });
}
