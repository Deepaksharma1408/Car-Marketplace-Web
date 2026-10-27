'use client';

import React from 'react';
import Link from 'next/link';
import { Listing } from '@/types';
import { formatAed, formatKm } from '@/lib/utils';
import { 
  Play, 
  ShieldCheck, 
  MapPin, 
  Gauge, 
  Calendar, 
  MessageSquare, 
  Phone,
  Eye,
  Camera
} from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  className?: string;
  compactMobile?: boolean;
}

export function ListingCard({ listing, className = '', compactMobile = false }: ListingCardProps) {
  const isVideo = listing.mediaPath !== 'photos_only' && listing.videoUrl;
  const isSold = listing.status === 'sold';
  const coverImage = listing.photos[listing.coverPhotoIndex] || listing.photos[0];

  return (
    <div
      className={`group relative rounded-2xl bg-surface border border-border hover:border-accent/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 flex flex-col ${className}`}
    >
      {/* 9:16 Media Container */}
      <Link href={`/car/${listing.slug}`} className={`relative w-full overflow-hidden bg-black/60 block ${compactMobile ? 'aspect-[4/5] sm:aspect-[9/16]' : 'aspect-[9/16]'}`}>
        <img
          src={coverImage || listing.videoPoster}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-start justify-between pointer-events-none z-10">
          <div className="flex flex-col gap-1.5 items-start">
            {listing.isDealerVerified && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#12151C]/90 text-accent border border-accent/40 backdrop-blur-md flex items-center gap-1 shadow-lg">
                <ShieldCheck className="w-3 h-3 text-accent" />
                <span>Verified Dealer</span>
              </span>
            )}
            {listing.condition === 'Brand New' && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent-2/20 text-accent-2 border border-accent-2/40 backdrop-blur-md">
                Brand New
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 items-end">
            {isSold ? (
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-danger/90 text-white backdrop-blur-md shadow-lg uppercase tracking-wider">
                Sold
              </span>
            ) : isVideo ? (
              <span className="p-1.5 rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-md flex items-center gap-1 text-[10px]">
                <Play className="w-3 h-3 fill-white" />
                <span className="font-mono">{listing.videoDuration || 15}s</span>
              </span>
            ) : (
              <span className="p-1.5 rounded-full bg-black/60 border border-white/20 text-white backdrop-blur-md flex items-center gap-1 text-[10px]">
                <Camera className="w-3 h-3" />
                <span>{listing.photos.length}</span>
              </span>
            )}
          </div>
        </div>

        {/* Media Type Note for Photos Only */}
        {listing.mediaPath === 'photos_only' && (
          <div className="absolute top-12 left-3 pointer-events-none">
            <span className="px-2 py-0.5 rounded text-[9px] bg-black/70 text-muted backdrop-blur-sm">
              Photos Only
            </span>
          </div>
        )}

        {/* Bottom Media Overlay */}
        <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end ${compactMobile ? 'p-3 sm:p-4' : 'p-4'}`}>
          <div className="flex items-center gap-1 text-[11px] text-accent font-semibold mb-1">
            <MapPin className="w-3 h-3" />
            <span>{listing.dubaiArea}</span>
          </div>

          <h3 className={`font-heading font-bold text-white line-clamp-1 group-hover:text-accent transition-colors ${compactMobile ? 'text-sm sm:text-base' : 'text-base'}`}>
            {listing.title}
          </h3>

          <div className={`flex items-baseline justify-between mt-1 ${compactMobile ? 'flex-wrap gap-x-2' : ''}`}>
            <span className={`font-heading font-extrabold text-accent ${compactMobile ? 'text-base sm:text-lg' : 'text-lg'}`}>
              {formatAed(listing.price)}
            </span>
            <span className="text-[11px] text-white/70 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-muted" />
              {formatKm(listing.mileage)}
            </span>
          </div>
        </div>
      </Link>

      {/* Card Info Footer */}
      <div className={`bg-surface-2/60 border-t border-border flex items-center justify-between gap-2 text-xs ${compactMobile ? 'p-2.5 sm:p-3.5' : 'p-3.5'}`}>
        <div className="flex items-center gap-2 truncate">
          {listing.sellerAvatar && (
            <img
              src={listing.sellerAvatar}
              alt={listing.sellerName}
              className="w-5 h-5 rounded-full object-cover border border-border shrink-0"
            />
          )}
          <span className="text-muted truncate text-[11px]">{listing.sellerName}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {listing.contactPreference !== 'call' && (
            <span className="text-[#25D366]" title="WhatsApp Available">
              <MessageSquare className="w-3.5 h-3.5" />
            </span>
          )}
          {listing.contactPreference !== 'whatsapp' && (
            <span className="text-[#3B82F6]" title="Direct Call Available">
              <Phone className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
