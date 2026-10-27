'use client';

import React, { useState } from 'react';
import { logLead } from '@/lib/mockApi';
import { useToast } from '@/components/ui/Toast';
import { ContactPreference } from '@/types';
import { MessageSquare, Phone, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

interface ContactActionButtonsProps {
  listingId: string;
  sellerPhone: string;
  sellerName: string;
  vehicleTitle: string;
  contactPreference: ContactPreference;
  isDealerVerified?: boolean;
  className?: string;
}

export function ContactActionButtons({
  listingId,
  sellerPhone,
  sellerName,
  vehicleTitle,
  contactPreference,
  isDealerVerified = false,
  className = '',
}: ContactActionButtonsProps) {
  const { success, info } = useToast();
  const [leadLogged, setLeadLogged] = useState(false);

  const cleanPhone = sellerPhone.replace(/[^\d+]/g, '');

  const handleWhatsApp = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await logLead(listingId, 'whatsapp');
      setLeadLogged(true);
      success(
        'WhatsApp Lead Generated!',
        `Recorded private lead for ${sellerName}. Opening WhatsApp chat...`
      );
      
      const message = encodeURIComponent(
        `Hello ${sellerName}, I am contacting you regarding your listing: "${vehicleTitle}" on ${SITE_CONFIG.name} Dubai. Is it still available for inspection?`
      );
      const url = `https://wa.me/${cleanPhone.replace('+', '')}?text=${message}`;
      window.open(url, '_blank');
    } catch (err) {
      console.error(err);
    }
  };

  const handleCall = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await logLead(listingId, 'call');
      setLeadLogged(true);
      info(
        'Call Lead Logged',
        `Seller direct dial event recorded for ${sellerName}. Initiating call to ${sellerPhone}...`
      );
      window.location.href = `tel:${cleanPhone}`;
    } catch (err) {
      console.error(err);
    }
  };

  const showWhatsApp = contactPreference === 'whatsapp' || contactPreference === 'both';
  const showCall = contactPreference === 'call' || contactPreference === 'both';

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Dealer verification pill */}
      {isDealerVerified && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
          <span>Verified Dubai Dealership (Direct Response Guaranteed)</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        {showWhatsApp && (
          <button
            onClick={handleWhatsApp}
            className="flex-1 py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/40 transition-all active:scale-[0.98]"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp</span>
          </button>
        )}

        {showCall && (
          <button
            onClick={handleCall}
            className="flex-1 py-3.5 px-4 rounded-xl bg-[#3B82F6] hover:bg-[#2563eb] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#3B82F6]/20 hover:shadow-[#3B82F6]/40 transition-all active:scale-[0.98]"
          >
            <Phone className="w-4 h-4 fill-white" />
            <span>Call Seller</span>
          </button>
        )}
      </div>

      <p className="text-[11px] text-muted text-center flex items-center justify-center gap-1">
        <Sparkles className="w-3 h-3 text-accent" />
        <span>No middleman or broker fees • Direct Dubai owner contact</span>
      </p>
    </div>
  );
}
