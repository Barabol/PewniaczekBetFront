import { MatchCard } from '../components/MatchCard';
import { BettingSlip } from '../components/BettingSlip';
import { Gamepad2 } from 'lucide-react';
import { useBetting } from '../context';
import { useState, useEffect } from 'react';
import { betService } from '../services';
import type { PredictionBetDto } from '../types';

function mapPredictionToMatch(bet: PredictionBetDto) {
  return {
    id: bet.id,
    league: 'E-sport',
    homeTeam: 'Tak',
    awayTeam: 'Nie',
    time: new Date(bet.startDate).toLocaleString('pl-PL', {
      day: 'numeric',
      month: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    odds: {
      home: bet.currentMultiplier || 2.0,
      draw: 1.0,
      away: bet.currentMultiplier || 2.0,
    },
    isLive: false,
    betId: bet.id,
    betType: 'prediction' as const,
  };
}

export function EsportsPage() {
  const { bets, addBet, removeBet, clearAllBets } = useBetting();
  const [matches, setMatches] = useState<ReturnType<typeof mapPredictionToMatch>[]>([]);

  useEffect(() => {
    betService.getPredictionCurrent(0, 10).then((page) => {
      setMatches(page.content.map(mapPredictionToMatch));
    }).catch(() => {});
  }, []);

  const games = [
    { name: 'CS:GO', matches: 45 },
    { name: 'League of Legends', matches: 67 },
    { name: 'Dota 2', matches: 34 },
    { name: 'Valorant', matches: 28 },
    { name: 'Rocket League', matches: 15 },
    { name: 'FIFA', matches: 23 },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="bg-card rounded-lg shadow-md p-4 border border-border">
          <h3 className="mb-4">Popularne gry</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {games.map((game) => (
              <button
                key={game.name}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-green-500 hover:bg-green-500/10 transition"
              >
                <Gamepad2 className="w-6 h-6 text-green-600" />
                <span className="text-sm text-center">{game.name}</span>
                <span className="text-xs text-muted-foreground">{game.matches} meczów</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Gamepad2 className="w-6 h-6" />
              <h2>E-sport</h2>
            </div>
            <p className="text-sm opacity-90">Obstawiaj najlepsze drużyny e-sportowe na świecie!</p>
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
