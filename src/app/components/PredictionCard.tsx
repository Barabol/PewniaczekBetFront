import { Clock, Trophy, Coins, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import type { PredictionBetDto } from '../types';
import { useAuth } from '../context';
import { betService } from '../services';
import { toast } from 'sonner';

interface PredictionCardProps {
  bet: PredictionBetDto;
}

export function PredictionCard({ bet }: PredictionCardProps) {
  const { isLoggedIn, user, refreshUser } = useAuth();
  const [prediction, setPrediction] = useState<boolean | null>(null);
  const [stake, setStake] = useState<string>('');
  const [isFreeBet, setIsFreeBet] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePlaceBet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Musisz być zalogowany, aby obstawiać');
      return;
    }

    if (prediction === null) {
      toast.error('Wybierz TAK lub NIE');
      return;
    }

    const stakeNum = parseFloat(stake);
    if (isNaN(stakeNum) || stakeNum <= 0) {
      toast.error('Wprowadź poprawną stawkę');
      return;
    }

    const maxBalance = isFreeBet ? (user?.freeBetBalance || 0) : (user?.balance || 0);
    if (stakeNum > maxBalance) {
      toast.error('Niewystarczające środki na koncie');
      return;
    }

    setLoading(true);
    try {
      await betService.placePredictionBet({
        id: bet.id,
        amount: Math.round(stakeNum * 100),
        prediction,
        isFreeBet,
      });
      toast.success(`Postawiono zakład na ${prediction ? 'TAK' : 'NIE'} w pytaniu: "${bet.name}"`);
      setStake('');
      setPrediction(null);
      refreshUser();
    } catch (err: any) {
      toast.error(err.message || 'Nie udało się postawić zakładu');
    } finally {
      setLoading(false);
    }
  };

  const formattedTime = bet.stopDate
    ? new Date(bet.stopDate).toLocaleString('pl-PL', {
        day: 'numeric',
        month: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Nieznana data';

  const totalPool = (bet.trueBetsAmount || 0) + (bet.falseBetsAmount || 0) + (bet.pot || 0);
  const truePercent = totalPool > 0 ? Math.round(((bet.trueBetsAmount || 0) / totalPool) * 100) : 50;
  const falsePercent = totalPool > 0 ? 100 - truePercent : 50;

  const multiplier = bet.currentMultiplier ?? 1.8;
  const potentialPayout = stake ? (parseFloat(stake) * multiplier).toFixed(2) : '0.00';

  return (
    <div className="bg-card rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border border-border">
      <div className="bg-muted px-4 py-2 flex items-center justify-between border-b border-border">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
          Zakład Społecznościowy
        </span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground font-mono">
          <Clock className="w-3 h-3" />
          {formattedTime}
        </span>
      </div>

      <div className="p-4 space-y-4">
        <div className="text-left font-semibold text-base text-foreground leading-snug min-h-[3rem]">
          {bet.name}
        </div>

        {/* Funding distribution bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-green-600">TAK: {truePercent}% ({bet.trueBetsAmount} PLN)</span>
            <span className="text-red-500">NIE: {falsePercent}% ({bet.falseBetsAmount} PLN)</span>
          </div>
          <div className="w-full h-2 bg-red-500/20 rounded-full overflow-hidden flex">
            <div className="h-full bg-green-500" style={{ width: `${truePercent}%` }}></div>
            <div className="h-full bg-red-500" style={{ width: `${falsePercent}%` }}></div>
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Pula początkowa: {bet.pot} PLN</span>
            <span>Głosy: {bet.trueBets + bet.falseBets}</span>
          </div>
        </div>

        <form onSubmit={handlePlaceBet} className="space-y-4 pt-2 border-t border-border/60">
          {/* YES/NO Selection Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPrediction(true)}
              className={`py-2 px-4 rounded-lg border font-bold text-sm text-center transition cursor-pointer ${
                prediction === true
                  ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-600/10'
                  : 'border-border hover:border-green-500 hover:bg-green-500/10 text-green-600'
              }`}
            >
              TAK (True)
            </button>
            <button
              type="button"
              onClick={() => setPrediction(false)}
              className={`py-2 px-4 rounded-lg border font-bold text-sm text-center transition cursor-pointer ${
                prediction === false
                  ? 'bg-red-500 border-red-500 text-white shadow-md shadow-red-500/10'
                  : 'border-border hover:border-red-500 hover:bg-red-500/10 text-red-500'
              }`}
            >
              NIE (False)
            </button>
          </div>

          <div className="flex items-center justify-between text-sm bg-muted/30 p-2.5 rounded-lg border border-border/40 font-semibold">
            <span className="text-muted-foreground">Aktualny kurs:</span>
            <span className="text-green-600 font-mono text-base">x{multiplier.toFixed(2)}</span>
          </div>

          {/* Stake & Freebet */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Stawka (PLN)</label>
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder="0.00"
                min="1"
                step="any"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                required
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-1.5 p-2 border border-border rounded-lg bg-background hover:bg-muted/40 cursor-pointer select-none text-xs transition h-[38px]">
                <input
                  type="checkbox"
                  checked={isFreeBet}
                  onChange={(e) => setIsFreeBet(e.target.checked)}
                  className="accent-green-600"
                />
                <span className="flex items-center gap-1 font-medium font-sans">
                  <Coins className="w-3.5 h-3.5 text-blue-500" />
                  Freebet ({user?.freeBetBalance?.toFixed(2) || '0.00'})
                </span>
              </label>
            </div>
          </div>

          {/* Place Bet Button */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Ew. wygrana:</span>
              <span className="font-semibold text-foreground font-mono">{potentialPayout} PLN</span>
            </div>
            <button
              type="submit"
              disabled={loading || !stake || prediction === null}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 rounded-lg hover:from-green-700 hover:to-green-800 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shadow-md shadow-green-600/5 cursor-pointer"
            >
              <Trophy className="w-4 h-4" />
              {loading ? 'Przetwarzanie...' : 'Obstawi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
