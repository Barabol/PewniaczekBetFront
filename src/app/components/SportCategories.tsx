import { useState, useEffect } from 'react';
import { Circle, Dumbbell, Trophy, Target, Bike, Waves, LayoutGrid } from 'lucide-react';
import { betService } from '../services';
import type { SportListDto } from '../types';

const SPORT_ICONS: Record<string, any> = {
  'piłka nożna': Circle,
  'football': Circle,
  'soccer': Circle,
  'tenis': Target,
  'tennis': Target,
  'koszykówka': Trophy,
  'basketball': Trophy,
  'siatkówka': Dumbbell,
  'volleyball': Dumbbell,
  'kolarstwo': Bike,
  'cycling': Bike,
  'pływanie': Waves,
  'swimming': Waves,
};

const getSportIcon = (name: string) => {
  const normalized = name.toLowerCase().trim();
  return SPORT_ICONS[normalized] || Trophy; // Default to Trophy if unknown
};

interface SportCategoriesProps {
  selectedSport?: string;
  onSelectSport: (sport?: string) => void;
}

export function SportCategories({ selectedSport, onSelectSport }: SportCategoriesProps) {
  const [activeSports, setActiveSports] = useState<SportListDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    betService.getWinSports()
      .then((data) => {
        setActiveSports(data || []);
      })
      .catch((err) => {
        console.error('[SPORT CATEGORIES] Failed to load active sports:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-lg shadow-md p-4 border border-border">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Filtruj sporty</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-muted/30 animate-pulse h-20 animate-duration-1000"
            >
              <div className="w-6 h-6 bg-muted-foreground/20 rounded-full" />
              <div className="h-4 bg-muted-foreground/20 rounded w-16 mt-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-md p-4 border border-border">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Filtruj sporty</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Render 'Wszystkie' filter */}
        <button
          onClick={() => onSelectSport(undefined)}
          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border transition duration-200 cursor-pointer ${
            selectedSport === undefined
              ? 'border-green-500 bg-gradient-to-br from-green-500/15 to-emerald-500/5 text-green-500 shadow-[0_0_12px_rgba(34,197,94,0.15)] font-medium scale-[1.02]'
              : 'border-border hover:border-green-500/50 hover:bg-green-500/5 hover:scale-102 active:scale-98 text-foreground'
          }`}
        >
          <LayoutGrid className={`w-6 h-6 mb-1 ${selectedSport === undefined ? 'text-green-500' : 'text-muted-foreground'}`} />
          <span className="text-sm font-medium">Wszystkie</span>
        </button>

        {/* Render active sports fetched from API */}
        {activeSports.map((sport) => {
          const isActive = selectedSport === sport.sportName;
          const Icon = getSportIcon(sport.sportName);
          return (
            <button
              key={sport.sportName}
              onClick={() => onSelectSport(sport.sportName)}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-lg border transition duration-200 cursor-pointer ${
                isActive
                  ? 'border-green-500 bg-gradient-to-br from-green-500/15 to-emerald-500/5 text-green-500 shadow-[0_0_12px_rgba(34,197,94,0.15)] font-medium scale-[1.02]'
                  : 'border-border hover:border-green-500/50 hover:bg-green-500/5 hover:scale-102 active:scale-98 text-foreground'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-green-500' : 'text-muted-foreground'}`} />
              <span className="text-sm font-medium truncate w-full text-center">{sport.sportName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

