export type UserRole = 'guest' | 'individual' | 'dealer' | 'admin';

export type ContactPreference = 'whatsapp' | 'call' | 'both';

export type ListingStatus = 
  | 'draft' 
  | 'pending_review' 
  | 'live' 
  | 'rejected' 
  | 'archived' 
  | 'sold' 
  | 'deleted';

export type MediaPathType = 'ready_video' | 'smart_template' | 'photos_only';

export type TemplateStyle = 'premium' | 'sport' | 'cosy';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  bio?: string;
  companyName?: string;
  tradeLicenseNumber?: string;
  tradeLicenseExpiry?: string;
  isVerifiedDealer?: boolean;
  dealerDocumentUrl?: string;
  dealerRating?: number;
  dealerReviewCount?: number;
  savedListings: string[];
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  performedByRole: UserRole;
  notes?: string;
}

export interface Listing {
  id: string;
  slug: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number; // in AED
  mileage: number; // in km
  bodyType: string;
  fuelType: string;
  transmission: string;
  condition: 'Brand New' | 'Like New' | 'Excellent' | 'Good';
  dubaiArea: string;
  city: 'Dubai'; // Stage 1 scope
  category: 'car'; // Stage 1 scope
  description: string;
  contactPreference: ContactPreference;
  mediaPath: MediaPathType;
  status: ListingStatus;
  rejectionReason?: string;
  videoUrl?: string;
  videoPoster?: string;
  videoDuration?: number; // seconds
  smartTemplateId?: string;
  musicTrackId?: string;
  photos: string[];
  coverPhotoIndex: number;
  sellerId: string;
  sellerType: 'individual' | 'dealer';
  sellerName: string;
  sellerAvatar?: string;
  sellerPhone: string;
  isDealerVerified?: boolean;
  publicStats: {
    views: number;
    likes: number;
    commentsCount: number;
  };
  privateStats: {
    whatsappLeads: number;
    callLeads: number;
    saves: number;
    avgWatchTimeSeconds: number;
    completionRatePercent: number;
  };
  createdAt: string;
  updatedAt: string;
  auditHistory: AuditEntry[];
}

export interface TemplateSlot {
  id: string;
  label: string; // e.g. "Hero exterior", "Front", "Side", "Interior", "Dashboard", "Rear", "Details", "Closing"
  targetDuration: number; // in seconds
  required: boolean;
  clipUrl?: string;
  clipName?: string;
  isAiFlagged?: boolean;
  aiFlagReason?: string;
}

export interface SmartTemplate {
  id: string;
  name: string;
  style: TemplateStyle;
  tagline: string;
  description: string;
  totalDuration: number; // in seconds, typically 12-18s
  slots: TemplateSlot[];
  recommendedMusicId: string;
  aspectRatio: '9:16';
  badgeColor?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  vibe: 'Luxury Minimal' | 'High-Octane Sport' | 'Cinematic Ambient' | 'Dubai Midnight' | 'Lounge Chill';
  durationSeconds: number;
  bpm: number;
  fileUrl: string;
  licenseNotes: string;
}

export interface VideoProcessingJob {
  id: string;
  listingId: string;
  listingTitle: string;
  sellerName: string;
  mediaPath: MediaPathType;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  style?: TemplateStyle;
  templateId?: string;
  musicId?: string;
  error?: string;
  logs: string[];
  startedAt: string;
  completedAt?: string;
}

export interface DealerVerificationRequest {
  id: string;
  dealerId: string;
  dealerName: string;
  contactPerson: string;
  email: string;
  phone: string;
  tradeLicenseNumber: string;
  tradeLicenseExpiry: string;
  documentUrl?: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  rejectionReason?: string;
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ModerationReport {
  id: string;
  targetType: 'listing' | 'comment' | 'video' | 'user';
  targetId: string;
  targetTitle: string;
  reason: 'Inappropriate content' | 'Misleading price' | 'Scam suspicion' | 'Copyright issue' | 'Wrong specs';
  details: string;
  reporterEmail: string;
  status: 'open' | 'dismissed' | 'action_taken';
  actionTaken?: 'removed' | 'warning_issued' | 'user_suspended' | 'dismissed';
  createdAt: string;
}

export interface SocialVideo {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  caption: string;
  videoUrl: string;
  videoPoster: string;
  duration: number;
  likes: number;
  commentsCount: number;
  views: number;
  createdAt: string;
}

export interface ListingComment {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  isFlagged?: boolean;
}

export interface DailyAnalytics {
  date: string;
  views: number;
  whatsappLeads: number;
  callLeads: number;
  newPublishedListings: number;
  listingStarts: number;
  listingCompletions: number;
  avgWatchTime: number;
}
