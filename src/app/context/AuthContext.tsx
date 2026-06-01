import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { User } from '../types';
import { userService } from '../services';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, surname: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateBalance: (amount: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapUserDto(dto: import('../types').UserDto): User {
  return {
    id: String(dto.id),
    name: `${dto.name} ${dto.surname}`,
    email: '',
    balance: dto.balance,
    surname: dto.surname,
    freeBetBalance: dto.freeBetBalance,
    wins: dto.wins,
    losses: dto.losses,
    winsAmount: dto.winsAmount,
    lossesAmount: dto.lossesAmount,
    accountTypeId: dto.accountTypeId,
    public: dto.public,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        refreshUser,
        updateBalance,
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
