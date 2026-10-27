import { Listing, ModerationReport } from '@/types';

export const COMMUNITY_KEY = 'vehiclespot_community_v1';
export const COMMUNITY_EVENT = 'vehiclespot-community-change';
export interface PrototypeComment {
  id: string; listingId: string; userId: string; userName: string;
  content: string; parentId?: string; hidden?: boolean; createdAt: string;
}
export interface CommunityData {
  likes: Record<string, string[]>;
  saves: Record<string, string[]>;
  comments: PrototypeComment[];
}
export const EMPTY_COMMUNITY: CommunityData = { likes: {}, saves: {}, comments: [] };
export function readCommunity(): CommunityData {
  if (typeof window === 'undefined') return { likes: {}, saves: {}, comments: [] };
  try { return { likes: {}, saves: {}, comments: [], ...JSON.parse(localStorage.getItem(COMMUNITY_KEY) || '{}') }; }
  catch { return { likes: {}, saves: {}, comments: [] }; }
}
function writeCommunity(data: CommunityData) {
  localStorage.setItem(COMMUNITY_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(COMMUNITY_EVENT));
}
export function toggleInteraction(type: 'likes' | 'saves', listingId: string, userId: string) {
  const data = readCommunity();
  const ids = data[type][userId] || [];
  data[type][userId] = ids.includes(listingId) ? ids.filter((id) => id !== listingId) : [...ids, listingId];
  writeCommunity(data);
}
export function addPrototypeComment(input: Omit<PrototypeComment, 'id' | 'createdAt' | 'hidden'>) {
  const content = input.content.trim();
  if (!content || content.length > 1000) throw new Error('Write a comment of 1–1000 characters.');
  const data = readCommunity();
  if (input.parentId && !data.comments.some((comment) => comment.id === input.parentId && comment.listingId === input.listingId && !comment.hidden)) throw new Error('This comment is no longer available.');
  const comment = { ...input, content, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  data.comments.push(comment);
  writeCommunity(data);
  return comment;
}
export function hidePrototypeComment(id: string) {
  const data = readCommunity();
  data.comments = data.comments.map((comment) => comment.id === id || comment.parentId === id ? { ...comment, hidden: true } : comment);
  writeCommunity(data);
}
export function submitPrototypeReport(report: Omit<ModerationReport, 'id' | 'status' | 'createdAt'>) {
  const key = 'vehiclespot_reports_v2';
  const reports: ModerationReport[] = JSON.parse(localStorage.getItem(key) || '[]');
  if (reports.some((item) => item.targetId === report.targetId && item.reporterEmail === report.reporterEmail && item.status === 'open')) throw new Error('You already have an open report for this content.');
  reports.unshift({ ...report, id: crypto.randomUUID(), status: 'open', createdAt: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(reports));
  window.dispatchEvent(new Event(COMMUNITY_EVENT));
}

// Insert one static photo card only after each group of seven video cards.
// Never repeat a photo to fill inventory or append photos after an incomplete group.
export function buildDiscoveryFeed(listings: Listing[]): Listing[] {
  const visible = listings.filter((listing) => listing.status === 'live');
  const videos = visible.filter((listing) => listing.mediaPath !== 'photos_only' && Boolean(listing.videoUrl));
  const photos = visible.filter((listing) => listing.mediaPath === 'photos_only');
  const result: Listing[] = [];
  let photoIndex = 0;
  videos.forEach((listing, index) => {
    result.push(listing);
    if ((index + 1) % 7 === 0 && photos[photoIndex]) result.push(photos[photoIndex++]);
  });
  return result;
}
