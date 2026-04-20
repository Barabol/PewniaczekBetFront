import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { LivePage } from './pages/LivePage';
import { PromotionsPage } from './pages/PromotionsPage';
import { ResultsPage } from './pages/ResultsPage';
import { ProfilePage } from './pages/ProfilePage';
import { HistoryPage } from './pages/HistoryPage';
import { WalletPage } from './pages/WalletPage';
import { SettingsPage } from './pages/SettingsPage';
import { EsportsPage } from './pages/EsportsPage';
import { LoginPage } from './pages/LoginPage';
import { StatsPage } from './pages/StatsPage';

interface Bet {
  team: string;
  odd: number;
  match: string;
  id: string;
}

type Page = 'home' | 'live' | 'promotions' | 'results' | 'profile' | 'history' | 'wallet' | 'settings' | 'esports' | 'login' | 'stats';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isDark, setIsDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(1234.50);
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleAddToBet = (team: string, odd: number, match: string) => {
    const newBet: Bet = {
      team,
      odd,
      match,
      id: `${Date.now()}-${Math.random()}`,
    };

    const existingBetIndex = bets.findIndex(bet => bet.match === match);

    if (existingBetIndex !== -1) {
      const updatedBets = [...bets];
      updatedBets[existingBetIndex] = newBet;
      setBets(updatedBets);
    } else {
      setBets([...bets, newBet]);
    }
  };

  const handleRemoveBet = (id: string) => {
    setBets(bets.filter(bet => bet.id !== id));
  };

  const handleClearAll = () => {
    setBets([]);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  const renderPage = () => {
    if (!isLoggedIn && currentPage === 'login') {
      return <LoginPage onLogin={handleLogin} />;
    }

    if (!isLoggedIn && ['profile', 'history', 'wallet', 'settings'].includes(currentPage)) {
      return <LoginPage onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case 'home':
        return <HomePage bets={bets} onAddToBet={handleAddToBet} onRemoveBet={handleRemoveBet} onClearAll={handleClearAll} />;
      case 'live':
        return <LivePage bets={bets} onAddToBet={handleAddToBet} onRemoveBet={handleRemoveBet} onClearAll={handleClearAll} />;
      case 'promotions':
        return <PromotionsPage />;
      case 'results':
        return <ResultsPage />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      case 'history':
        return <HistoryPage />;
      case 'wallet':
        return <WalletPage />;
      case 'settings':
        return <SettingsPage />;
      case 'esports':
        return <EsportsPage bets={bets} onAddToBet={handleAddToBet} onRemoveBet={handleRemoveBet} onClearAll={handleClearAll} />;
      case 'stats':
        return <StatsPage />;
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      default:
        return <HomePage bets={bets} onAddToBet={handleAddToBet} onRemoveBet={handleRemoveBet} onClearAll={handleClearAll} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
        isLoggedIn={isLoggedIn}
        balance={balance}
      />

      {renderPage()}

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
