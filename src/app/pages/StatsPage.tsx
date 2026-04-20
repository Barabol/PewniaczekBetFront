import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

export function StatsPage() {
  const stats = {
    totalBets: 234,
    wonBets: 142,
    lostBets: 78,
    pendingBets: 14,
    winRate: 64.5,
    totalStaked: 12450,
    totalWon: 15234,
    profit: 2784,
    avgOdds: 2.34,
    biggestWin: 850,
    currentStreak: 5,
  };

  const recentForm = ['W', 'W', 'L', 'W', 'W', 'W', 'L', 'W', 'L', 'W'];

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="mb-6">Statystyki</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Bilans ogólny</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">+{stats.profit.toFixed(0)} PLN</div>
          <div className="text-xs text-muted-foreground mt-1">
            {((stats.profit / stats.totalStaked) * 100).toFixed(1)}% ROI
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Skuteczność</span>
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</div>
          <div className="text-xs text-muted-foreground mt-1">
            {stats.wonBets} wygranych z {stats.totalBets} zakładów
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Największa wygrana</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold">{stats.biggestWin.toFixed(0)} PLN</div>
          <div className="text-xs text-muted-foreground mt-1">
            Z kursu {(stats.biggestWin / 100).toFixed(2)}
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Aktualna passa</span>
            <Activity className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold">{stats.currentStreak} W</div>
          <div className="text-xs text-muted-foreground mt-1">
            Kolejne wygrane
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <h3 className="mb-4">Forma (ostatnie 10 zakładów)</h3>
          <div className="flex gap-2 justify-center">
            {recentForm.map((result, index) => (
              <div
                key={index}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  result === 'W'
                    ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                }`}
              >
                {result}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <h3 className="mb-4">Podsumowanie finansowe</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Łączna stawka</span>
              <span className="font-bold">{stats.totalStaked.toFixed(0)} PLN</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Łączna wygrana</span>
              <span className="font-bold text-green-600">{stats.totalWon.toFixed(0)} PLN</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm">Średni kurs</span>
              <span className="font-bold">{stats.avgOdds.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-md p-6 border border-border">
        <h3 className="mb-4">Rozkład zakładów</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border-l-4 border-green-600">
            <div className="text-sm text-muted-foreground mb-1">Wygrane</div>
            <div className="text-2xl font-bold text-green-600">{stats.wonBets}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {((stats.wonBets / stats.totalBets) * 100).toFixed(1)}% wszystkich zakładów
            </div>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border-l-4 border-red-600">
            <div className="text-sm text-muted-foreground mb-1">Przegrane</div>
            <div className="text-2xl font-bold text-red-600">{stats.lostBets}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {((stats.lostBets / stats.totalBets) * 100).toFixed(1)}% wszystkich zakładów
            </div>
          </div>

          <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border-l-4 border-yellow-600">
            <div className="text-sm text-muted-foreground mb-1">Oczekujące</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingBets}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {((stats.pendingBets / stats.totalBets) * 100).toFixed(1)}% wszystkich zakładów
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
