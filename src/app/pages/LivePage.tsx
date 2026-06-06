import { MatchCard } from '../components/MatchCard';
import { BettingSlip } from '../components/BettingSlip';
import { Radio } from 'lucide-react';
import { useBetting } from '../context';
import { useState, useEffect } from 'react';
import { betService } from '../services';
import type { WinBetDto, ScoreBetDto } from '../types';

function mapToMatch(bet: WinBetDto | ScoreBetDto) {
  return {
    id: bet.id,
    league: bet.game?.sport || bet.name || 'Sport',
    homeTeam: bet.game?.team1 || 'Drużyna 1',
    awayTeam: bet.game?.team2 || 'Drużyna 2',
    time: 'LIVE',
    odds: {
      home: bet.currentMultiplier || 2.0,
      draw: 3.0,
      away: 2.0,
    },
    isLive: true,
    betId: bet.id,
    betType: 'win' as const,
  };
}

export function LivePage() {
  const { bets, addBet, removeBet, clearAllBets } = useBetting();
  const [matches, setMatches] = useState<ReturnType<typeof mapToMatch>[]>([]);

  useEffect(() => {
    betService.getWinCurrent(undefined, 0, 10).then((page) => {
      setMatches(page.content.map(mapToMatch));
    }).catch(() => {});
  }, []);

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

        <div>
          <BettingSlip />
        </div>
      </div>
    </div>
  );
}
