import { useQuery } from "@tanstack/react-query";

export function usePageViews(pathname: string) {
  return useQuery({
    queryKey: ["page-views", pathname],
    queryFn: async () => {
      const visitorIdKey = "visitor_id";
      const existing = localStorage.getItem(visitorIdKey);
      const visitorId =
        existing ??
        (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()));
      if (!existing) localStorage.setItem(visitorIdKey, visitorId);

      // 1. Track the view
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

      // 2. Fetch the total count
      const res = await fetch("/api/page-views");
      const data = await res.json();
      return data.count as number;
    },
  });
}
