import { X, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useBetting } from '../context';
import { toast } from 'sonner';

export function BettingSlip() {
  const { bets, removeBet, clearAllBets, totalOdds, potentialWin, placeBets } = useBetting();
  const [stake, setStake] = useState<string>('10');
  const [isPlacing, setIsPlacing] = useState(false);

  const handlePlaceBet = async () => {
    const stakeNum = parseFloat(stake);
    if (isNaN(stakeNum) || stakeNum <= 0) {
      toast.error('Podaj prawidłową stawkę');
      return;
    }
    setIsPlacing(true);
    try {
      await placeBets(stakeNum);
      toast.success('Zakład został pomyślnie złożony!');
    } catch {
      toast.error('Nie udało się złożyć zakładu');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-md sticky top-4 border border-border">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between mb-2">
          <h3>Kupon zakładów</h3>
          {bets.length > 0 && (
            <button
              onClick={clearAllBets}
              className="text-sm hover:text-green-200 transition flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Wyczyść
            </button>
          )}
        </div>
        <div className="text-sm opacity-90">
          {bets.length === 0 ? 'Brak zakładów' : `${bets.length} ${bets.length === 1 ? 'zakład' : 'zakłady'}`}
        </div>
      </div>

      <div className="p-4">
        {bets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Kliknij na kurs, aby dodać zakład do kuponu</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {bets.map((bet) => (
                <div
                  key={bet.id}
                  className="p-3 bg-muted rounded-lg border border-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1">{bet.match}</div>
                      <div className="font-medium">{bet.team}</div>
                    </div>
                    <button
                      onClick={() => removeBet(bet.id)}
                      className="text-muted-foreground hover:text-destructive transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Kurs:</span>
                    <span className="font-bold text-green-600">{bet.odd.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-3 border-t border-border">
              <div>
                <label className="block text-sm mb-2">Stawka (PLN)</label>
                <input
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-input-background"
                  min="1"
                />
              </div>

              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Łączny kurs:</span>
                  <span className="font-bold">{totalOdds.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Potencjalna wygrana:</span>
                  <span className="font-bold text-green-600">{potentialWin(parseFloat(stake) || 0).toFixed(2)} PLN</span>
                </div>
              </div>

              <button
                onClick={handlePlaceBet}
                disabled={isPlacing}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlacing ? 'Obstawianie...' : 'Obstaw teraz'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
