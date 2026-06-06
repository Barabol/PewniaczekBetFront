import { SportCategories } from '../components/SportCategories';
import { MatchCard } from '../components/MatchCard';
import { BettingSlip } from '../components/BettingSlip';
import { Flame, Star } from 'lucide-react';
import { useBetting } from '../context';
import { useState, useEffect } from 'react';
import { betService } from '../services';
import type { WinBetDto } from '../types';

function mapWinBetToMatch(bet: WinBetDto) {
  const now = new Date();
  const stopDate = new Date(bet.stopDate);
  const isLive = stopDate > now && stopDate.getTime() - now.getTime() < 7200000;

  return {
    id: bet.id,
    league: bet.game?.sport || bet.name || 'Sport',
    homeTeam: bet.game?.team1 || 'Drużyna 1',
    awayTeam: bet.game?.team2 || 'Drużyna 2',
    time: isLive
      ? 'LIVE'
      : new Date(bet.stopDate).toLocaleString('pl-PL', {
          day: 'numeric',
          month: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    odds: {
      home: bet.currentMultiplier || 2.0,
      draw: 3.0,
      away: 2.0,
    },
    isLive,
    betId: bet.id,
    betType: 'win' as const,
  };
}

export function HomePage() {
  const { bets, addBet, removeBet, clearAllBets } = useBetting();
  const [matches, setMatches] = useState<ReturnType<typeof mapWinBetToMatch>[]>([]);

  useEffect(() => {
    betService.getWinCurrent(undefined, 0, 10).then((page) => {
      setMatches(page.content.map(mapWinBetToMatch));
    }).catch(() => {
      // Fallback to empty
    });
  }, []);

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
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  league={match.league}
                  homeTeam={match.homeTeam}
                  awayTeam={match.awayTeam}
                  time={match.time}
                  odds={match.odds}
                  isLive={match.isLive}
                  betId={match.betId}
                  betType={match.betType}
                  onAddToBet={addBet}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          <BettingSlip />
        </div>
      </div>
    </div>
  );
}
