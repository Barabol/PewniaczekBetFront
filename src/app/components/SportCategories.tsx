import { Circle, Dumbbell, Trophy, Target, Bike, Waves } from 'lucide-react';

const sports = [
  { name: 'Piłka nożna', icon: Circle, count: 234 },
  { name: 'Tenis', icon: Target, count: 89 },
  { name: 'Koszykówka', icon: Trophy, count: 67 },
  { name: 'Siatkówka', icon: Dumbbell, count: 45 },
  { name: 'Kolarstwo', icon: Bike, count: 23 },
  { name: 'Pływanie', icon: Waves, count: 12 },
];

export function SportCategories() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="mb-4">Popularne sporty</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {sports.map((sport) => (
          <button
            key={sport.name}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-green-500 hover:bg-green-50 transition"
          >
            <sport.icon className="w-6 h-6 text-green-600" />
            <span className="text-sm">{sport.name}</span>
            <span className="text-xs text-muted-foreground">{sport.count} zakładów</span>
          </button>
        ))}
      </div>
    </div>
  );
}
