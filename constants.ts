import { Grade, PickupSlot, Reward, SystemPhase, User, UserRole } from "./types";

export const MOCK_USER: User = {
  id: 'u-101',
  name: 'Budi Santoso',
  email: 'budi.santoso@techno.co.id',
  role: UserRole.USER,
  grade: Grade.RUBY,
  tokens: 145,
  inactiveMonthsConsecutive: 1,
  inactiveMonthsCumulative: 2,
  tokenExpiryDate: '2026-12-31',
  history: [
    { id: 'h-1', date: '2024-01-15', description: 'Sprint Completion (Jan)', change: 20, type: 'EARN' },
    { id: 'h-2', date: '2024-02-15', description: 'Sprint Completion (Feb)', change: 20, type: 'EARN' },
    { id: 'h-3', date: '2024-03-01', description: 'Redeemed Mechanical Keyboard', change: -60, type: 'SPEND' },
    { id: 'h-4', date: '2024-04-15', description: 'Sprint Completion (Apr)', change: 20, type: 'EARN' },
  ]
};

export const MOCK_REWARDS: Reward[] = [
  { id: 'r-1', name: 'Logitech MX Master 3S', cost: 120, stock: 5, image: 'https://picsum.photos/id/1/300/300' },
  { id: 'r-2', name: 'Keychron K2 Mechanical', cost: 100, stock: 8, image: 'https://picsum.photos/id/2/300/300' },
  { id: 'r-3', name: 'Sony WH-1000XM5', cost: 350, stock: 2, image: 'https://picsum.photos/id/3/300/300' },
  { id: 'r-4', name: '24" IPS Monitor', cost: 180, stock: 4, image: 'https://picsum.photos/id/4/300/300' },
  { id: 'r-5', name: 'Office Ergonomic Chair', cost: 250, stock: 3, image: 'https://picsum.photos/id/5/300/300' },
  { id: 'r-6', name: 'Shopping Voucher 500k', cost: 25, stock: 50, image: 'https://picsum.photos/id/6/300/300' },
];

export const MOCK_SLOTS: PickupSlot[] = [
  { id: 's-1', datetime: '2024-06-20T09:00:00', quota: 5, booked: 2 },
  { id: 's-2', datetime: '2024-06-20T13:00:00', quota: 5, booked: 5 },
  { id: 's-3', datetime: '2024-06-21T09:00:00', quota: 5, booked: 1 },
  { id: 's-4', datetime: '2024-06-21T15:00:00', quota: 5, booked: 0 },
];

export const PHASE_DESCRIPTIONS = {
  [SystemPhase.ACCUMULATION]: "Routine sprint activity upload. Redemption Locked.",
  [SystemPhase.JUDGMENT]: "Calculating penalties and grades. System maintenance.",
  [SystemPhase.REDEEM]: "Redemption period OPEN. Book your rewards now.",
  [SystemPhase.FULFILLMENT]: "Physical handover of goods. Bring ID.",
};

export const SPRINT_CONVERSION_RATE = 20;