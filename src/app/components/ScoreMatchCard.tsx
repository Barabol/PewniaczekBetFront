import { Clock, Trophy, Coins } from 'lucide-react';
import { useState } from 'react';
import type { ScoreBetDto } from '../types';
import { useAuth } from '../context';
import { betService } from '../services';
import { toast } from 'sonner';

interface ScoreMatchCardProps {
  bet: ScoreBetDto;
}

export function ScoreMatchCard({ bet }: ScoreMatchCardProps) {
  const { isLoggedIn, user, refreshUser } = useAuth();
  const [team1Score, setTeam1Score] = useState<number>(0);
  const [team2Score, setTeam2Score] = useState<number>(0);
  const [stake, setStake] = useState<string>('');
  const [isFreeBet, setIsFreeBet] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePlaceBet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Musisz być zalogowany, aby obstawiać');
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
      await betService.placeScoreBet({
        betId: bet.id,
        ammount: Math.round(stakeNum * 100),
        isFreeBet,
        team1Score,
        team2Score,
      });
      toast.success(`Postawiono zakład na wynik ${team1Score}:${team2Score} w meczu ${bet.game?.team1} vs ${bet.game?.team2}`);
      setStake('');
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

  const multiplier = bet.currentMultiplier ?? 2.0;
  const potentialPayout = stake ? (parseFloat(stake) * multiplier).toFixed(2) : '0.00';

  return (
    <div className="bg-card rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border border-border">
      <div className="bg-muted px-4 py-2 flex items-center justify-between border-b border-border">
        <span className="text-sm text-muted-foreground">{bet.game?.sport || bet.name || 'Dokładny Wynik'}</span>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="w-3 h-3" />
          {formattedTime}
        </span>
      </div>

      <div className="p-4 space-y-4">
        <div className="text-center font-medium text-base">
          <div>{bet.game?.team1}</div>
          <div className="text-xs text-muted-foreground my-1">vs</div>
          <div>{bet.game?.team2}</div>
        </div>

        <form onSubmit={handlePlaceBet} className="space-y-4 pt-2 border-t border-border/60">
          {/* Score Selector */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground mb-1">Gospodarze</span>
              <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden">
                <button
                  type="button"
                  onClick={() => setTeam1Score(s => Math.max(0, s - 1))}
                  className="px-3 py-1 hover:bg-muted font-bold text-sm transition"
                >
                  -
                </button>
                <span className="px-4 py-1 font-mono font-bold text-base min-w-[2rem] text-center">
                  {team1Score}
                </span>
                <button
                  type="button"
                  onClick={() => setTeam1Score(s => s + 1)}
                  className="px-3 py-1 hover:bg-muted font-bold text-sm transition"
                >
                  +
                </button>
              </div>
            </div>

            <span className="text-2xl font-bold font-mono mt-4">:</span>

            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground mb-1">Goście</span>
              <div className="flex items-center border border-border rounded-lg bg-background overflow-hidden">
                <button
                  type="button"
                  onClick={() => setTeam2Score(s => Math.max(0, s - 1))}
                  className="px-3 py-1 hover:bg-muted font-bold text-sm transition"
                >
                  -
                </button>
                <span className="px-4 py-1 font-mono font-bold text-base min-w-[2rem] text-center">
                  {team2Score}
                </span>
                <button
                  type="button"
                  onClick={() => setTeam2Score(s => s + 1)}
                  className="px-3 py-1 hover:bg-muted font-bold text-sm transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm bg-muted/30 p-2.5 rounded-lg border border-border/40 font-semibold">
            <span className="text-muted-foreground">Kurs:</span>
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
                <span className="flex items-center gap-1 font-medium">
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
              disabled={loading || !stake}
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
