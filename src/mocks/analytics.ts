import { DailyAnalytics } from '@/types';

// Generate 90 days of realistic time-series analytics leading up to October 2026
export function generate90DaysAnalytics(): DailyAnalytics[] {
  const data: DailyAnalytics[] = [];
  const baseDate = new Date('2026-10-27T00:00:00Z');

  for (let i = 89; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Day of week multiplier (weekends in Dubai: Fri-Sat-Sun have higher car browsing!)
    const day = d.getDay();
    const isWeekend = day === 5 || day === 6 || day === 0;
    const weekendMultiplier = isWeekend ? 1.45 : 1.0;
    const growthTrend = 1 + (90 - i) * 0.006; // steady growth over 90 days

    const views = Math.floor((1800 + Math.sin(i * 0.3) * 350 + Math.random() * 200) * weekendMultiplier * growthTrend);
    const whatsappLeads = Math.floor((22 + Math.sin(i * 0.4) * 8 + Math.random() * 6) * weekendMultiplier * growthTrend);
    const callLeads = Math.floor((9 + Math.cos(i * 0.35) * 4 + Math.random() * 3) * weekendMultiplier * growthTrend);
    const newPublishedListings = Math.floor((1 + Math.random() * 3) * (isWeekend ? 0.7 : 1.3));
    const listingStarts = Math.floor(newPublishedListings * 1.8 + Math.random() * 2);
    const listingCompletions = Math.floor(listingStarts * 0.75);
    const avgWatchTime = Number((13.2 + Math.sin(i * 0.2) * 1.8 + Math.random() * 0.8).toFixed(1));

    data.push({
      date: dateStr,
      views,
      whatsappLeads,
      callLeads,
      newPublishedListings,
      listingStarts,
      listingCompletions,
      avgWatchTime,
    });
  }

  return data;
}

export const INITIAL_ANALYTICS: DailyAnalytics[] = generate90DaysAnalytics();
