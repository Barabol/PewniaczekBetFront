import { Bell, Lock, Eye, Shield } from 'lucide-react';
import { useState } from 'react';

export function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const [limits, setLimits] = useState({
    dailyLimit: '500',
    weeklyLimit: '2000',
    monthlyLimit: '5000',
  });

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h2 className="mb-6">Ustawienia konta</h2>

      <div className="space-y-6">
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <h3>Powiadomienia</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <div className="font-medium">Powiadomienia email</div>
                <div className="text-sm text-muted-foreground">Otrzymuj informacje o promocjach i wynikach</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <div className="font-medium">Powiadomienia SMS</div>
                <div className="text-sm text-muted-foreground">Otrzymuj SMS o ważnych wydarzeniach</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <div className="font-medium">Powiadomienia push</div>
                <div className="text-sm text-muted-foreground">Otrzymuj powiadomienia w aplikacji</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <h3>Limity odpowiedzialnej gry</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Dzienny limit (PLN)</label>
              <input
                type="number"
                value={limits.dailyLimit}
                onChange={(e) => setLimits({ ...limits, dailyLimit: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-background"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Tygodniowy limit (PLN)</label>
              <input
                type="number"
                value={limits.weeklyLimit}
                onChange={(e) => setLimits({ ...limits, weeklyLimit: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-background"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Miesięczny limit (PLN)</label>
              <input
                type="number"
                value={limits.monthlyLimit}
                onChange={(e) => setLimits({ ...limits, monthlyLimit: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-background"
              />
            </div>

            <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition font-medium">
              Zapisz limity
            </button>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-muted-foreground" />
            <h3>Bezpieczeństwo</h3>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition">
              <span>Zmień hasło</span>
              <Lock className="w-4 h-4 text-muted-foreground" />
            </button>

            <button className="w-full flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition">
              <span>Weryfikacja dwuetapowa</span>
              <Shield className="w-4 h-4 text-muted-foreground" />
            </button>

            <button className="w-full flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition">
              <span>Aktywne sesje</span>
              <Eye className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
