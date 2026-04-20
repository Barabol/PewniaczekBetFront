import { useState } from 'react';
import { SportCategories } from '../components/SportCategories';
import { MatchCard } from '../components/MatchCard';
import { BettingSlip } from '../components/BettingSlip';
import { Flame, Star } from 'lucide-react';

interface Bet {
  team: string;
  odd: number;
  match: string;
  id: string;
}

const mockMatches = [
  {
    id: 1,
    league: 'Premier League',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    time: 'Dzisiaj 20:00',
    odds: { home: 2.45, draw: 3.20, away: 2.90 },
    isLive: false,
  },
  {
    id: 2,
    league: 'La Liga',
    homeTeam: 'Real Madryt',
    awayTeam: 'Barcelona',
    time: 'Dzisiaj 22:00',
    odds: { home: 1.95, draw: 3.60, away: 3.80 },
    isLive: false,
  },
  {
    id: 3,
    league: 'Bundesliga',
    homeTeam: 'Bayern Monachium',
    awayTeam: 'Borussia Dortmund',
    time: 'Jutro 18:30',
    odds: { home: 1.75, draw: 3.80, away: 4.50 },
    isLive: false,
  },
  {
    id: 4,
    league: 'Serie A',
    homeTeam: 'Juventus',
    awayTeam: 'AC Milan',
    time: 'Dzisiaj 21:45',
    odds: { home: 2.10, draw: 3.40, away: 3.30 },
    isLive: false,
  },
  {
    id: 5,
    league: 'Ligue 1',
    homeTeam: 'PSG',
    awayTeam: 'Olympique Marsylia',
    time: 'Jutro 20:00',
    odds: { home: 1.55, draw: 4.20, away: 5.50 },
    isLive: false,
  },
  {
    id: 6,
    league: 'Ekstraklasa',
    homeTeam: 'Legia Warszawa',
    awayTeam: 'Lech Poznań',
    time: 'Jutro 17:30',
    odds: { home: 2.25, draw: 3.10, away: 3.20 },
    isLive: false,
  },
];

interface HomePageProps {
  bets: Bet[];
  onAddToBet: (team: string, odd: number, match: string) => void;
  onRemoveBet: (id: string) => void;
  onClearAll: () => void;
}

export function HomePage({ bets, onAddToBet, onRemoveBet, onClearAll }: HomePageProps) {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <SportCategories />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-6 h-6" />
              <h2>Gorące mecze</h2>
            </div>
            <p className="text-sm opacity-90">Sprawdź najciekawsze spotkania tego weekendu!</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <h2>Polecane zakłady</h2>
            </div>
            <div className="grid gap-4">
              {mockMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  league={match.league}
                  homeTeam={match.homeTeam}
                  awayTeam={match.awayTeam}
                  time={match.time}
                  odds={match.odds}
                  isLive={match.isLive}
                  onAddToBet={onAddToBet}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <BettingSlip
            bets={bets}
            onRemoveBet={onRemoveBet}
            onClearAll={onClearAll}
          />
        </div>
      </div>
    </div>
  );
}
