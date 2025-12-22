import { useQuery } from "@tanstack/react-query";

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

export function usePrayerTimes() {
  return useQuery({
    queryKey: ["prayer-times"],
    queryFn: async () => {
      const date = new Date();
      const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity/${formattedDate}?city=Kuala%20Lumpur&country=Malaysia&method=17`
      );
      const data = await res.json();
      const timings = data?.data?.timings as PrayerTimes | undefined;

      if (!timings) return null;

      const now = new Date();
      const timeNow = now.getHours() * 60 + now.getMinutes();

      for (const prayer of PRAYER_ORDER) {
        const [hours, minutes] = timings[prayer].split(":").map(Number);
        const prayerTime = hours * 60 + minutes;
        if (prayerTime > timeNow) {
          return { name: prayer, time: timings[prayer] };
        }
      }

      return { name: "Fajr", time: timings["Fajr"] };
    },
    refetchInterval: 60000, // Refresh every minute
  });
}
