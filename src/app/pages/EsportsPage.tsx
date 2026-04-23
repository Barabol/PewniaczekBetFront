import { MatchCard } from '../components/MatchCard';
import { BettingSlip } from '../components/BettingSlip';
import { Gamepad2 } from 'lucide-react';
import { useBetting } from '../context';

const esportsMatches = [
  {
    id: 1,
    league: 'CS:GO - ESL Pro League',
    homeTeam: 'FaZe Clan',
    awayTeam: 'Natus Vincere',
    time: 'Dzisiaj 19:00',
    odds: { home: 2.15, draw: 15.00, away: 1.75 },
    isLive: false,
  },
  {
    id: 2,
    league: 'League of Legends - LEC',
    homeTeam: 'G2 Esports',
    awayTeam: 'Fnatic',
    time: '23:12',
    odds: { home: 1.85, draw: 12.00, away: 2.05 },
    isLive: true,
  },
  {
    id: 3,
    league: 'Dota 2 - DPC',
    homeTeam: 'Team Spirit',
    awayTeam: 'OG',
    time: 'Jutro 16:00',
    odds: { home: 1.95, draw: 14.00, away: 1.95 },
    isLive: false,
  },
  {
    id: 4,
    league: 'Valorant - VCT',
    homeTeam: 'Sentinels',
    awayTeam: 'Loud',
    time: 'Dzisiaj 21:00',
    odds: { home: 2.30, draw: 16.00, away: 1.65 },
    isLive: false,
  },
];

export function EsportsPage() {
  const { bets, addBet, removeBet, clearAllBets } = useBetting();
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
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950 transition"
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
            {esportsMatches.map((match) => (
              <MatchCard
                key={match.id}
                league={match.league}
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
                time={match.time}
                odds={match.odds}
                isLive={match.isLive}
                onAddToBet={addBet}
              />
            ))}
          </div>
        </div>

        <div>
          <BettingSlip
            bets={bets}
            onRemoveBet={removeBet}
            onClearAll={clearAllBets}
          />
        </div>
      </div>
    </div>
  );
}
