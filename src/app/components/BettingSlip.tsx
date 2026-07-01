import { X, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useBetting } from '../context';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

export function BettingSlip() {
  const { bets, removeBet, clearAllBets, totalOdds, potentialWin, placeBets } = useBetting();
  const [stake, setStake] = useState<string>('10');
  const [isPlacing, setIsPlacing] = useState(false);
  const { t, i18n } = useTranslation();

  const handlePlaceBet = async () => {
    const stakeNum = parseFloat(stake);
    if (isNaN(stakeNum) || stakeNum <= 0) {
      toast.error(i18n.language.startsWith('pl') ? 'Podaj prawidłową stawkę' : 'Please provide a valid stake');
      return;
    }
    setIsPlacing(true);
    try {
      await placeBets(stakeNum);
      toast.success(i18n.language.startsWith('pl') ? 'Zakład został pomyślnie złożony!' : 'Bet placed successfully!');
    } catch {
      toast.error(i18n.language.startsWith('pl') ? 'Nie udało się złożyć zakładu' : 'Failed to place the bet');
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-md sticky top-4 border border-border">
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between mb-2">
          <h3>{t('bet_slip.title')}</h3>
          {bets.length > 0 && (
            <button
              onClick={clearAllBets}
              className="text-sm hover:text-green-200 transition flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              {t('bet_slip.clear')}
            </button>
          )}
        </div>
        <div className="text-sm opacity-90">
          {bets.length === 0
            ? t('bet_slip.empty')
            : `${bets.length} ${
                i18n.language.startsWith('pl')
                  ? bets.length === 1
                    ? 'zakład'
                    : 'zakłady'
                  : bets.length === 1
                  ? 'bet'
                  : 'bets'
              }`}
        </div>
      </div>

      <div className="p-4">
        {bets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">{t('bet_slip.empty_desc')}</p>
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
                    <span className="text-sm text-muted-foreground">
                      {i18n.language.startsWith('pl') ? 'Kurs:' : 'Odds:'}
                    </span>
                    <span className="font-bold text-green-600">{bet.odd.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-3 border-t border-border">
              <div>
                <label className="block text-sm mb-2">{t('bet_slip.stake')}</label>
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
                  <span className="text-sm">{t('bet_slip.total_odds')}:</span>
                  <span className="font-bold">{totalOdds.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('bet_slip.potential_win')}:</span>
                  <span className="font-bold text-green-600">
                    {potentialWin(parseFloat(stake) || 0).toFixed(2)} PLN
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceBet}
                disabled={isPlacing}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPlacing ? t('bet_slip.placing') : t('bet_slip.place_bet')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
