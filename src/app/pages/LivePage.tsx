import { MatchCard } from '../components/MatchCard';
import { BettingSlip } from '../components/BettingSlip';
import { Radio } from 'lucide-react';
import { useBetting } from '../context';

const liveMatches = [
  {
    id: 1,
    league: 'La Liga',
    homeTeam: 'Real Madryt',
    awayTeam: 'Barcelona',
    time: '45:23',
    odds: { home: 1.95, draw: 3.60, away: 3.80 },
    isLive: true,
  },
  {
    id: 2,
    league: 'Ligue 1',
    homeTeam: 'PSG',
    awayTeam: 'Olympique Marsylia',
    time: '67:12',
    odds: { home: 1.55, draw: 4.20, away: 5.50 },
    isLive: true,
  },
  {
    id: 3,
    league: 'Serie A',
    homeTeam: 'Inter Mediolan',
    awayTeam: 'Napoli',
    time: '23:45',
    odds: { home: 2.15, draw: 3.30, away: 3.40 },
    isLive: true,
  },
  {
    id: 4,
    league: 'Premier League',
    homeTeam: 'Chelsea',
    awayTeam: 'Arsenal',
    time: '78:56',
    odds: { home: 2.80, draw: 3.10, away: 2.50 },
    isLive: true,
  },
];

export function LivePage() {
  const { bets, addBet, removeBet, clearAllBets } = useBetting();
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Radio className="w-6 h-6 animate-pulse" />
              <h2>Zakłady Live</h2>
            </div>
            <p className="text-sm opacity-90">Obstawiaj mecze na żywo z dynamicznie zmieniającymi się kursami!</p>
          </div>

          <div className="grid gap-4">
            {liveMatches.map((match) => (
              <MatchCard
                key={match.id}
                league={match.league}
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
                time={match.time}
                odds={match.odds}
                isLive={match.isLive}
                onAddToBet={addBet}
              />
            ))}
          </div>
        </div>

        <div>
          <BettingSlip
            bets={bets}
            onRemoveBet={removeBet}
            onClearAll={clearAllBets}
          />
        </div>
      </div>
    </div>
  );
}
