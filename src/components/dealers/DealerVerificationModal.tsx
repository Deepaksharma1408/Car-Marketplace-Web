'use client';

import React, { useState } from 'react';
import { requestDealerVerification } from '@/lib/mockApi';
import { useToast } from '@/components/ui/Toast';
import { 
  Building2, 
  FileText, 
  Upload, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  Calendar
} from 'lucide-react';

interface DealerVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DealerVerificationModal({ isOpen, onClose }: DealerVerificationModalProps) {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    dealerName: '',
    contactPerson: '',
    email: '',
    phone: '',
    tradeLicenseNumber: '',
    tradeLicenseExpiry: '',
    fileName: 'dubai_economy_trade_license.pdf',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dealerName || !formData.email || !formData.tradeLicenseNumber) {
      error('Missing Information', 'Please fill out all required trade license fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await requestDealerVerification({
        dealerName: formData.dealerName,
        contactPerson: formData.contactPerson || 'Authorized Representative',
        email: formData.email,
        phone: formData.phone || '+971 4 000 0000',
        tradeLicenseNumber: formData.tradeLicenseNumber,
        tradeLicenseExpiry: formData.tradeLicenseExpiry || '2027-12-31',
        documentUrl: `/docs/${formData.fileName}`,
      });

      success(
        'Verification Application Submitted!',
        'Your commercial application is now in the Admin Dealer Queue for compliance review.'
      );
      onClose();
    } catch (err) {
      error('Submission Error', 'Failed to submit dealer verification request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-surface border border-border max-w-lg w-full rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-muted hover:text-text p-1 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-text">
              Request Dealer Verification
            </h3>
            <p className="text-xs text-muted">
              Official Dubai Department of Economy & Tourism (DED) license review
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-text mb-1">
              Dealership Legal Business Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Al-Mansoor Prestige Motors LLC"
              value={formData.dealerName}
              onChange={(e) => setFormData({ ...formData, dealerName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-text mb-1">
                Authorized Manager Name
              </label>
              <input
                type="text"
                placeholder="e.g. Tariq Al-Mansoor"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">
                Official Business Phone *
              </label>
              <input
                type="tel"
                required
                placeholder="+971 4 333 4455"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-text mb-1">
              Corporate Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="licensing@almansoor-motors.ae"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-text mb-1">
                DED Commercial License No. *
              </label>
              <input
                type="text"
                required
                placeholder="DED-CN-8849201"
                value={formData.tradeLicenseNumber}
                onChange={(e) => setFormData({ ...formData, tradeLicenseNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent uppercase font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-text mb-1">
                License Expiry Date *
              </label>
              <input
                type="date"
                required
                value={formData.tradeLicenseExpiry}
                onChange={(e) => setFormData({ ...formData, tradeLicenseExpiry: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-2 border border-border text-text placeholder:text-muted focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Document Upload UI */}
          <div>
            <label className="block font-semibold text-text mb-1">
              Upload DED Trade License Copy (PDF / Scan)
            </label>
            <div className="p-4 rounded-xl border border-dashed border-border hover:border-accent/60 bg-surface-2/60 text-center cursor-pointer transition-colors">
              <Upload className="w-5 h-5 text-accent mx-auto mb-1" />
              <p className="text-text font-medium text-xs">{formData.fileName}</p>
              <p className="text-[10px] text-muted mt-0.5">Click or drag file to replace</p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-surface-2 text-text font-medium hover:bg-surface-3 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-bg font-bold shadow-lg shadow-accent/20 transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Verifying...' : 'Submit Verification Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
