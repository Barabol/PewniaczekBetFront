import { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { BettingProvider } from './BettingContext';
import { ThemeProvider } from './ThemeContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BettingProvider>
          {children}
        </BettingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export { useAuth } from './AuthContext';
export { useBetting } from './BettingContext';
export { useTheme } from './ThemeContext';
