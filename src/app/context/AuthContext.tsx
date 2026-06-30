import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import type { User } from '../types';
import { userService } from '../services';
import { API_ENDPOINTS } from '../constants';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, surname: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateBalance: (amount: number) => void;
  loginWithGithub: () => void;
  connectGithub: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapUserDto(dto: import('../types').UserDto): User {
  return {
    id: String(dto.id),
    name: `${dto.name} ${dto.surname}`,
    surname: dto.surname,
    balance: dto.balance / 100,
    freeBetBalance: dto.freeBetBalance / 100,
    wins: dto.wins,
    losses: dto.losses,
    winsAmount: dto.winsAmount / 100,
    lossesAmount: dto.lossesAmount / 100,
    accountTypeId: dto.accountTypeId,
    public: dto.public,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const dto = await userService.login(email, password);
    setUser(mapUserDto(dto));
  };

  const register = async (name: string, surname: string, email: string, password: string) => {
    const dto = await userService.register(name, surname, email, password);
    setUser(mapUserDto(dto));
  };

  const logout = async () => {
    try {
      await userService.logout();
    } finally {
      setUser(null);
    }
  };

  const refreshUser = useCallback(async () => {
    try {
      const dto = await userService.getDetails();
      setUser(mapUserDto(dto));
    } catch {
      setUser(null);
    }
  }, []);

  const updateBalance = (amount: number) => {
    if (user) {
      setUser({ ...user, balance: user.balance + amount });
    }
  };

  const loginWithGithub = () => {
    window.location.href = `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.OATH.GITHUB_INITIATE_LOGIN}`;
  };

  const connectGithub = () => {
    window.location.href = `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.OATH.GITHUB_INITIATE}`;
  };

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const loggedIn = await userService.checkAuth();
        if (loggedIn) {
          await refreshUser();
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      const callbackUrl = `${API_ENDPOINTS.OATH.GITHUB_CALLBACK}?code=${code}`;
      window.location.href = `${API_ENDPOINTS.BASE_URL}${callbackUrl}`;
      return;
    }

    verifyAuth();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isAuthLoading,
        login,
        register,
        logout,
        refreshUser,
        updateBalance,
        loginWithGithub,
        connectGithub,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
