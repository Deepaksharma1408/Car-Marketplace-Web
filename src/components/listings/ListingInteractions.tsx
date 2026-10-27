'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Bookmark, Heart, Flag, MessageSquare, Share2, X } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store';
import { useCommunity } from '@/features/community/useCommunity';
import { addPrototypeComment, hidePrototypeComment, submitPrototypeReport, toggleInteraction } from '@/lib/prototypeCommunity';
import { Listing, ModerationReport } from '@/types';

export function ListingInteractions({ listing }: { listing: Listing }) {
  const { user, role } = useAuthStore();
  const data = useCommunity();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<string>();
  const [reportTarget, setReportTarget] = useState<{ id: string; title: string; type: 'listing' | 'comment' }>();
  const [reason, setReason] = useState<ModerationReport['reason']>('Inappropriate content');
  const [details, setDetails] = useState('');
  const [message, setMessage] = useState('');
  const userId = user?.id || '';
  const liked = (data.likes[userId] || []).includes(listing.id);
  const saved = (data.saves[userId] || []).includes(listing.id);
  const comments = data.comments.filter((comment) => comment.listingId === listing.id && !comment.hidden);
  const run = (action: () => void, confirmation = '') => {
    if (!user || role === 'guest') { setMessage('Sign in to like, save, comment or report.'); return; }
    try { action(); setMessage(confirmation); } catch (cause) { setMessage(cause instanceof Error ? cause.message : 'Browser storage unavailable. Please retry.'); }
  };
  return (
    <section aria-label="Listing interactions" className="rounded-2xl border border-border bg-surface p-4 space-y-3 text-text">
      <div className="flex flex-wrap items-center gap-2">
        <button aria-pressed={liked} onClick={() => run(() => toggleInteraction('likes', listing.id, userId))} className={`interaction-button ${liked ? 'text-rose-500' : ''}`}><Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />{liked ? 'Liked' : 'Like'}</button>
        <button aria-pressed={saved} onClick={() => run(() => toggleInteraction('saves', listing.id, userId), saved ? 'Removed from your saved cars.' : 'Added to your private saved cars.')} className={`interaction-button ${saved ? 'text-accent' : ''}`}><Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />{saved ? 'Saved' : 'Save'}</button>
        <button aria-expanded={commentsOpen} onClick={() => setCommentsOpen(!commentsOpen)} className="interaction-button"><MessageSquare className="w-4 h-4" />Comments ({comments.length})</button>
        <button onClick={async () => { try { await navigator.clipboard.writeText(`${location.origin}/car/${listing.slug}`); setMessage('Listing link copied.'); } catch { setMessage('Copy the listing address from your browser to share.'); } }} className="interaction-button"><Share2 className="w-4 h-4" />Share</button>
        <button onClick={() => run(() => setReportTarget({ id: listing.id, title: listing.title, type: 'listing' }))} className="interaction-button"><Flag className="w-4 h-4" />Report</button>
        <Link href="/saved" className="text-xs text-accent underline p-2">My saved cars</Link>
      </div>
      {message && <p role="status" className="text-xs text-muted">{message}{(!user || role === 'guest') && <> <Link href="/login" className="text-accent underline">Sign in</Link></>}</p>}
      {commentsOpen && <div className="border-t border-border pt-4 space-y-4">
        <p className="text-xs text-muted">Be respectful. Your saved and liked cars remain private.</p>
        {comments.length === 0 && <p className="text-sm text-muted">No comments yet. Start the conversation.</p>}
        {comments.filter((comment) => !comment.parentId).map((comment) => <div key={comment.id} className="space-y-2">
          {[comment, ...comments.filter((reply) => reply.parentId === comment.id)].map((item) => <div key={item.id} className={`rounded-xl bg-surface-2 p-3 ${item.parentId ? 'ml-5 border-l-2 border-accent/30' : ''}`}>
            <div className="flex justify-between gap-2 text-xs"><strong>{item.userName}</strong><time className="text-muted">{new Date(item.createdAt).toLocaleDateString()}</time></div>
            <p className="text-sm mt-2 break-words whitespace-pre-wrap">{item.content}</p>
            <div className="flex gap-3 text-xs mt-2 text-accent">
              {!item.parentId && <button onClick={() => { setReplyTo(comment.id); setText(''); }}>Reply</button>}
              <button onClick={() => run(() => setReportTarget({ id: item.id, title: item.content.slice(0, 80), type: 'comment' }))}>Report</button>
              {(item.userId === userId || role === 'admin') && <button onClick={() => run(() => hidePrototypeComment(item.id), 'Comment hidden.')}>Hide</button>}
            </div>
          </div>)}
        </div>)}
        {user && role !== 'guest' ? <form onSubmit={(event) => { event.preventDefault(); run(() => { addPrototypeComment({ listingId: listing.id, userId, userName: user.name, content: text, parentId: replyTo }); setText(''); setReplyTo(undefined); }, 'Comment posted.'); }} className="space-y-2">
          {replyTo && <div className="text-xs text-accent flex items-center gap-2">Replying to {comments.find((comment) => comment.id === replyTo)?.userName}<button type="button" aria-label="Cancel reply" onClick={() => setReplyTo(undefined)}><X className="w-4 h-4" /></button></div>}
          <label className="block text-xs font-semibold" htmlFor={`comment-${listing.id}`}>{replyTo ? 'Your reply' : 'Your comment'}</label>
          <textarea id={`comment-${listing.id}`} value={text} onChange={(event) => setText(event.target.value)} required maxLength={1000} rows={2} className="w-full rounded-xl bg-surface-2 border border-border p-3 text-sm" />
          <button className="px-4 py-2 bg-accent text-white rounded-xl text-xs font-bold">Post {replyTo ? 'reply' : 'comment'}</button>
        </form> : <Link href="/login" className="text-xs text-accent underline">Sign in to comment</Link>}
      </div>}
      {reportTarget && <form onSubmit={(event) => { event.preventDefault(); run(() => { submitPrototypeReport({ targetId: reportTarget.id, targetType: reportTarget.type, targetTitle: reportTarget.title, reason, details: details.trim(), reporterEmail: user!.email }); setReportTarget(undefined); setDetails(''); }, 'Report sent to the local admin moderation queue.'); }} className="border-t border-border pt-4 space-y-3">
        <div className="flex items-center justify-between"><h3 className="text-sm font-bold">Report {reportTarget.type}</h3><button type="button" aria-label="Cancel report" onClick={() => setReportTarget(undefined)}><X className="w-4 h-4" /></button></div>
        <label className="block text-xs">Reason<select aria-label="Report reason" value={reason} onChange={(event) => setReason(event.target.value as ModerationReport['reason'])} className="block w-full mt-1 rounded-xl bg-surface-2 border border-border p-2">{['Inappropriate content', 'Misleading price', 'Scam suspicion', 'Copyright issue', 'Wrong specs'].map((value) => <option key={value}>{value}</option>)}</select></label>
        <label className="block text-xs">Details<textarea required maxLength={1000} value={details} onChange={(event) => setDetails(event.target.value)} className="block w-full mt-1 rounded-xl bg-surface-2 border border-border p-2" /></label>
        <button className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-bold">Submit report</button>
      </form>}
    </section>
  );
}
