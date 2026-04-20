import { CheckCircle, XCircle, Clock } from 'lucide-react';

const betsHistory = [
  {
    id: 1,
    date: '2026-04-19 18:30',
    match: 'Manchester City vs Tottenham',
    bet: 'Manchester City wygra',
    odd: 1.85,
    stake: 50,
    status: 'won',
    winnings: 92.50,
  },
  {
    id: 2,
    date: '2026-04-19 20:00',
    match: 'Real Madryt vs Barcelona',
    bet: 'Remis',
    odd: 3.60,
    stake: 25,
    status: 'pending',
    winnings: 0,
  },
  {
    id: 3,
    date: '2026-04-18 21:00',
    match: 'Bayern vs Dortmund',
    bet: 'Powyżej 2.5 goli',
    odd: 2.10,
    stake: 100,
    status: 'lost',
    winnings: 0,
  },
  {
    id: 4,
    date: '2026-04-18 19:30',
    match: 'PSG vs Marsylia',
    bet: 'PSG wygra',
    odd: 1.55,
    stake: 75,
    status: 'won',
    winnings: 116.25,
  },
  {
    id: 5,
    date: '2026-04-17 20:45',
    match: 'Liverpool vs Chelsea',
    bet: 'Obie drużyny strzelą',
    odd: 1.90,
    stake: 40,
    status: 'won',
    winnings: 76.00,
  },
];

export function HistoryPage() {
  const totalStaked = betsHistory.reduce((sum, bet) => sum + bet.stake, 0);
  const totalWon = betsHistory.reduce((sum, bet) => bet.status === 'won' ? sum + bet.winnings : sum, 0);
  const profit = totalWon - totalStaked;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="mb-6">Historia zakładów</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="text-sm text-muted-foreground mb-1">Postawione</div>
          <div className="text-2xl font-bold">{totalStaked.toFixed(2)} PLN</div>
        </div>
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="text-sm text-muted-foreground mb-1">Wygrane</div>
          <div className="text-2xl font-bold text-green-600">{totalWon.toFixed(2)} PLN</div>
        </div>
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="text-sm text-muted-foreground mb-1">Bilans</div>
          <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-destructive'}`}>
            {profit >= 0 ? '+' : ''}{profit.toFixed(2)} PLN
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left p-4 text-sm">Data</th>
                <th className="text-left p-4 text-sm">Mecz</th>
                <th className="text-left p-4 text-sm">Zakład</th>
                <th className="text-right p-4 text-sm">Kurs</th>
                <th className="text-right p-4 text-sm">Stawka</th>
                <th className="text-right p-4 text-sm">Wygrana</th>
                <th className="text-center p-4 text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {betsHistory.map((bet) => (
                <tr key={bet.id} className="border-b border-border hover:bg-muted/50 transition">
                  <td className="p-4 text-sm text-muted-foreground">{bet.date}</td>
                  <td className="p-4 text-sm">{bet.match}</td>
                  <td className="p-4 text-sm">{bet.bet}</td>
                  <td className="p-4 text-sm text-right font-medium">{bet.odd.toFixed(2)}</td>
                  <td className="p-4 text-sm text-right">{bet.stake.toFixed(2)} PLN</td>
                  <td className="p-4 text-sm text-right font-medium">
                    {bet.status === 'won' ? (
                      <span className="text-green-600">{bet.winnings.toFixed(2)} PLN</span>
                    ) : bet.status === 'pending' ? (
                      <span className="text-muted-foreground">-</span>
                    ) : (
                      <span className="text-destructive">0.00 PLN</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      {bet.status === 'won' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {bet.status === 'lost' && (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                      {bet.status === 'pending' && (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
