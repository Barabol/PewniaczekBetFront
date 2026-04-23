import { ReactNode } from 'react';
import { Header } from '../components/Header';
import { useAuth, useTheme } from '../context';
import { useNavigate, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const getCurrentPage = () => {
    const path = location.pathname.substring(1) || 'home';
    return path;
  };

  const handleNavigate = (page: string) => {
    const route = page === 'home' ? '/' : `/${page}`;
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Header
        currentPage={getCurrentPage()}
        onNavigate={handleNavigate}
        isDark={isDark}
        onThemeToggle={toggleTheme}
        isLoggedIn={isLoggedIn}
        balance={user?.balance || 0}
      />

      <main>{children}</main>

      <footer className="bg-gray-800 dark:bg-gray-950 text-white mt-12 py-8 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="mb-4">O nas</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => handleNavigate('home')} className="hover:text-white transition">O firmie</button></li>
                <li><button className="hover:text-white transition">Kariera</button></li>
                <li><button className="hover:text-white transition">Kontakt</button></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Pomoc</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button className="hover:text-white transition">FAQ</button></li>
                <li><button className="hover:text-white transition">Regulamin</button></li>
                <li><button className="hover:text-white transition">Wsparcie</button></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Zakłady</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => handleNavigate('home')} className="hover:text-white transition">Sport</button></li>
                <li><button onClick={() => handleNavigate('live')} className="hover:text-white transition">Live</button></li>
                <li><button onClick={() => handleNavigate('esports')} className="hover:text-white transition">E-sport</button></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Moje konto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => handleNavigate(isLoggedIn ? 'profile' : 'login')} className="hover:text-white transition">Profil</button></li>
                <li><button onClick={() => handleNavigate(isLoggedIn ? 'history' : 'login')} className="hover:text-white transition">Historia</button></li>
                <li><button onClick={() => handleNavigate(isLoggedIn ? 'stats' : 'login')} className="hover:text-white transition">Statystyki</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 PewniaczekBet. Wszelkie prawa zastrzeżone.</p>
            <p className="mt-2">18+ | Hazard może uzależniać</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
