import { SocialVideo } from '@/types';
import { DEMO_MEDIA_CONFIG } from '@/config/demoMedia';

export const INITIAL_SOCIAL_VIDEOS: SocialVideo[] = [
  {
    id: 'vid_1',
    userId: 'user_ind_1', // Hamdan Al-Maktoum
    userName: 'Hamdan Al-Maktoum',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    caption: 'Cold start and tunnel roar on Sheikh Zayed Road at 2 AM 🏎️💨 #DubaiSupercars #V12 #Exotic',
    videoUrl: DEMO_MEDIA_CONFIG.verticalVideos[0].url,
    videoPoster: DEMO_MEDIA_CONFIG.verticalVideos[0].poster,
    duration: 16,
    likes: 4820,
    commentsCount: 194,
    views: 38400,
    createdAt: '2024-10-20T22:15:00Z',
  },
  {
    id: 'vid_2',
    userId: 'user_ind_1', // Hamdan Al-Maktoum
    userName: 'Hamdan Al-Maktoum',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    caption: 'Sunset desert run through Al Qudra with the G63 beast 🌅🏜️ #G63 #DubaiDesert #SunsetDrive',
    videoUrl: DEMO_MEDIA_CONFIG.verticalVideos[3].url,
    videoPoster: DEMO_MEDIA_CONFIG.verticalVideos[3].poster,
    duration: 15,
    likes: 3120,
    commentsCount: 112,
    views: 24800,
    createdAt: '2024-10-14T17:40:00Z',
  },
  {
    id: 'vid_3',
    userId: 'user_ind_1', // Hamdan Al-Maktoum
    userName: 'Hamdan Al-Maktoum',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    caption: 'Carbon details and interior craftsmanship in the GT3 RS cockpit. Pure racing DNA 🏁',
    videoUrl: DEMO_MEDIA_CONFIG.verticalVideos[2].url,
    videoPoster: DEMO_MEDIA_CONFIG.verticalVideos[2].poster,
    duration: 14,
    likes: 5690,
    commentsCount: 280,
    views: 49100,
    createdAt: '2024-10-02T19:00:00Z',
  },
  {
    id: 'vid_4',
    userId: 'user_ind_2',
    userName: 'Youssef Al-Sabah',
    userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop',
    caption: 'Morning coffee roll in DIFC Gate Village with the squad ☕🏎️',
    videoUrl: DEMO_MEDIA_CONFIG.verticalVideos[1].url,
    videoPoster: DEMO_MEDIA_CONFIG.verticalVideos[1].poster,
    duration: 18,
    likes: 1980,
    commentsCount: 84,
    views: 16200,
    createdAt: '2024-09-28T07:30:00Z',
  },
];
