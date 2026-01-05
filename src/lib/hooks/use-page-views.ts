import { useQuery } from "@tanstack/react-query";

export function usePageViews(pathname: string) {
  // 1. Separate tracking logic: this runs whenever the pathname changes
  // We use a separate query key so it doesn't affect the 'total count' state
  useQuery({
    queryKey: ["track-view", pathname],
    queryFn: async () => {
      if (typeof window === "undefined") return null;

      const visitorIdKey = "visitor_id";
      const existing = localStorage.getItem(visitorIdKey);
      const visitorId = existing ?? (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()));
      if (!existing) localStorage.setItem(visitorIdKey, visitorId);

      await fetch("/api/page-views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pagePath: pathname || "/",
          visitorId,
          userAgent: navigator.userAgent,
          referrer: document.referrer || null,
        }),
      });
      return true;
    },
    staleTime: Infinity, // Only track once per page per session
    enabled: !!pathname,
  });

  // 2. Total count query: uses a static key so data remains cached across navigations
  return useQuery({
    queryKey: ["page-views-total"],
    queryFn: async () => {
      const res = await fetch("/api/page-views");
      const data = await res.json();
      return (data.count as number) || 0;
    },
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    initialData: 0, // Prevent undefined error
  });
}
