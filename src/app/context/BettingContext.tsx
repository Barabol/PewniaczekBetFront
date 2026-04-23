import { createContext, useContext, useState, ReactNode } from 'react';
import type { Bet } from '../types';

interface BettingContextType {
  bets: Bet[];
  addBet: (team: string, odd: number, match: string) => void;
  removeBet: (id: string) => void;
  clearAllBets: () => void;
  totalOdds: number;
  potentialWin: (stake: number) => number;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export function BettingProvider({ children }: { children: ReactNode }) {
  const [bets, setBets] = useState<Bet[]>([]);

  const addBet = (team: string, odd: number, match: string) => {
    const newBet: Bet = {
      team,
      odd,
      match,
      id: `${Date.now()}-${Math.random()}`,
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

  return (
    <BettingContext.Provider
      value={{
        bets,
        addBet,
        removeBet,
        clearAllBets,
        totalOdds,
        potentialWin,
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
