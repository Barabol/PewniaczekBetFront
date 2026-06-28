import { SportCategories } from '../components/SportCategories';
import { MatchCard } from '../components/MatchCard';
import { BettingSlip } from '../components/BettingSlip';
import { SocialBettingPanel } from '../components/SocialBettingPanel';
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
  const [selectedSport, setSelectedSport] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    betService.getWinCurrent(selectedSport, 0, 10)
      .then((page) => {
        if (page?.content) {
          setMatches(page.content.map(mapWinBetToMatch));
        } else {
          setMatches([]);
        }
      })
      .catch((err) => {
        console.error('[HOMEPAGE] Failed to load bets:', err);
        setMatches([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedSport]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <SportCategories selectedSport={selectedSport} onSelectSport={setSelectedSport} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SocialBettingPanel />
        </div>
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
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-lg shadow-md overflow-hidden border border-border animate-pulse">
                    <div className="bg-muted px-4 py-2 flex items-center justify-between border-b border-border h-9">
                      <div className="h-4 bg-muted-foreground/20 rounded w-1/4" />
                      <div className="h-4 bg-muted-foreground/20 rounded w-16" />
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="col-span-2 space-y-3">
                          <div className="h-5 bg-muted-foreground/20 rounded w-2/3" />
                          <div className="h-5 bg-muted-foreground/20 rounded w-1/2" />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {Array.from({ length: 3 }).map((_, j) => (
                          <div key={j} className="p-3 rounded-lg border border-border h-16 bg-muted/30 flex flex-col items-center justify-center space-y-1">
                            <div className="h-3 bg-muted-foreground/20 rounded w-4" />
                            <div className="h-4 bg-muted-foreground/20 rounded w-8" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-muted border-t border-border h-9">
                      <div className="h-4 bg-muted-foreground/20 rounded w-1/3" />
                    </div>
                  </div>
                ))
              ) : matches.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border p-6 shadow-md">
                  <p className="text-lg font-medium">Brak dostępnych zakładów dla tego sportu</p>
                  <p className="text-sm mt-1">Wybierz inny sport lub sprawdź ponownie później.</p>
                </div>
              ) : (
                matches.map((match) => (
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
                ))
              )}
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
