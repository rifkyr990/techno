export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum Grade {
  SAPPHIRE = 'Sapphire',
  RUBY = 'Ruby',
  DIAMOND = 'Diamond',
}

export enum SystemPhase {
  ACCUMULATION = 'Rutin Bulanan (Akumulasi)',
  JUDGMENT = 'Hari Penghakiman (Cut-Off)',
  REDEEM = 'Hari Penukaran (Redeem)',
  FULFILLMENT = 'Hari Pengambilan (Fulfillment)',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  grade: Grade;
  tokens: number;
  inactiveMonthsConsecutive: number;
  inactiveMonthsCumulative: number;
  tokenExpiryDate: string; // ISO Date
  history: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  date: string;
  description: string;
  change: number;
  type: 'EARN' | 'SPEND' | 'PENALTY' | 'ADJUSTMENT';
}

export interface Reward {
  id: string;
  name: string;
  cost: number;
  image: string;
  stock: number;
}

export interface PickupSlot {
  id: string;
  datetime: string;
  quota: number;
  booked: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}