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

export interface RedirectView {
  url?: string;
}

// ========== UI Types ==========

export interface User {
  id: string;
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

export interface Bet {
  team: string;
  odd: number;
  match: string;
  id: string;
  betId?: number;
  isFreeBet?: boolean;
}

export type BetType = 'WIN' | 'SCORE' | 'PREDICTION';
export type BetStatus = 'WIN' | 'LOSE' | 'PENDING';

export interface BetHistoryItem {
  id: number;
  type: BetType;
  gameName: string;
  sport: string;
  team1: string;
  team2: string;
  stake: number;
  multiplier: number;
  status: BetStatus;
  date: string;
  payout: number;
}
