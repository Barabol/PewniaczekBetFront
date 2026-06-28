import { Circle, Dumbbell, Trophy, Target, Bike, Waves, LayoutGrid } from 'lucide-react';

const sports = [
  { id: undefined, name: 'Wszystkie', icon: LayoutGrid },
  { id: 'Piłka nożna', name: 'Piłka nożna', icon: Circle },
  { id: 'Tenis', name: 'Tenis', icon: Target },
  { id: 'Koszykówka', name: 'Koszykówka', icon: Trophy },
  { id: 'Siatkówka', name: 'Siatkówka', icon: Dumbbell },
  { id: 'Kolarstwo', name: 'Kolarstwo', icon: Bike },
  { id: 'Pływanie', name: 'Pływanie', icon: Waves },
];

interface SportCategoriesProps {
  selectedSport?: string;
  onSelectSport: (sport?: string) => void;
}

export function SportCategories({ selectedSport, onSelectSport }: SportCategoriesProps) {
  return (
    <div className="bg-card rounded-lg shadow-md p-4 border border-border">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Filtruj sporty</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {sports.map((sport) => {
          const isActive = selectedSport === sport.id;
          return (
            <button
              key={sport.name}
              onClick={() => onSelectSport(sport.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition duration-200 cursor-pointer ${
                isActive
                  ? 'border-green-500 bg-gradient-to-br from-green-500/15 to-emerald-500/5 text-green-500 shadow-[0_0_12px_rgba(34,197,94,0.15)] font-medium scale-[1.02]'
                  : 'border-border hover:border-green-500/50 hover:bg-green-500/5 hover:scale-102 active:scale-98 text-foreground'
              }`}
            >
              <sport.icon className={`w-6 h-6 mb-1 ${isActive ? 'text-green-500' : 'text-muted-foreground'}`} />
              <span className="text-sm font-medium">{sport.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

