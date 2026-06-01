import { Clock, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface MatchCardProps {
  league: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  isLive?: boolean;
  betId?: number;
  betType?: 'win' | 'score' | 'prediction';
  onAddToBet: (team: string, odd: number, match: string, betId?: number, betType?: 'win' | 'score' | 'prediction') => void;
}

export function MatchCard({ league, homeTeam, awayTeam, time, odds, isLive, betId, betType, onAddToBet }: MatchCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleOddClick = (type: 'home' | 'draw' | 'away') => {
    const teamName = type === 'home' ? homeTeam : type === 'away' ? awayTeam : 'Remis';
    const odd = odds[type];
    const matchName = `${homeTeam} vs ${awayTeam}`;

    setSelected(type);
    onAddToBet(teamName, odd, matchName, betId, betType);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 flex items-center justify-between border-b border-border">
        <span className="text-sm text-muted-foreground">{league}</span>
        {isLive && (
          <span className="flex items-center gap-1 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            LIVE
          </span>
        )}
        {!isLive && (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="w-3 h-3" />
            {time}
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="col-span-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span>{homeTeam}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{awayTeam}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <button
            onClick={() => handleOddClick('home')}
            className={`p-3 rounded-lg border transition ${
              selected === 'home'
                ? 'bg-green-600 border-green-600 text-white'
                : 'border-border hover:border-green-500 hover:bg-green-50'
            }`}
          >
            <div className="text-xs text-center mb-1">1</div>
            <div className="font-bold text-center">{odds.home.toFixed(2)}</div>
          </button>
          <button
            onClick={() => handleOddClick('draw')}
            className={`p-3 rounded-lg border transition ${
              selected === 'draw'
                ? 'bg-green-600 border-green-600 text-white'
                : 'border-border hover:border-green-500 hover:bg-green-50'
            }`}
          >
            <div className="text-xs text-center mb-1">X</div>
            <div className="font-bold text-center">{odds.draw.toFixed(2)}</div>
          </button>
          <button
            onClick={() => handleOddClick('away')}
            className={`p-3 rounded-lg border transition ${
              selected === 'away'
                ? 'bg-green-600 border-green-600 text-white'
                : 'border-border hover:border-green-500 hover:bg-green-50'
            }`}
          >
            <div className="text-xs text-center mb-1">2</div>
            <div className="font-bold text-center">{odds.away.toFixed(2)}</div>
          </button>
        </div>
      </div>

      <div className="px-4 py-2 bg-gray-50 border-t border-border">
        <button className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          +127 więcej zakładów
        </button>
      </div>
    </div>
  );
}
