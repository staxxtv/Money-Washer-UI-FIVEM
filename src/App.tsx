import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowRightCircle, BarChart2, History, LogOut, Banknote, CreditCard, Timer } from 'lucide-react';

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [cleanMoney, setCleanMoney] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isWashing, setIsWashing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cards] = useState([
    {
      id: 1,
      type: 'Platinum',
      number: '**** **** **** 4589',
      color: 'from-purple-500 to-indigo-600'
    }
  ]);

  useEffect(() => {
    const handleMessage = (event) => {
      const data = event.data;
      if (data.action === "show") {
        setIsVisible(true);
      } else if (data.action === "hide") {
        setIsVisible(false);
        setIsWashing(false);
        setProgress(0);
      } else if (data.action === "update") {
        setCleanMoney(data.cash || 0);
        setTransactions(data.transactions || []);
      } else if (data.action === "progress") {
        setIsWashing(true);
        setProgress(data.progress || 0);
        if (data.progress >= 100) {
          setTimeout(() => setIsWashing(false), 1000);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const sendNUICallback = (callback) => {
    fetch(`https://${window.GetParentResourceName?.() || 'qb-moneywasher'}/${callback}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
  };

  const handleWashDirty = () => !isWashing && sendNUICallback('washDirty');
  const handleWashMarked = () => !isWashing && sendNUICallback('washMarked');
  const handleLogout = () => sendNUICallback('exit');

  if (!isVisible) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-bold text-white">iMoneyWasher</h1>
          </div>
          <button onClick={handleLogout} className="text-white hover:text-blue-200 transition-colors">
            <LogOut className="w-6 h-6" />
          </button>
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={handleWashDirty}
            disabled={isWashing}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Banknote className="w-5 h-5" />
            Wash Dirty Money
          </button>
          <button
            onClick={handleWashMarked}
            disabled={isWashing}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <DollarSign className="w-5 h-5" />
            Wash Marked Bills
          </button>
        </div>

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

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {transactions.map(tx => (
              <div
                key={tx.id}
                className="bg-white/5 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-medium">{tx.type}</p>
                  <p className="text-sm text-blue-200">{tx.timestamp}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">${tx.amount.toLocaleString()}</p>
                  <p className="text-sm text-blue-200">Fee: ${tx.fee.toLocaleString()}</p>
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
