import { Gift, TrendingUp, Users, Zap } from 'lucide-react';

const promotions = [
  {
    id: 1,
    title: 'Bonus powitalny 500 PLN',
    description: 'Zarejestruj się i otrzymaj bonus do 500 PLN na start!',
    icon: Gift,
    color: 'from-purple-500 to-pink-500',
    terms: 'Warunki: Min. depozyt 50 PLN, obrót 5x',
  },
  {
    id: 2,
    title: 'Cashback 10%',
    description: 'Odzyskaj 10% z przegranych zakładów co tydzień!',
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-500',
    terms: 'Max. 200 PLN cashbacku tygodniowo',
  },
  {
    id: 3,
    title: 'Refer a Friend',
    description: 'Zaproś znajomego i zyskaj 100 PLN za każdego!',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    terms: 'Przyjaciel musi zrobić depozyt min. 100 PLN',
  },
  {
    id: 4,
    title: 'Boost kursów',
    description: 'Zwiększone kursy na wybrane mecze każdego dnia!',
    icon: Zap,
    color: 'from-orange-500 to-red-500',
    terms: 'Sprawdź dzisiejsze boosted odds',
  },
];

export function PromotionsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="mb-2">Promocje i bonusy</h2>
        <p className="text-muted-foreground">Skorzystaj z naszych najlepszych ofert promocyjnych</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {promotions.map((promo) => (
          <div key={promo.id} className="bg-card rounded-lg shadow-lg overflow-hidden border border-border hover:shadow-xl transition">
            <div className={`bg-gradient-to-r ${promo.color} text-white p-6`}>
              <div className="flex items-start gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <promo.icon className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2">{promo.title}</h3>
                  <p className="text-sm opacity-90">{promo.description}</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-card">
              <p className="text-sm text-muted-foreground mb-4">{promo.terms}</p>
              <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition font-medium">
                Aktywuj promocję
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-card rounded-lg shadow-md p-6 border border-border">
        <h3 className="mb-4">Jak działają promocje?</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>1. Wybierz interesującą Cię promocję i kliknij "Aktywuj promocję"</p>
          <p>2. Spełnij warunki promocji (np. minimalny depozyt)</p>
          <p>3. Bonus zostanie automatycznie dodany do Twojego konta</p>
          <p>4. Zacznij obstawiać i ciesz się dodatkowymi środkami!</p>
        </div>
      </div>
    </div>
  );
}
