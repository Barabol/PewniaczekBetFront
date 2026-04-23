import { Bet } from '../context/BettingContext';

export function calculateTotalOdds(bets: Bet[]): number {
  if (bets.length === 0) return 1;
  return bets.reduce((acc, bet) => acc * bet.odd, 1);
}

export function calculatePotentialWin(bets: Bet[], stake: number): number {
  const totalOdds = calculateTotalOdds(bets);
  return stake * totalOdds;
}

export function calculateProfit(bets: Bet[], stake: number): number {
  const potentialWin = calculatePotentialWin(bets, stake);
  return potentialWin - stake;
}

export function formatCurrency(amount: number, currency: string = 'PLN'): string {
  return `${amount.toFixed(2)} ${currency}`;
}

export function formatOdd(odd: number): string {
  return odd.toFixed(2);
}
