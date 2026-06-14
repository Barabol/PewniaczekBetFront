import { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, Trophy, Search } from 'lucide-react';
import { betService } from '../services';
import type {
  BetStatus, BetType,
  UserWinBetDto, UserScoreBetDto, UserBetPredictionDto,
} from '../types';

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

type BetTypeTab = 'ALL' | BetType;
type StatusTab = 'ALL' | BetStatus;

interface HistoryDisplayItem {
  id: number;
  type: BetType;
  gameName: string;
  sport: string;
  team1: string;
  team2: string;
  stake: number;
  multiplier: number;
  status: BetStatus;
  date: string;
  payout: number;
}

function computeWinStatus(dto: UserWinBetDto): BetStatus {
  const game = dto.bet.game;
  if (game.team1Score == null || game.team2Score == null) return 'PENDING';
  if (dto.team === game.team1 && game.team1Score > game.team2Score) return 'WIN';
  if (dto.team === game.team2 && game.team2Score > game.team1Score) return 'WIN';
  return 'LOSE';
}

function computeScoreStatus(dto: UserScoreBetDto): BetStatus {
  const game = dto.bet.game;
  if (game.team1Score == null || game.team2Score == null) return 'PENDING';
  if (dto.team1Score === game.team1Score && dto.team2Score === game.team2Score) return 'WIN';
  return 'LOSE';
}

function computePredictionStatus(dto: UserBetPredictionDto): BetStatus {
  if (dto.bet.endedWith == null) return 'PENDING';
  if (dto.prediction === dto.bet.endedWith) return 'WIN';
  return 'LOSE';
}

function mapWinToDisplay(dto: UserWinBetDto): HistoryDisplayItem {
  const game = dto.bet.game;
  return {
    id: dto.bet.id,
    type: 'WIN',
    gameName: game?.name || dto.bet.name,
    sport: game?.sport || '',
    team1: game?.team1 || 'Drużyna 1',
    team2: game?.team2 || 'Drużyna 2',
    stake: dto.amount / 100,
    multiplier: dto.multiplyer,
    status: computeWinStatus(dto),
    date: dto.bet.stopDate,
    payout: dto.multiplyer * dto.amount / 100,
  };
}

function mapScoreToDisplay(dto: UserScoreBetDto): HistoryDisplayItem {
  const game = dto.bet.game;
  return {
    id: dto.bet.id,
    type: 'SCORE',
    gameName: game?.name || dto.bet.name,
    sport: game?.sport || '',
    team1: game?.team1 || 'Drużyna 1',
    team2: game?.team2 || 'Drużyna 2',
    stake: dto.ammount / 100,
    multiplier: dto.multiplyer,
    status: computeScoreStatus(dto),
    date: dto.bet.stopDate,
    payout: dto.multiplyer * dto.ammount / 100,
  };
}

function mapPredictionToDisplay(dto: UserBetPredictionDto): HistoryDisplayItem {
  return {
    id: dto.bet.id,
    type: 'PREDICTION',
    gameName: dto.bet.name,
    sport: 'E-sport',
    team1: 'Tak',
    team2: 'Nie',
    stake: dto.amount / 100,
    multiplier: dto.bet.currentMultiplier,
    status: computePredictionStatus(dto),
    date: dto.bet.stopDate,
    payout: dto.bet.currentMultiplier * dto.amount / 100,
  };
}

export function HistoryBetPage() {
  const [betTypeTab, setBetTypeTab] = useState<BetTypeTab>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusTab>('ALL');
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<HistoryDisplayItem[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setPage(0);
  }, [betTypeTab]);

  useEffect(() => {
    setLoading(true);

    const fetchAll = async () => {
      try {
        if (betTypeTab === 'ALL' || betTypeTab === 'WIN') {
          const res = await betService.getWinHistory(page, 5);
          return { items: res.content.map(mapWinToDisplay), pages: res.totalPages };
        }
        if (betTypeTab === 'SCORE') {
          const res = await betService.getScoreHistory(page, 5);
          return { items: res.content.map(mapScoreToDisplay), pages: res.totalPages };
        }
        const res = await betService.getPredictionHistory(page, 5);
        return { items: res.content.map(mapPredictionToDisplay), pages: res.totalPages };
      } catch {
        return { items: [] as HistoryDisplayItem[], pages: 0 };
      }
    };

    fetchAll().then(({ items: newItems, pages }) => {
      setItems(newItems);
      setTotalPages(pages);
    }).finally(() => setLoading(false));
  }, [betTypeTab, page]);

  const filtered = statusFilter === 'ALL' ? items : items.filter((i) => i.status === statusFilter);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-green-600" />
        <h2>Historia zakładów</h2>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4 p-1 bg-muted rounded-lg w-fit">
        {(['ALL', 'WIN', 'SCORE', 'PREDICTION'] as BetTypeTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setBetTypeTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              betTypeTab === tab
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'ALL' ? 'Wszystkie' : TYPE_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6 p-1 bg-muted rounded-lg w-fit">
        {(['ALL', 'WIN', 'LOSE', 'PENDING'] as StatusTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => { setStatusFilter(tab); setPage(0); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              statusFilter === tab
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'ALL' ? 'Wszystkie' : STATUS_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-lg shadow-md border border-border">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <div className="animate-spin w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full mr-3" />
            Ładowanie...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Search className="w-12 h-12 mb-3 opacity-50" />
            <p>Brak historii zakładów</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((bet) => (
              <div key={`${bet.type}-${bet.id}`} className="p-4 hover:bg-muted/50 transition">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{bet.team1} vs {bet.team2}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-muted mr-2">
                        {TYPE_LABELS[bet.type]}
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
                      {STATUS_LABELS[bet.status]}
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
              disabled={page === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm hover:bg-muted transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Poprzednia
            </button>
            <span className="text-sm text-muted-foreground">
              Strona {page + 1} z {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm hover:bg-muted transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Następna
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
