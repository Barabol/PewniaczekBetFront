// ========== Backend DTOs (OpenAPI) ==========

export interface UserDto {
  id: number;
  name: string;
  surname: string;
  balance: number;
  freeBetBalance: number;
  wins: number;
  losses: number;
  winsAmount: number;
  lossesAmount: number;
  accountTypeId: number;
  public: boolean;
}

export interface GameDto {
  id: number;
  name: string;
  startDate: string;
  team1: string;
  team2: string;
  sport: string;
  team1Score: number;
  team2Score: number;
}

export interface WinBetDto {
  id: number;
  name: string;
  currentMultiplier: number;
  stopDate: string;
  game: GameDto;
}

export interface ScoreBetDto {
  id: number;
  name: string;
  currentMultiplier: number;
  stopDate: string;
  game: GameDto;
}

export interface PredictionBetDto {
  id: number;
  name: string;
  currentMultiplier: number;
  startDate: string;
  stopDate: string;
  trueBets: number;
  falseBets: number;
  pot: number;
  endedWith: boolean;
}

export interface WinBetPlaceDto {
  betId: number;
  ammount: number;
  isFreeBet: boolean;
  team: boolean;
}

export interface ScoreBetPlaceDto {
  betId: number;
  ammount: number;
  isFreeBet: boolean;
  team1Score: number;
  team2Score: number;
}

export interface PredictionBetPlaceDto {
  id: number;
  amount: number;
  prediction: boolean;
  isFreeBet: boolean;
}

export interface OathDto {
  service: string;
  login: string;
  avatarUrl: string;
  url: string;
}

export interface SortObject {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface PageableObject {
  offset: number;
  sort: SortObject;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
}

export interface PageWinBetDto {
  totalElements: number;
  totalPages: number;
  size: number;
  content: WinBetDto[];
  number: number;
  sort: SortObject;
  pageable: PageableObject;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface PageScoreBetDto {
  totalElements: number;
  totalPages: number;
  size: number;
  content: ScoreBetDto[];
  number: number;
  sort: SortObject;
  pageable: PageableObject;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface PagePredictionBetDto {
  totalElements: number;
  totalPages: number;
  size: number;
  content: PredictionBetDto[];
  number: number;
  sort: SortObject;
  pageable: PageableObject;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// ========== Existing UI Types (kept for compatibility) ==========

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  balance: number;
  surname?: string;
  freeBetBalance?: number;
  wins?: number;
  losses?: number;
  winsAmount?: number;
  lossesAmount?: number;
  accountTypeId?: number;
  public?: boolean;
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
  betId?: number;
  isFreeBet?: boolean;
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

export interface RegisterFormData {
  name: string;
  surname: string;
  email: string;
  password: string;
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

// Payment Types
export interface RedirectView {
  url?: string;
  statusCode?: Record<string, unknown>;
  contextRelative?: boolean;
  http10Compatible?: boolean;
  exposeModelAttributes?: boolean;
}

// Sport Categories
export interface SportCategory {
  name: string;
  icon: any;
  count: number;
  slug?: string;
}
