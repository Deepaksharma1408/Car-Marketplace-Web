export interface DemoCarMedia {
  id: string;
  make: string;
  model: string;
  verticalVideoUrl: string;
  posterUrl: string;
  gradientColors: [string, string];
  photos: string[];
}

export const DEMO_MEDIA_CONFIG = {
  // Reliable royalty-free vertical video sources
  verticalVideos: [
    {
      id: 'video_supercar_1',
      title: 'Ferrari SF90 Stradale Night Run',
      url: '/demo/videos/driving-sample.mp4',
      poster: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1080&auto=format&fit=crop',
      duration: 16,
    },
    {
      id: 'video_rolls_royce_1',
      title: 'Rolls-Royce Ghost Grand Tour',
      url: '/demo/videos/driving-sample.mp4',
      poster: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=1080&auto=format&fit=crop',
      duration: 18,
    },
    {
      id: 'video_porsche_1',
      title: 'Porsche 911 GT3 RS Track Spec',
      url: '/demo/videos/driving-sample.mp4',
      poster: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1080&auto=format&fit=crop',
      duration: 14,
    },
    {
      id: 'video_gwagon_1',
      title: 'Mercedes-AMG G63 Mansory',
      url: '/demo/videos/driving-sample.mp4',
      poster: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1080&auto=format&fit=crop',
      duration: 15,
    },
  ],

  // Curated Unsplash HD automotive photo packs (each car has 10-15 real photos)
  photoPacks: {
    ferrari: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=1200&auto=format&fit=crop',
    ],
    porsche: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop',
    ],
    lamborghini: [
      'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop',
    ],
    rollsroyce: [
      'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=1200&auto=format&fit=crop',
    ],
    gwagon: [
      'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop',
    ],
  },
};

/**
 * Generates an ultra-crisp luxury animated poster data URL or CSS gradient in case an image fails to load.
 */
export function getLuxuryFallbackPoster(title: string, make: string): string {
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const palettes = [
    ['#0A0C10', '#1A1E28', '#D4AF6A'],
    ['#0D1117', '#161B22', '#2DD4BF'],
    ['#12151C', '#1E2330', '#F59E0B'],
    ['#0A0C10', '#1C2331', '#D4AF6A'],
  ];
  const [bg1, bg2, accent] = palettes[hash % palettes.length];

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${encodeURIComponent(bg1)}" />
        <stop offset="60%" stop-color="${encodeURIComponent(bg2)}" />
        <stop offset="100%" stop-color="${encodeURIComponent(bg1)}" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="${encodeURIComponent(accent)}" stop-opacity="0.18" />
        <stop offset="100%" stop-color="${encodeURIComponent(accent)}" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="720" height="1280" fill="url(#grad)" />
    <circle cx="360" cy="500" r="300" fill="url(#glow)" />
    <path d="M 160 560 L 560 560 L 520 620 L 200 620 Z" fill="${encodeURIComponent(accent)}" fill-opacity="0.15" />
    <path d="M 220 540 L 500 540 L 460 480 L 260 480 Z" fill="${encodeURIComponent(accent)}" fill-opacity="0.25" />
    <circle cx="250" cy="630" r="35" fill="#12151C" stroke="${encodeURIComponent(accent)}" stroke-width="4" />
    <circle cx="470" cy="630" r="35" fill="#12151C" stroke="${encodeURIComponent(accent)}" stroke-width="4" />
    <text x="360" y="740" font-family="sans-serif" font-weight="bold" font-size="28" fill="#F4F5F7" text-anchor="middle">${encodeURIComponent(make.toUpperCase())}</text>
    <text x="360" y="780" font-family="sans-serif" font-size="18" fill="#9AA3B2" text-anchor="middle">${encodeURIComponent(title)}</text>
    <text x="360" y="840" font-family="sans-serif" font-size="14" fill="${encodeURIComponent(accent)}" text-anchor="middle" letter-spacing="3">VEHICLE SPOT CINEMATIC PREVIEW</text>
  </svg>`;
}
