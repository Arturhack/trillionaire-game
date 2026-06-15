import React, { useState, useEffect } from 'react';

// Data extracted from the provided screenshot and general knowledge
const BILLIONAIRES = [
  { id: 'musk', name: 'Elon Musk', company: 'Tesla, SpaceX', netWorth: 1300000000000, img: 'https://placehold.co/100x100/1e293b/ffffff?text=EM' },
  { id: 'page', name: 'Larry Page', company: 'Google', netWorth: 301400000000, img: 'https://placehold.co/100x100/1e293b/ffffff?text=LP' },
  { id: 'brin', name: 'Sergey Brin', company: 'Google', netWorth: 277900000000, img: 'https://placehold.co/100x100/1e293b/ffffff?text=SB' },
  { id: 'bezos', name: 'Jeff Bezos', company: 'Amazon', netWorth: 255500000000, img: 'https://placehold.co/100x100/1e293b/ffffff?text=JB' },
  { id: 'ellison', name: 'Larry Ellison', company: 'Oracle', netWorth: 241400000000, img: 'https://placehold.co/100x100/1e293b/ffffff?text=LE' }
];

const ITEMS = [
  // Luxury Items
  { id: 'coffee', name: 'Fancy Coffee', category: 'luxury', price: 5, icon: '☕' },
  { id: 'phone', name: 'Latest Smartphone', category: 'luxury', price: 1500, icon: '📱' },
  { id: 'rolex', name: 'Rolex Watch', category: 'luxury', price: 15000, icon: '⌚' },
  { id: 'tesla', name: 'Tesla Model S Plaid', category: 'luxury', price: 100000, icon: '🏎️' },
  { id: 'house', name: 'Average US Home', category: 'luxury', price: 400000, icon: '🏠' },
  { id: 'mansion', name: 'LA Mega Mansion', category: 'luxury', price: 25000000, icon: '🏰' },
  { id: 'jet', name: 'Private Jet (G650)', category: 'luxury', price: 65000000, icon: '✈️' },
  { id: 'island', name: 'Private Island', category: 'luxury', price: 150000000, icon: '🏝️' },
  { id: 'yacht', name: 'Mega Yacht', category: 'luxury', price: 300000000, icon: '🛥️' },
  { id: 'nba', name: 'NBA Team', category: 'luxury', price: 4000000000, icon: '🏀' },
  
  // World Problems
  { id: 'water', name: 'Clean Water Globally (1 Yr)', category: 'world', price: 150000000000, icon: '💧', desc: 'Provide safe drinking water to everyone on Earth.' },
  { id: 'hunger', name: 'End World Hunger (1 Yr)', category: 'world', price: 40000000000, icon: '🌾', desc: 'Fund global food security programs.' },
  { id: 'malaria', name: 'Eradicate Malaria', category: 'world', price: 120000000000, icon: '🦟', desc: 'Fund nets, vaccines, and research to end malaria forever.' },
  { id: 'homelessness', name: 'End US Homelessness', category: 'world', price: 20000000000, icon: '🏘️', desc: 'Provide housing and support for all homeless in the US.' },
  { id: 'mars', name: 'Fund Mars Colony', category: 'world', price: 500000000000, icon: '🚀', desc: 'A massive initial fund to build a sustainable city on Mars.' },
  { id: 'green', name: 'Green Energy Grid Transition', category: 'world', price: 1000000000000, icon: '⚡', desc: 'Convert a major nation\'s entire power grid to renewables.' }
];

const COUNTRIES = [
  { name: 'Saudi Arabia', gdp: 1100000000000, flag: '🇸🇦' },
  { name: 'Netherlands', gdp: 1000000000000, flag: '🇳🇱' },
  { name: 'Switzerland', gdp: 800000000000, flag: '🇨🇭' },
  { name: 'Argentina', gdp: 600000000000, flag: '🇦🇷' },
  { name: 'Finland', gdp: 300000000000, flag: '🇫🇮' },
  { name: 'New Zealand', gdp: 250000000000, flag: '🇳🇿' }
];

// Number formatters
const formatExactDollar = (num) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
};

const formatShortAbbreviation = (num) => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
  return formatExactDollar(num);
};

export default function App() {
  const [selectedBillionaireId, setSelectedBillionaireId] = useState(BILLIONAIRES[0].id);
  const [inventory, setInventory] = useState({});
  const [activeTab, setActiveTab] = useState('luxury'); // 'luxury', 'world', 'compare'

  const currentPerson = BILLIONAIRES.find(b => b.id === selectedBillionaireId);

  // Calculate total spent
  const totalSpent = Object.keys(inventory).reduce((total, itemId) => {
    const item = ITEMS.find(i => i.id === itemId);
    return total + (item.price * inventory[itemId]);
  }, 0);

  const remainingWealth = currentPerson.netWorth - totalSpent;
  const percentageSpent = ((totalSpent / currentPerson.netWorth) * 100).toFixed(6);

  // Reset inventory when changing billionaires
  useEffect(() => {
    setInventory({});
  }, [selectedBillionaireId]);

  const handleBuy = (item, amount = 1) => {
    if (remainingWealth >= item.price * amount) {
      setInventory(prev => ({
        ...prev,
        [item.id]: (prev[item.id] || 0) + amount
      }));
    }
  };

  const handleSell = (item, amount = 1) => {
    if (inventory[item.id] && inventory[item.id] > 0) {
      setInventory(prev => {
        const newAmount = prev[item.id] - amount;
        if (newAmount <= 0) {
          const newInv = { ...prev };
          delete newInv[item.id];
          return newInv;
        }
        return { ...prev, [item.id]: newAmount };
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Sticky Balance Tracker Header */}
      <div className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xl border border-slate-700 shadow-inner">
                {currentPerson.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium tracking-wider uppercase">Remaining Net Worth</p>
                <p className="text-3xl md:text-4xl font-bold text-emerald-400 font-mono tracking-tighter">
                  {formatExactDollar(remainingWealth)}
                </p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
               <p className="text-sm text-slate-400 font-medium tracking-wider uppercase">Total Spent</p>
               <p className="text-xl md:text-2xl font-bold text-rose-400 font-mono tracking-tighter">
                 {formatExactDollar(totalSpent)}
               </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-rose-500 transition-all duration-500 ease-out"
              style={{ width: `${percentageSpent}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-slate-500 font-mono">
            <span>{percentageSpent}% Spent</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Billionaire Selector */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold text-slate-300 mb-4 tracking-wide uppercase">Select a Profile</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {BILLIONAIRES.map(person => (
              <button
                key={person.id}
                onClick={() => setSelectedBillionaireId(person.id)}
                className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                  selectedBillionaireId === person.id 
                  ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                  : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="font-bold text-slate-100">{person.name}</div>
                <div className="text-xs text-slate-400 mb-2 truncate">{person.company}</div>
                <div className={`font-mono font-semibold ${selectedBillionaireId === person.id ? 'text-blue-400' : 'text-emerald-500'}`}>
                  {formatShortAbbreviation(person.netWorth)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800 mb-8 max-w-fit mx-auto md:mx-0">
          {[
            { id: 'luxury', label: 'Luxury Items' },
            { id: 'world', label: 'World Problems' },
            { id: 'compare', label: 'GDP Compare' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id 
                ? 'bg-slate-800 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Shopping Grid (Luxuries & World Problems) */}
        {activeTab !== 'compare' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ITEMS.filter(item => item.category === activeTab).map(item => {
              const count = inventory[item.id] || 0;
              const canAfford = remainingWealth >= item.price;
              
              return (
                <div key={item.id} className="bg-slate-900 rounded-2xl p-5 border border-slate-800 flex flex-col relative overflow-hidden group hover:border-slate-700 transition-colors">
                  {/* Decorative background element */}
                  <div className="absolute -right-10 -top-10 text-9xl opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                    {item.icon}
                  </div>
                  
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                  {item.desc && <p className="text-xs text-slate-400 mb-3 flex-grow">{item.desc}</p>}
                  
                  <div className="mt-auto pt-4">
                    <p className="text-lg font-mono text-emerald-400 mb-4">{formatExactDollar(item.price)}</p>
                    
                    <div className="flex items-center justify-between gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800/50">
                      <button 
                        onClick={() => handleSell(item)}
                        disabled={count === 0}
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 disabled:opacity-30 disabled:hover:bg-rose-500/10 transition-colors"
                      >
                        -
                      </button>
                      <div className="flex flex-col items-center flex-grow">
                        <span className="font-mono text-lg font-bold text-white">{count}</span>
                      </div>
                      <button 
                        onClick={() => handleBuy(item)}
                        disabled={!canAfford}
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-30 disabled:hover:bg-emerald-500/10 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* GDP Comparison View */}
        {activeTab === 'compare' && (
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <h3 className="text-xl font-bold mb-2">Wealth vs Country GDP</h3>
            <p className="text-slate-400 text-sm mb-8">Comparing {currentPerson.name}'s total net worth against the Gross Domestic Product (GDP) of major nations.</p>
            
            <div className="space-y-6">
              {/* Target Person Bar */}
              <div className="relative pt-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-lg flex items-center gap-2">
                    <span className="text-blue-400">👤 {currentPerson.name}</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">{formatShortAbbreviation(currentPerson.netWorth)}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              <div className="h-px w-full bg-slate-800 my-4"></div>

              {/* Country Bars */}
              {COUNTRIES.sort((a, b) => b.gdp - a.gdp).map(country => {
                // Calculate width relative to the billionaire's wealth (max 100%)
                let widthPercentage = (country.gdp / currentPerson.netWorth) * 100;
                // If country GDP is larger, cap the bar at 100% for UI sanity, though mostly they will be smaller
                const isLarger = widthPercentage > 100;
                const displayWidth = isLarger ? 100 : widthPercentage;

                return (
                  <div key={country.name} className="relative pt-2">
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-medium text-slate-300 flex items-center gap-2">
                        <span>{country.flag}</span> {country.name}
                      </span>
                      <span className="font-mono text-slate-400">{formatShortAbbreviation(country.gdp)}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden flex">
                      <div 
                        className={`h-full ${isLarger ? 'bg-amber-500' : 'bg-slate-400'}`} 
                        style={{ width: `${displayWidth}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-slate-500 mt-1 font-mono">
                      {((country.gdp / currentPerson.netWorth) * 100).toFixed(1)}% of {currentPerson.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>
      
      {/* Footer receipt summary */}
      {totalSpent > 0 && activeTab !== 'compare' && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 shadow-[0_-10px_20px_rgba(0,0,0,0.3)] z-40">
           <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="text-sm text-slate-400 hidden md:block">
               You've purchased <span className="text-white font-bold">{Object.values(inventory).reduce((a,b)=>a+b,0)}</span> items.
             </div>
             <button 
               onClick={() => setInventory({})}
               className="text-sm px-4 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors font-medium"
             >
               Clear All Purchases
             </button>
           </div>
        </div>
      )}

    </div>
  );
}