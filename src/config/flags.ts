export interface FeatureFlags {
  commentsEnabled: boolean;
  maxRendersPerListing: number;
  maxUploadSizeMB: number;
  maxVideoDurationSeconds: number;
  minPhotosCount: number;
  maxPhotosCount: number;
  dealerVerificationEnforced: boolean;
  aiSmartTemplatesEnabled: boolean;
  soundAutoplayMuted: boolean;
}

export interface RoadmapFlag {
  id: string;
  name: string;
  stage: 2 | 3;
  category: 'Expansion' | 'Monetization' | 'Verticals' | 'Engagement';
  description: string;
  enabled: boolean; // Stage 1 is false (read-only in admin)
}

export const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  commentsEnabled: true,
  maxRendersPerListing: 3,
  maxUploadSizeMB: 500,
  maxVideoDurationSeconds: 60,
  minPhotosCount: 10,
  maxPhotosCount: 20,
  dealerVerificationEnforced: true,
  aiSmartTemplatesEnabled: true,
  soundAutoplayMuted: true,
};

export const ROADMAP_FLAGS: RoadmapFlag[] = [
  {
    id: 'stage2_uae_wide',
    name: 'UAE-Wide Expansion (Abu Dhabi, Sharjah)',
    stage: 2,
    category: 'Expansion',
    description: 'Broaden marketplace boundaries beyond Dubai into Abu Dhabi, Sharjah, Ajman, and RAK emirates.',
    enabled: false,
  },
  {
    id: 'stage2_arabic_rtl',
    name: 'Full Arabic RTL Marketplace',
    stage: 2,
    category: 'Expansion',
    description: 'Complete bilingual English/Arabic feed and dashboard localization across all consumer flows.',
    enabled: false,
  },
  {
    id: 'stage2_dealer_subscriptions',
    name: 'Dealer Tier Subscriptions',
    stage: 2,
    category: 'Monetization',
    description: 'Recurring monthly dealer packages (Tier 1 Silver, Tier 2 Gold, Tier 3 Diamond) with inventory allotments.',
    enabled: false,
  },
  {
    id: 'stage2_promoted_listings',
    name: 'Promoted Reels & Featured Badges',
    stage: 2,
    category: 'Monetization',
    description: 'Pay-per-boost listing placement at top of video feeds and algorithmic spotlighting.',
    enabled: false,
  },
  {
    id: 'stage2_follow_system',
    name: 'Social Dealer & Creator Following',
    stage: 2,
    category: 'Engagement',
    description: 'Allow buyers to follow verified luxury dealerships and receive reel notifications on new inventory.',
    enabled: false,
  },
  {
    id: 'stage2_personalized_feed',
    name: 'Personalized AI Recommendation Feed',
    stage: 2,
    category: 'Engagement',
    description: 'Collaborative filtering and watch-time interest graphs tailored to buyer price brackets and brand affinity.',
    enabled: false,
  },
  {
    id: 'stage3_bikes',
    name: 'Superbikes & Motorcycles',
    stage: 3,
    category: 'Verticals',
    description: 'Dedicated category for sports bikes, custom choppers, and desert enduros.',
    enabled: false,
  },
  {
    id: 'stage3_yachts',
    name: 'Luxury Yachts & Marine Reels',
    stage: 3,
    category: 'Verticals',
    description: 'Dubai Marina luxury watercraft, superyachts, and charter listings.',
    enabled: false,
  },
  {
    id: 'stage3_plates',
    name: 'VIP UAE Number Plates Marketplace',
    stage: 3,
    category: 'Verticals',
    description: '2-digit, 3-digit, and distinct Dubai/Abu Dhabi plate auctions and direct sales.',
    enabled: false,
  },
  {
    id: 'stage3_rentals',
    name: 'Supercar Daily & Weekly Rentals',
    stage: 3,
    category: 'Verticals',
    description: 'Instant luxury concierge rental bookings for tourists and residents.',
    enabled: false,
  },
  {
    id: 'stage3_inapp_chat',
    name: 'Native In-App Secure Chat & Escrow',
    stage: 3,
    category: 'Engagement',
    description: 'Real-time encrypted buyer-seller messaging alternative to direct WhatsApp.',
    enabled: false,
  },
  {
    id: 'stage3_sponsored_ads',
    name: 'Automotive Brand Sponsored In-Feed Ads',
    stage: 3,
    category: 'Monetization',
    description: 'Direct OEM ad slots for official dealerships and aftermarket tuners.',
    enabled: false,
  },
];
