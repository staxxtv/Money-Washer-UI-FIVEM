import React, { useState } from 'react';
import { DollarSign, ArrowRightCircle, BarChart2, History, LogOut, Banknote, CreditCard, Timer } from 'lucide-react';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  fee: number;
  timestamp: Date;
}

interface Card {
  id: number;
  type: string;
  number: string;
  color: string;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cleanMoney, setCleanMoney] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isWashing, setIsWashing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cards] = useState<Card[]>([
    {
      id: 1,
      type: 'Platinum',
      number: '**** **** **** 4589',
      color: 'from-purple-500 to-indigo-600'
    }
  ]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleTransaction = async (type: string, amount: number) => {
    if (isWashing) return;

    setIsWashing(true);
    setProgress(0);

    const startTime = Date.now();
    const duration = 30000; // 30 seconds

    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        const fee = Math.ceil(amount * 0.05);
        const cleaned = amount - fee;
        
        setCleanMoney(prev => prev + cleaned);
        setTransactions(prev => [
          {
            id: Date.now(),
            type,
            amount,
            fee,
            timestamp: new Date()
          },
          ...prev
        ]);
        
        setTimeout(() => {
          setIsWashing(false);
          setProgress(0);
        }, 2000);
      }
    };

    requestAnimationFrame(updateProgress);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <DollarSign className="w-16 h-16 text-white mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">iMoneyWasher</h1>
            <p className="text-blue-200">Secure Money Wash System</p>
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ArrowRightCircle className="w-5 h-5" />
            Access Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">iMoneyWasher</h1>
          </div>
          <button
            onClick={() => setIsLoggedIn(false)}
            className="text-white hover:text-blue-200 transition-colors"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        {/* Cards Wallet */}
        <div className="mb-8 overflow-x-auto pb-4">
          <div className="flex gap-4">
            {cards.map(card => (
              <div
                key={card.id}
                className={`flex-shrink-0 w-72 h-44 bg-gradient-to-br ${card.color} rounded-2xl p-6 relative overflow-hidden transform transition-transform hover:scale-105`}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-white/5" />
                <div className="relative">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-white/80 text-sm">{card.type}</p>
                      <p className="text-white font-bold text-xl">${cleanMoney.toLocaleString()}</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-white/90" />
                  </div>
                  <p className="text-white/90 font-medium">{card.number}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <BarChart2 className="w-5 h-5 text-blue-400" />
              <span className="text-blue-200">Total Balance</span>
            </div>
            <h2 className="text-3xl font-bold text-white">${cleanMoney.toLocaleString()}</h2>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <History className="w-5 h-5 text-blue-400" />
              <span className="text-blue-200">Service Fee</span>
            </div>
            <h2 className="text-3xl font-bold text-white">5%</h2>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => handleTransaction('Standard', 5000)}
            disabled={isWashing}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Banknote className="w-5 h-5" />
            Wash Dirty Money
          </button>
          <button
            onClick={() => handleTransaction('Priority', 7000)}
            disabled={isWashing}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <DollarSign className="w-5 h-5" />
            Wash Marked Bills
          </button>
        </div>

        {/* Progress Bar */}
        {isWashing && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Timer className="w-5 h-5 text-blue-400 animate-spin" />
              <span className="text-white font-medium">
                {progress < 100 ? 'Processing Transaction...' : 'Washing Complete'}
              </span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.map(transaction => (
              <div
                key={transaction.id}
                className="bg-white/5 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-medium">
                    {transaction.type} Transfer
                  </p>
                  <p className="text-sm text-blue-200">
                    {transaction.timestamp.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">
                    ${transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-200">
                    Fee: ${transaction.fee.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;