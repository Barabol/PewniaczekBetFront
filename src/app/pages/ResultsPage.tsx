import { CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

const results = [
  {
    id: 1,
    date: '2026-04-19',
    league: 'Premier League',
    homeTeam: 'Manchester City',
    awayTeam: 'Tottenham',
    homeScore: 3,
    awayScore: 1,
    status: 'Zakończony',
  },
  {
    id: 2,
    date: '2026-04-19',
    league: 'La Liga',
    homeTeam: 'Atletico Madryt',
    awayTeam: 'Sevilla',
    homeScore: 2,
    awayScore: 2,
    status: 'Zakończony',
  },
  {
    id: 3,
    date: '2026-04-18',
    league: 'Bundesliga',
    homeTeam: 'RB Leipzig',
    awayTeam: 'Bayer Leverkusen',
    homeScore: 1,
    awayScore: 3,
    status: 'Zakończony',
  },
  {
    id: 4,
    date: '2026-04-18',
    league: 'Serie A',
    homeTeam: 'Roma',
    awayTeam: 'Lazio',
    homeScore: 2,
    awayScore: 1,
    status: 'Zakończony',
  },
  {
    id: 5,
    date: '2026-04-18',
    league: 'Ekstraklasa',
    homeTeam: 'Jagiellonia Białystok',
    awayTeam: 'Pogoń Szczecin',
    homeScore: 0,
    awayScore: 0,
    status: 'Zakończony',
  },
];

export function ResultsPage() {
  const [selectedDate, setSelectedDate] = useState('2026-04-19');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="mb-4">Wyniki meczów</h2>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedDate('2026-04-19')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
              selectedDate === '2026-04-19'
                ? 'bg-green-600 text-white'
                : 'bg-card border border-border hover:border-green-500'
            }`}
          >
            Dzisiaj
          </button>
          <button
            onClick={() => setSelectedDate('2026-04-18')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
              selectedDate === '2026-04-18'
                ? 'bg-green-600 text-white'
                : 'bg-card border border-border hover:border-green-500'
            }`}
          >
            Wczoraj
          </button>
          <button
            onClick={() => setSelectedDate('2026-04-17')}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
              selectedDate === '2026-04-17'
                ? 'bg-green-600 text-white'
                : 'bg-card border border-border hover:border-green-500'
            }`}
          >
            17 kwietnia
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {results
          .filter((result) => result.date === selectedDate)
          .map((result) => (
            <div key={result.id} className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
              <div className="bg-muted px-4 py-2 border-b border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{result.league}</span>
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                    {result.status}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
                  <div className="text-right">
                    <div className="font-medium">{result.homeTeam}</div>
                  </div>

                  <div className="flex items-center gap-3 bg-muted px-6 py-3 rounded-lg">
                    <span className="text-2xl font-bold">{result.homeScore}</span>
                    <span className="text-muted-foreground">-</span>
                    <span className="text-2xl font-bold">{result.awayScore}</span>
                  </div>

                  <div className="text-left">
                    <div className="font-medium">{result.awayTeam}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {results.filter((result) => result.date === selectedDate).length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Brak wyników dla wybranej daty</p>
        </div>
      )}
    </div>
  );
}
