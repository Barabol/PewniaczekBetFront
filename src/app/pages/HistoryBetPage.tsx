import { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, Trophy, Search, AlertCircle } from 'lucide-react';
import { betService } from '../services';
import { useAuth } from '../context';
import type { BetHistoryItem, BetStatus, BetType, UserWinBetDto, UserScoreBetDto, UserBetPredictionDto } from '../types';
import { t } from '../utils/translator';

const STATUS_LABELS: Record<BetStatus, string> = {
  WIN: 'Wygrana',
  LOSE: 'Przegrana',
  PENDING: 'Oczekująca',
};

const STATUS_CLASSES: Record<BetStatus, string> = {
  WIN: 'bg-green-500/10 text-green-600',
  LOSE: 'bg-red-500/10 text-red-500',
  PENDING: 'bg-yellow-500/10 text-yellow-600',
};

const TYPE_LABELS: Record<BetType, string> = {
  WIN: 'Wynik',
  SCORE: 'Dokładny wynik',
  PREDICTION: 'Predykcja',
};

const PAGE_SIZE = 10;



function mapWinToHistory(dto: UserWinBetDto, isEnded: boolean): BetHistoryItem {
  let status: BetStatus = 'PENDING';
  if (isEnded) {
    const score1 = dto.bet.game?.team1Score ?? 0;
    const score2 = dto.bet.game?.team2Score ?? 0;
    const isHomeBet = dto.team === 'true' || dto.team === 'TEAM1' || dto.team === 'HOME' || dto.team === dto.bet.game?.team1 || (dto.team as any) === true;

    if ((score1 > score2 && isHomeBet) || (score2 > score1 && !isHomeBet)) {
      status = 'WIN';
    } else {
      status = 'LOSE';
    }
  }

  const stake = dto.amount / 100;
  return {
    uniqueId: `win-${dto.bet.id}-${dto.amount}-${dto.team}-${isEnded ? 'ended' : 'pending'}-${Math.random()}`,
    id: dto.bet.id,
    type: 'WIN',
    gameName: dto.bet.game?.name || dto.bet.name,
    sport: dto.bet.game?.sport || '',
    team1: dto.bet.game?.team1 || dto.bet.name,
    team2: dto.bet.game?.team2 || '',
    stake,
    multiplier: dto.multiplyer,
    status,
    date: dto.bet.stopDate,
    payout: status === 'WIN' ? stake * dto.multiplyer : 0,
  };
}

function mapScoreToHistory(dto: UserScoreBetDto, isEnded: boolean): BetHistoryItem {
  let status: BetStatus = 'PENDING';
  if (isEnded) {
    const score1 = dto.bet.game?.team1Score ?? 0;
    const score2 = dto.bet.game?.team2Score ?? 0;
    if (dto.team1Score === score1 && dto.team2Score === score2) {
      status = 'WIN';
    } else {
      status = 'LOSE';
    }
  }

  const stake = dto.ammount / 100;
  return {
    uniqueId: `score-${dto.bet.id}-${dto.ammount}-${dto.team1Score}-${dto.team2Score}-${isEnded ? 'ended' : 'pending'}-${Math.random()}`,
    id: dto.bet.id,
    type: 'SCORE',
    gameName: dto.bet.game?.name || dto.bet.name,
    sport: dto.bet.game?.sport || '',
    team1: dto.bet.game?.team1 || dto.bet.name,
    team2: dto.bet.game?.team2 || '',
    stake,
    multiplier: dto.multiplyer,
    status,
    date: dto.bet.stopDate,
    payout: status === 'WIN' ? stake * dto.multiplyer : 0,
  };
}

function mapPredictionToHistory(dto: UserBetPredictionDto, isEnded: boolean): BetHistoryItem {
  let status: BetStatus = 'PENDING';
  if (isEnded) {
    if (dto.prediction === dto.bet.endedWith) {
      status = 'WIN';
    } else {
      status = 'LOSE';
    }
  }

  const stake = dto.amount / 100;
  return {
    uniqueId: `pred-${dto.bet.id}-${dto.amount}-${dto.prediction}-${isEnded ? 'ended' : 'pending'}-${Math.random()}`,
    id: dto.bet.id,
    type: 'PREDICTION',
    gameName: dto.bet.name,
    sport: '',
    team1: dto.bet.name,
    team2: '',
    stake,
    multiplier: dto.bet.currentMultiplier,
    status,
    date: dto.bet.stopDate,
    payout: status === 'WIN' ? stake * dto.bet.currentMultiplier : 0,
  };
}

export function HistoryBetPage() {
  const { user } = useAuth();
  const userId = user?.id ? Number(user.id) : undefined;
  const [items, setItems] = useState<BetHistoryItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | BetStatus>('ALL');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setApiError(false);

    const emptyPage = { content: [] as any[], totalPages: 0, totalElements: 0, number: 0, size: 0, sort: null as any, pageable: null as any, first: true, last: true, numberOfElements: 0, empty: true };

    Promise.all([
      // Fetch ended bets
      betService.getWinHistory(0, 50, userId, undefined, true).catch(() => emptyPage),
      betService.getScoreHistory(0, 50, userId, undefined, true).catch(() => emptyPage),
      betService.getPredictionHistory(0, 50, userId, true).catch(() => emptyPage),
      // Fetch pending bets
      betService.getWinHistory(0, 50, userId, undefined, false).catch(() => emptyPage),
      betService.getScoreHistory(0, 50, userId, undefined, false).catch(() => emptyPage),
      betService.getPredictionHistory(0, 50, userId, false).catch(() => emptyPage),
    ])
      .then(([winEnded, scoreEnded, predEnded, winPending, scorePending, predPending]) => {
        const all = [
          ...winEnded.content.map((item) => mapWinToHistory(item, true)),
          ...scoreEnded.content.map((item) => mapScoreToHistory(item, true)),
          ...predEnded.content.map((item) => mapPredictionToHistory(item, true)),
          ...winPending.content.map((item) => mapWinToHistory(item, false)),
          ...scorePending.content.map((item) => mapScoreToHistory(item, false)),
          ...predPending.content.map((item) => mapPredictionToHistory(item, false)),
        ];
        
        // Deduplicate items to prevent identical bets from appearing multiple times
        const deduplicated: BetHistoryItem[] = [];
        all.forEach((item) => {
          const duplicateIdx = deduplicated.findIndex((x) => 
            x.type === item.type && 
            x.id === item.id && 
            x.stake === item.stake &&
            x.multiplier === item.multiplier &&
            x.date === item.date
          );
          
          if (duplicateIdx === -1) {
            deduplicated.push(item);
          } else {
            // If duplicate found and the existing one is PENDING but new one is resolved (WIN/LOSE), replace it
            if (deduplicated[duplicateIdx].status === 'PENDING' && item.status !== 'PENDING') {
              deduplicated[duplicateIdx] = item;
            }
          }
        });

        deduplicated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setItems(deduplicated);
      })
      .catch(() => {
        setApiError(true);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  const filtered = items.filter((item) => {
    return statusFilter === 'ALL' || item.status === statusFilter;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages - 1);
  const paged = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-green-600" />
        <h2>{t('Historia zakładów')}</h2>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6 p-1 bg-muted rounded-lg w-fit">
        {(['ALL', 'WIN', 'LOSE', 'PENDING'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => { setStatusFilter(tab); setPage(0); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer ${
              statusFilter === tab
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'ALL' ? t('Wszystkie') : t(STATUS_LABELS[tab])}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-lg shadow-md border border-border">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <div className="animate-spin w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full mr-3" />
            {t('Ładowanie...')}
          </div>
        ) : apiError ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <AlertCircle className="w-12 h-12 mb-3 opacity-50" />
            <p className="font-medium">{t('Historia zakładów jest tymczasowo niedostępna')}</p>
            <p className="text-sm mt-1">{t('Spróbuj ponownie później')}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Search className="w-12 h-12 mb-3 opacity-50" />
            <p>{t('Brak historii zakładów')}</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {paged.map((bet) => (
              <div key={bet.uniqueId} className="p-4 hover:bg-muted/50 transition">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{bet.team1} vs {bet.team2}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-muted mr-2">
                        {t(TYPE_LABELS[bet.type])}
                      </span>
                      {new Date(bet.date).toLocaleString('pl-PL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {bet.stake.toFixed(2)} PLN <span className="mx-1">&times;</span> {bet.multiplier.toFixed(2)}
                    </div>
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mt-1 ${STATUS_CLASSES[bet.status]}`}>
                      {bet.status === 'WIN' && <Trophy className="w-3 h-3" />}
                      {bet.status === 'LOSE' && <>&times;</>}
                      {t(STATUS_LABELS[bet.status])}
                    </div>
                    {bet.status === 'WIN' && (
                      <div className="text-sm font-medium text-green-600 mt-1">
                        +{bet.payout.toFixed(2)} PLN
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm hover:bg-muted transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('Poprzednia')}
            </button>
            <span className="text-sm text-muted-foreground">
              {t('Strona')} {currentPage + 1} {t('z')} {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={currentPage >= totalPages - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm hover:bg-muted transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              {t('Następna')}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
