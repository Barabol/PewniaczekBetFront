import { Trophy, Mail, Lock, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await register(name, surname, email, password);
        toast.success('Konto zostało utworzone!');
      } else {
        await login(email, password);
        toast.success('Zalogowano pomyślnie!');
      }
      navigate('/');
    } catch {
      toast.error(isRegister ? 'Nie udało się utworzyć konta' : 'Nieprawidłowy email lub hasło');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-full">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="mb-2">{isRegister ? 'Zarejestruj się' : 'Witaj w PewniaczekBet'}</h2>
          <p className="text-muted-foreground">
            {isRegister ? 'Utwórz konto i zacznij obstawiać' : 'Zaloguj się, aby kontynuować'}
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Imię</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jan"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-background"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-2">Nazwisko</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      placeholder="Kowalski"
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-background"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="twoj@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-background"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Hasło</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-background"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition font-medium"
            >
              {isRegister ? 'Zarejestruj się' : 'Zaloguj się'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {isRegister ? 'Masz już konto? ' : 'Nie masz konta? '}
            </span>
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-green-600 hover:text-green-700 font-medium"
            >
              {isRegister ? 'Zaloguj się' : 'Zarejestruj się'}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Logując się, akceptujesz nasz Regulamin i Politykę Prywatności</p>
          <p className="mt-2">18+ | Hazard może uzależniać</p>
        </div>
      </div>
    </div>
  );
}
