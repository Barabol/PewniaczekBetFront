import { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, Trophy, Search } from 'lucide-react';
import { betService } from '../services';
import type { BetHistoryItem, BetStatus, BetType } from '../types';

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

type FilterTab = 'ALL' | BetStatus;

export function HistoryBetPage() {
  const [items, setItems] = useState<BetHistoryItem[]>([]);
  const [filter, setFilter] = useState<FilterTab>('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    betService.getHistory(page, 10)
      .then((res) => {
        setItems(res.content.map((item) => ({
          ...item,
          stake: item.stake / 100,
          payout: item.payout / 100,
        })));
        setTotalPages(res.totalPages);
      })
      .catch(() => {
        // Fallback to empty
      })
      .finally(() => setLoading(false));
  }, [page]);

  const filtered = filter === 'ALL' ? items : items.filter((i) => i.status === filter);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-green-600" />
        <h2>Historia zakładów</h2>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-6 p-1 bg-muted rounded-lg w-fit">
        {(['ALL', 'WIN', 'LOSE', 'PENDING'] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => { setFilter(tab); setPage(0); }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              filter === tab
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
              <div key={bet.id} className="p-4 hover:bg-muted/50 transition">
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
