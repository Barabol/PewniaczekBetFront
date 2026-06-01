import { ArrowDownCircle, ArrowUpCircle, CreditCard, Landmark, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context';
import { paymentService } from '../services';
import { ApiError } from '../services';
import { toast } from 'sonner';
import { useSearchParams } from 'react-router-dom';

export function WalletPage() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const paymentId = searchParams.get('paymentId');
    if (paymentId) {
      paymentService.redirect(Number(paymentId))
        .then(() => refreshUser())
        .then(() => toast.success('Płatność zakończona pomyślnie'))
        .catch(() => toast.error('Nie udało się przetworzyć płatności'));
    }
  }, []);

  const handlePayment = async () => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Podaj prawidłową kwotę');
      return;
    }
    setLoading(true);
    try {
      const result = await paymentService.send(Math.round(amountNum));
      if (result.url) {
        window.location.href = result.url;
      } else {
        await refreshUser();
        toast.success('Płatność została zrealizowana');
        setAmount('');
      }
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Nie udało się zrealizować płatności';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="mb-6">Portfel</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg shadow-lg p-6 mb-6">
            <div className="text-sm opacity-80 mb-2">Dostępne środki</div>
            <div className="text-3xl font-bold mb-4">{user?.balance?.toFixed(2) || '0.00'} PLN</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="opacity-80">Freebet</div>
                <div className="font-medium">{user?.freeBetBalance?.toFixed(2) || '0.00'} PLN</div>
              </div>
              <div>
                <div className="opacity-80">Stan konta</div>
                <div className="font-medium">{user?.accountTypeId === 1 ? 'Premium' : 'Standard'}</div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('deposit')}
                className={`flex-1 py-3 px-4 transition ${
                  activeTab === 'deposit'
                    ? 'bg-green-600 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Wpłata
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                className={`flex-1 py-3 px-4 transition ${
                  activeTab === 'withdraw'
                    ? 'bg-green-600 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Wypłata
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm mb-2">Kwota (PLN)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-background"
                  min="10"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Metoda płatności</label>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 p-3 border border-border rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950 transition">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <span>Karta kredytowa/debetowa</span>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 border border-border rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950 transition">
                    <Landmark className="w-5 h-5 text-muted-foreground" />
                    <span>Przelew bankowy</span>
                  </button>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Przetwarzanie...' : activeTab === 'deposit' ? 'Wpłać środki' : 'Wypłać środki'}
              </button>

              <p className="text-xs text-muted-foreground mt-3 text-center">
                {activeTab === 'deposit'
                  ? 'Minimalna wpłata: 10 PLN'
                  : 'Minimalna wypłata: 20 PLN'}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-md border border-border">
            <div className="p-6 border-b border-border">
              <h3>Podsumowanie</h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">Saldo główne</div>
                  <div className="text-sm text-muted-foreground">Dostępne do obstawiania</div>
                </div>
                <div className="text-xl font-bold text-green-600">{user?.balance?.toFixed(2) || '0.00'} PLN</div>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">Freebet</div>
                  <div className="text-sm text-muted-foreground">Środki bonusowe</div>
                </div>
                <div className="text-xl font-bold text-blue-600">{user?.freeBetBalance?.toFixed(2) || '0.00'} PLN</div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-md border border-border mt-6">
            <div className="p-6">
              <button
                onClick={async () => {
                  try {
                    await paymentService.reloadAll();
                    await refreshUser();
                    toast.success('Stan konta został odświeżony');
                  } catch {
                    toast.error('Nie udało się odświeżyć stanu konta');
                  }
                }}
                className="w-full flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition"
              >
                <ExternalLink className="w-5 h-5" />
                Odśwież stan konta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}