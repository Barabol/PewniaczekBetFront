import { User, Mail, Phone, Calendar, Settings, History, Wallet, LogOut } from 'lucide-react';
import { useAuth } from '../context';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="mb-6">Mój profil</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white mb-4">
                <User className="w-12 h-12" />
              </div>
              <h3 className="mb-1">{user?.name || 'Użytkownik'}</h3>
              <p className="text-sm text-muted-foreground">ID: {user?.id || '#00000000'}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleNavigate('settings')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition text-left"
              >
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span>Ustawienia konta</span>
              </button>
              <button
                onClick={() => handleNavigate('history')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition text-left"
              >
                <History className="w-5 h-5 text-muted-foreground" />
                <span>Historia zakładów</span>
              </button>
              <button
                onClick={() => handleNavigate('wallet')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition text-left"
              >
                <Wallet className="w-5 h-5 text-muted-foreground" />
                <span>Portfel</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-destructive/10 text-destructive transition text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Wyloguj się</span>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-md p-6 border border-border mb-6">
            <h3 className="mb-4">Informacje osobiste</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div>{user?.email || 'brak@email.com'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Telefon</div>
                  <div>+48 123 456 789</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">Data rejestracji</div>
                  <div>15 marca 2026</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-md p-6 border border-border">
            <h3 className="mb-4">Statystyki</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">234</div>
                <div className="text-sm text-muted-foreground mt-1">Zakłady</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">142</div>
                <div className="text-sm text-muted-foreground mt-1">Wygrane</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">60.7%</div>
                <div className="text-sm text-muted-foreground mt-1">Skuteczność</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">+1,234</div>
                <div className="text-sm text-muted-foreground mt-1">Zysk (PLN)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
