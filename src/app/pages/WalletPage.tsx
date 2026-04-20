import { ArrowDownCircle, ArrowUpCircle, CreditCard, Landmark } from 'lucide-react';
import { useState } from 'react';

const transactions = [
  { id: 1, type: 'deposit', amount: 200, method: 'Karta kredytowa', date: '2026-04-19 14:30' },
  { id: 2, type: 'bet', amount: -50, method: 'Zakład #12345', date: '2026-04-19 18:30' },
  { id: 3, type: 'win', amount: 92.50, method: 'Wygrana #12345', date: '2026-04-19 20:45' },
  { id: 4, type: 'bet', amount: -100, method: 'Zakład #12346', date: '2026-04-18 21:00' },
  { id: 5, type: 'deposit', amount: 500, method: 'Przelew bankowy', date: '2026-04-17 10:15' },
];

export function WalletPage() {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');

  const balance = 1234.50;

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="mb-6">Portfel</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-lg shadow-lg p-6 mb-6">
            <div className="text-sm opacity-80 mb-2">Dostępne środki</div>
            <div className="text-3xl font-bold mb-4">{balance.toFixed(2)} PLN</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="opacity-80">Zablokowane</div>
                <div className="font-medium">125.00 PLN</div>
              </div>
              <div>
                <div className="opacity-80">Bonus</div>
                <div className="font-medium">50.00 PLN</div>
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

              <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition font-medium">
                {activeTab === 'deposit' ? 'Wpłać środki' : 'Wypłać środki'}
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
              <h3>Historia transakcji</h3>
            </div>

            <div className="divide-y divide-border">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="p-4 hover:bg-muted/50 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {transaction.type === 'deposit' && (
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                          <ArrowDownCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                      )}
                      {transaction.type === 'withdraw' && (
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                          <ArrowUpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                      {transaction.type === 'bet' && (
                        <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full">
                          <ArrowUpCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                      )}
                      {transaction.type === 'win' && (
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                          <ArrowDownCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                      )}

                      <div>
                        <div className="font-medium">{transaction.method}</div>
                        <div className="text-sm text-muted-foreground">{transaction.date}</div>
                      </div>
                    </div>

                    <div className={`font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-foreground'}`}>
                      {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toFixed(2)} PLN
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
