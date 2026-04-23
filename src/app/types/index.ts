// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  phone?: string;
  registrationDate?: string;
}

// Betting Types
export interface Bet {
  team: string;
  odd: number;
  match: string;
  id: string;
  league?: string;
  timestamp?: number;
}

export interface Match {
  id: number;
  league: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  odds: MatchOdds;
  isLive: boolean;
  homeScore?: number;
  awayScore?: number;
}

export interface MatchOdds {
  home: number;
  draw: number;
  away: number;
}

export type BetStatus = 'pending' | 'won' | 'lost' | 'cancelled';

export interface BetHistory {
  id: number;
  date: string;
  match: string;
  bet: string;
  odd: number;
  stake: number;
  status: BetStatus;
  winnings: number;
}

// Transaction Types
export type TransactionType = 'deposit' | 'withdraw' | 'bet' | 'win' | 'bonus';

export interface Transaction {
  id: number;
  type: TransactionType;
  amount: number;
  method: string;
  date: string;
  status?: 'pending' | 'completed' | 'failed';
}

// Promotion Types
export interface Promotion {
  id: number;
  title: string;
  description: string;
  terms: string;
  color: string;
  icon: string;
  expiryDate?: string;
  minDeposit?: number;
}

// Settings Types
export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface ResponsibleGamingLimits {
  dailyLimit: string;
  weeklyLimit: string;
  monthlyLimit: string;
}

export interface UserSettings {
  notifications: NotificationSettings;
  limits: ResponsibleGamingLimits;
  twoFactorAuth: boolean;
  language: string;
  currency: string;
}

// Statistics Types
export interface UserStatistics {
  totalBets: number;
  wonBets: number;
  lostBets: number;
  pendingBets: number;
  winRate: number;
  totalStaked: number;
  totalWon: number;
  profit: number;
  avgOdds: number;
  biggestWin: number;
  currentStreak: number;
}

// Navigation Types
export type PageRoute =
  | 'home'
  | 'live'
  | 'esports'
  | 'promotions'
  | 'results'
  | 'login'
  | 'profile'
  | 'history'
  | 'wallet'
  | 'settings'
  | 'stats';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData extends LoginFormData {
  name: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface DepositFormData {
  amount: number;
  paymentMethod: 'card' | 'bank_transfer' | 'e_wallet';
}

export interface WithdrawFormData {
  amount: number;
  destination: string;
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  error?: string;
}

// Sport Categories
export interface SportCategory {
  name: string;
  icon: any; // Lucide icon component
  count: number;
  slug?: string;
}
