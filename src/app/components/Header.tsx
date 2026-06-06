import { Trophy, User, Menu, Wallet } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  isLoggedIn: boolean;
  balance: number;
}

export function Header({ currentPage, onNavigate, isDark, onThemeToggle, isLoggedIn, balance }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3 hover:opacity-80 transition">
            <Trophy className="w-8 h-8" />
            <h1 className="text-2xl font-bold">PewniaczekBet</h1>
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-green-200 transition ${currentPage === 'home' ? 'border-b-2 border-white' : ''}`}
            >
              Sport
            </button>
            <button
              onClick={() => onNavigate('live')}
              className={`hover:text-green-200 transition ${currentPage === 'live' ? 'border-b-2 border-white' : ''}`}
            >
              Live
            </button>
            <button
              onClick={() => onNavigate('esports')}
              className={`hover:text-green-200 transition ${currentPage === 'esports' ? 'border-b-2 border-white' : ''}`}
            >
              E-sport
            </button>
            {isLoggedIn && (
              <button
                onClick={() => onNavigate('history')}
                className={`hover:text-green-200 transition ${currentPage === 'history' ? 'border-b-2 border-white' : ''}`}
              >
                Historia
              </button>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
            {isLoggedIn && (
              <button
                onClick={() => onNavigate('wallet')}
                className="hidden md:flex items-center gap-2 bg-white dark:bg-white/10 text-green-700 dark:text-white px-4 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-white/20 transition"
              >
                <Wallet className="w-4 h-4" />
                <span>{balance.toFixed(2)} PLN</span>
              </button>
            )}
            <button
              onClick={() => onNavigate(isLoggedIn ? 'profile' : 'login')}
              className="flex items-center gap-2 bg-green-800 px-4 py-2 rounded-lg hover:bg-green-900 transition"
            >
              <User className="w-4 h-4" />
              <span className="hidden md:inline">{isLoggedIn ? 'Profil' : 'Zaloguj'}</span>
            </button>
            <button className="md:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
