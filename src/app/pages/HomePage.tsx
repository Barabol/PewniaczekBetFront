import { SportCategories } from '../components/SportCategories';
import { MatchCard } from '../components/MatchCard';
import { BettingSlip } from '../components/BettingSlip';
import { SocialBettingPanel } from '../components/SocialBettingPanel';
import { ScoreMatchCard } from '../components/ScoreMatchCard';
import { PredictionCard } from '../components/PredictionCard';
import { Flame, Star } from 'lucide-react';
import { useBetting } from '../context';
import { useState, useEffect } from 'react';
import { betService } from '../services';
import type { WinBetDto, ScoreBetDto, PredictionBetDto } from '../types';

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
      draw: bet.currentMultiplier || 2.0,
      away: bet.currentMultiplier || 2.0,
    },
    isLive,
    betId: bet.id,
    betType: 'win' as const,
  };
}

export function HomePage() {
  const { bets, addBet, removeBet, clearAllBets } = useBetting();
  const [matches, setMatches] = useState<ReturnType<typeof mapWinBetToMatch>[]>([]);
  const [scoreBets, setScoreBets] = useState<ScoreBetDto[]>([]);
  const [predictionBets, setPredictionBets] = useState<PredictionBetDto[]>([]);
  const [selectedSport, setSelectedSport] = useState<string | undefined>(undefined);
  const [betCategory, setBetCategory] = useState<'win' | 'score' | 'prediction'>('win');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedSport, betCategory]);

  useEffect(() => {
    setLoading(true);
    if (betCategory === 'win') {
      if (selectedSport === undefined) {
        betService.getWinSports()
          .then((sportsList) => {
            const promises = (sportsList || []).map((s) =>
              betService.getWinCurrent(s.sportName, currentPage, 10)
                .then((page) => ({ content: page?.content || [], totalPages: page?.totalPages || 0 }))
                .catch((err) => {
                  console.error(`[HOMEPAGE] Failed to load bets for sport ${s.sportName}:`, err);
                  return { content: [], totalPages: 0 };
                })
            );
            return Promise.all(promises);
          })
          .then((results) => {
            const allContent = results.flatMap((r) => r.content);
            const maxPages = Math.max(...results.map((r) => r.totalPages), 0);
            setMatches(allContent.map(mapWinBetToMatch));
            setTotalPages(maxPages);
          })
          .catch((err) => {
            console.error('[HOMEPAGE] Failed to load all bets:', err);
            setMatches([]);
            setTotalPages(0);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        betService.getWinCurrent(selectedSport, currentPage, 10)
          .then((page) => {
            if (page?.content) {
              setMatches(page.content.map(mapWinBetToMatch));
              setTotalPages(page.totalPages || 0);
            } else {
              setMatches([]);
              setTotalPages(0);
            }
          })
          .catch((err) => {
            console.error('[HOMEPAGE] Failed to load bets:', err);
            setMatches([]);
            setTotalPages(0);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else if (betCategory === 'score') {
      if (selectedSport === undefined) {
        betService.getScoreSports()
          .then((sportsList) => {
            const promises = (sportsList || []).map((s) =>
              betService.getScoreCurrent(s.sportName, currentPage, 10)
                .then((page) => ({ content: page?.content || [], totalPages: page?.totalPages || 0 }))
                .catch((err) => {
                  console.error(`[HOMEPAGE] Failed to load score bets for sport ${s.sportName}:`, err);
                  return { content: [], totalPages: 0 };
                })
            );
            return Promise.all(promises);
          })
          .then((results) => {
            setScoreBets(results.flatMap((r) => r.content));
            const maxPages = Math.max(...results.map((r) => r.totalPages), 0);
            setTotalPages(maxPages);
          })
          .catch((err) => {
            console.error('[HOMEPAGE] Failed to load all score bets:', err);
            setScoreBets([]);
            setTotalPages(0);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        betService.getScoreCurrent(selectedSport, currentPage, 10)
          .then((page) => {
            setScoreBets(page?.content || []);
            setTotalPages(page?.totalPages || 0);
          })
          .catch((err) => {
            console.error('[HOMEPAGE] Failed to load score bets:', err);
            setScoreBets([]);
            setTotalPages(0);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    } else if (betCategory === 'prediction') {
      betService.getPredictionCurrent(currentPage, 10)
        .then((page) => {
          setPredictionBets(page?.content || []);
          setTotalPages(page?.totalPages || 0);
        })
        .catch((err) => {
          console.error('[HOMEPAGE] Failed to load prediction bets:', err);
          setPredictionBets([]);
          setTotalPages(0);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [selectedSport, betCategory, currentPage]);

  const paginatedMatches = matches.slice(0, 10);
  const paginatedScoreBets = scoreBets.slice(0, 10);
  const paginatedPredictionBets = predictionBets.filter((bet) => bet.endedWith === null).slice(0, 10);

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
            <div className="flex border-b border-border text-sm font-medium mb-6">
              <button
                type="button"
                onClick={() => setBetCategory('win')}
                className={`pb-3 px-4 border-b-2 transition cursor-pointer ${
                  betCategory === 'win'
                    ? 'border-green-600 text-green-600 font-bold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Zakłady 1X2
              </button>
              <button
                type="button"
                onClick={() => setBetCategory('score')}
                className={`pb-3 px-4 border-b-2 transition cursor-pointer ${
                  betCategory === 'score'
                    ? 'border-green-600 text-green-600 font-bold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Dokładny Wynik
              </button>
              <button
                type="button"
                onClick={() => setBetCategory('prediction')}
                className={`pb-3 px-4 border-b-2 transition cursor-pointer ${
                  betCategory === 'prediction'
                    ? 'border-green-600 text-green-600 font-bold'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Predictions
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <h2>
                {betCategory === 'win' && 'Polecane zakłady 1X2'}
                {betCategory === 'score' && 'Zakłady na Dokładny Wynik'}
                {betCategory === 'prediction' && 'Zakłady Prediction'}
              </h2>
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
              ) : betCategory === 'win' ? (
                matches.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border p-6 shadow-md">
                    <p className="text-lg font-medium">Brak dostępnych zakładów dla tego sportu</p>
                    <p className="text-sm mt-1">Wybierz inny sport lub sprawdź ponownie później.</p>
                  </div>
                ) : (
                  paginatedMatches.map((match) => (
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
                )
              ) : betCategory === 'score' ? (
                scoreBets.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border p-6 shadow-md">
                    <p className="text-lg font-medium">Brak dostępnych zakładów dokładnego wyniku dla tego sportu</p>
                    <p className="text-sm mt-1">Wybierz inny sport lub sprawdź ponownie później.</p>
                  </div>
                ) : (
                  paginatedScoreBets.map((bet) => (
                    <ScoreMatchCard key={bet.id} bet={bet} />
                  ))
                )
              ) : (
                predictionBets.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border p-6 shadow-md">
                    <p className="text-lg font-medium">Brak dostępnych prediction</p>
                    <p className="text-sm mt-1">Sprawdź ponownie później.</p>
                  </div>
                ) : (
                  paginatedPredictionBets.map((bet) => (
                    <PredictionCard key={bet.id} bet={bet} />
                  ))
                )
              )}
            </div>

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 border border-border rounded-lg bg-card hover:bg-muted text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Poprzednia
                </button>
                <span className="text-sm text-muted-foreground font-semibold">
                  Strona {currentPage + 1} z {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-4 py-2 border border-border rounded-lg bg-card hover:bg-muted text-sm font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Następna
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <BettingSlip />
        </div>
      </div>
    </div>
  );
}
