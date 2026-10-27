import { ModerationReport } from '@/types';

export const INITIAL_REPORTS: ModerationReport[] = [
  {
    id: 'rep_1',
    targetType: 'listing',
    targetId: 'car_12',
    targetTitle: '2024 Tesla Cybertruck Cyberbeast Tri-Motor',
    reason: 'Misleading price',
    details: 'Seller listed AED 690,000 in title but description mentions import tariff is additional 10%. Please clarify total on-the-road price.',
    reporterEmail: 'buyer.dubai@invest.ae',
    status: 'open',
    createdAt: '2026-10-26T14:20:00Z',
  },
  {
    id: 'rep_2',
    targetType: 'comment',
    targetId: 'com_99',
    targetTitle: 'Comment on 2024 Ferrari SF90 Stradale',
    reason: 'Inappropriate content',
    details: 'User posted unverified claims accusing the dealership of mileage tampering without any RTA inspection report.',
    reporterEmail: 'concierge@alfuttaim-demo.ae',
    status: 'open',
    createdAt: '2026-10-25T19:40:00Z',
  },
  {
    id: 'rep_3',
    targetType: 'user',
    targetId: 'user_ind_5',
    targetTitle: 'User Profile: Alexander Novak',
    reason: 'Scam suspicion',
    details: 'User has attempted to post multiple listings significantly below market salvage value demanding upfront reservation deposits.',
    reporterEmail: 'security-watch@dubaiautodrome.ae',
    status: 'open',
    createdAt: '2026-10-24T11:00:00Z',
  },
];
