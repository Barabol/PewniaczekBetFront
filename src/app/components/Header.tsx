import { Trophy, User, Menu, Wallet } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  isLoggedIn: boolean;
  balance: number;
  isAdmin?: boolean;
}

export function Header({ currentPage, onNavigate, isDark, onThemeToggle, isLoggedIn, balance, isAdmin = false }: HeaderProps) {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language && i18n.language.startsWith('en') ? 'pl' : 'en';
    i18n.changeLanguage(nextLang);
  };

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
              {t('nav.sport')}
            </button>
            <button
              onClick={() => onNavigate('live')}
              className={`hover:text-green-200 transition ${currentPage === 'live' ? 'border-b-2 border-white' : ''}`}
            >
              {t('nav.live')}
            </button>
            {isLoggedIn && (
              <>
                <button
                  onClick={() => onNavigate('history')}
                  className={`hover:text-green-200 transition ${currentPage === 'history' ? 'border-b-2 border-white' : ''}`}
                >
                  {t('nav.history')}
                </button>
                {isAdmin && (
                  <button
                     onClick={() => onNavigate('admin')}
                     className={`hover:text-green-200 transition ${currentPage === 'admin' ? 'border-b-2 border-white' : ''}`}
                  >
                    {t('nav.admin')}
                  </button>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
            <button
              onClick={toggleLanguage}
              className="px-2 py-1.5 rounded bg-green-800 hover:bg-green-900 text-xs font-bold transition flex items-center justify-center uppercase cursor-pointer"
              title="Zmień język / Change language"
            >
              {i18n.language && i18n.language.startsWith('en') ? 'PL' : 'EN'}
            </button>
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
              <span className="hidden md:inline">{isLoggedIn ? t('nav.profile') : t('nav.login')}</span>
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
