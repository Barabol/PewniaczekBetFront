import { createContext, useContext, useState, ReactNode } from 'react';
import type { Bet } from '../types';
import { betService } from '../services';
import { useAuth } from './AuthContext';

type BetType = 'win' | 'score' | 'prediction';

interface BettingContextType {
  bets: Bet[];
  addBet: (team: string, odd: number, match: string, betId?: number, betType?: BetType) => void;
  removeBet: (id: string) => void;
  clearAllBets: () => void;
  totalOdds: number;
  potentialWin: (stake: number) => number;
  placeBets: (stake: number, isFreeBet?: boolean) => Promise<void>;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export function BettingProvider({ children }: { children: ReactNode }) {
  const [bets, setBets] = useState<Bet[]>([]);
  const { refreshUser } = useAuth();

  const addBet = (team: string, odd: number, match: string, betId?: number, betType?: BetType) => {
    const newBet: Bet = {
      team,
      odd,
      match,
      id: `${Date.now()}-${Math.random()}`,
      betId,
      isFreeBet: false,
    };

    const existingBetIndex = bets.findIndex(bet => bet.match === match);

    if (existingBetIndex !== -1) {
      const updatedBets = [...bets];
      updatedBets[existingBetIndex] = newBet;
      setBets(updatedBets);
    } else {
      setBets([...bets, newBet]);
    }
  };

  const removeBet = (id: string) => {
    setBets(bets.filter(bet => bet.id !== id));
  };

  const clearAllBets = () => {
    setBets([]);
  };

  const totalOdds = bets.reduce((acc, bet) => acc * bet.odd, 1);

  const potentialWin = (stake: number) => {
    return stake * totalOdds;
  };

  const placeBets = async (stake: number, isFreeBet = false) => {
    for (const bet of bets) {
      if (bet.betId) {
        await betService.placeWinBet({
          betId: bet.betId,
          ammount: Math.round((stake / bets.length) * 100),
          isFreeBet,
          team: bet.team === 'home',
        });
      }
    }
    clearAllBets();
    await refreshUser();
  };

  return (
    <BettingContext.Provider
      value={{
        bets,
        addBet,
        removeBet,
        clearAllBets,
        totalOdds,
        potentialWin,
        placeBets,
      }}
    >
      {children}
    </BettingContext.Provider>
  );
}

export function useBetting() {
  const context = useContext(BettingContext);
  if (context === undefined) {
    throw new Error('useBetting must be used within a BettingProvider');
  }
  return context;
}
