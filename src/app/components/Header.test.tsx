import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import userEvent from '@testing-library/user-event';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'nav.sport': 'Sport',
        'nav.live': 'Live',
        'nav.history': 'Historia',
        'nav.admin': 'Admin',
        'nav.profile': 'Profil',
        'nav.login': 'Zaloguj',
      };
      return translations[key] || key;
    },
    i18n: {
      language: 'pl',
      changeLanguage: vi.fn(),
    },
  }),
}));

describe('Header Component', () => {
  const defaultProps = {
    currentPage: 'home',
    onNavigate: vi.fn(),
    isDark: false,
    onThemeToggle: vi.fn(),
    isLoggedIn: false,
    balance: 100,
  };

  it('renders application brand name and sport/live links', () => {
    render(<Header {...defaultProps} />);
    expect(screen.getByText('PewniaczekBet')).toBeInTheDocument();
    expect(screen.getByText('Sport')).toBeInTheDocument();
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('renders login link when user is not logged in', () => {
    render(<Header {...defaultProps} isLoggedIn={false} />);
    expect(screen.getByText('Zaloguj')).toBeInTheDocument();
  });

  it('renders profile and balance when user is logged in', () => {
    render(<Header {...defaultProps} isLoggedIn={true} balance={150.5} />);
    expect(screen.getByText('Profil')).toBeInTheDocument();
    expect(screen.getByText('150.50 PLN')).toBeInTheDocument();
  });

  it('triggers navigation callback on link click', async () => {
    const onNavigateMock = vi.fn();
    render(<Header {...defaultProps} onNavigate={onNavigateMock} />);
    const liveLink = screen.getByText('Live');
    await userEvent.click(liveLink);
    expect(onNavigateMock).toHaveBeenCalledWith('live');
  });
});
