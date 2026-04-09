import React, { useState, useMemo, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { TaxEngine } from './components/TaxEngine';
import { Planning } from './components/Planning';
import { generateMockData } from './lib/mockData';
import { Transaction } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Calculator, 
  PieChart as PieChartIcon, 
  Bell, 
  User,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

export default function App() {
  const initialData = useMemo(() => generateMockData(), []);
  const [transactions, setTransactions] = useState<Transaction[]>(initialData.transactions);
  const [history, setHistory] = useState(initialData.monthlyHistory);
  const [accounts, setAccounts] = useState(initialData.accounts);
  const [budgets, setBudgets] = useState(initialData.budgets);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('omnifi-theme');
    return (saved as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('omnifi-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const tx: Transaction = {
      ...newTx,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTransactions([tx, ...transactions]);
    
    // Update account balance
    setAccounts(prev => prev.map(acc => {
      if (acc.name === tx.account) {
        return {
          ...acc,
          balance: tx.type === 'income' ? acc.balance + tx.amount : acc.balance - tx.amount
        };
      }
      return acc;
    }));

    // Update budget if applicable
    if (tx.type === 'expense') {
      setBudgets(prev => prev.map(b => {
        if (b.category === tx.category) {
          return { ...b, spent: b.spent + tx.amount };
        }
        return b;
      }));
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'planning', label: 'Planning', icon: PieChartIcon },
    { id: 'tax', label: 'Tax Engine', icon: Calculator },
  ];

  return (
    <div className={`min-h-screen flex flex-col md:flex-row transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Custom Cursor Effect */}
      <motion.div 
        className="fixed top-0 left-0 w-6 h-6 border-2 border-emerald-500 rounded-full pointer-events-none z-[9999] hidden md:block"
        animate={{
          x: -12,
          y: -12,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
        style={{ x: 0, y: 0 }}
      />

      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-900"
          >
            O
          </motion.div>
          <span className="font-bold text-xl tracking-tight">OmniFi</span>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="p-1 hover:bg-slate-800 rounded-md">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-0 z-40 md:relative md:z-0
        transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        transition-transform duration-300 ease-in-out
        w-64 bg-slate-900 text-slate-400 flex flex-col border-r border-slate-800
      `}>
        <div className="p-6 hidden md:flex items-center space-x-3">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-slate-900 text-xl"
          >
            O
          </motion.div>
          <span className="font-bold text-2xl text-white tracking-tight">OmniFi</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-4">Main Menu</p>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                  activeTab === item.id 
                    ? 'bg-emerald-500/10 text-emerald-500 font-medium' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className={`h-5 w-5 transition-transform duration-200 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span>{item.label}</span>
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1 h-4 bg-emerald-500 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <motion.div 
            whileHover={{ x: 5 }}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Gaurav Lahoti</p>
              <p className="text-xs text-slate-500 truncate">Premium Member</p>
            </div>
          </motion.div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className={`hidden md:flex h-16 items-center justify-between px-8 sticky top-0 z-30 border-b transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center space-x-4">
            <h1 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Welcome back, Gaurav</h1>
            <motion.span 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase"
            >
              Active SIPs
            </motion.span>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </motion.button>
            <button className="p-2 text-slate-400 hover:text-slate-600 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>FY 2024-25</span>
            </div>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 scrollbar-hide">
              <TabsList className={`${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-200/50'} p-1 rounded-xl`}>
                <TabsTrigger value="dashboard" className="rounded-lg px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all duration-200">Dashboard</TabsTrigger>
                <TabsTrigger value="transactions" className="rounded-lg px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all duration-200">Transactions</TabsTrigger>
                <TabsTrigger value="planning" className="rounded-lg px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all duration-200">Budgets & Planning</TabsTrigger>
                <TabsTrigger value="tax" className="rounded-lg px-6 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all duration-200">Tax Engine</TabsTrigger>
              </TabsList>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="focus-visible:outline-none"
              >
                <TabsContent value="dashboard" className="mt-0 focus-visible:outline-none">
                  <Dashboard 
                    history={history} 
                    recentTransactions={transactions} 
                    accounts={accounts}
                    theme={theme}
                  />
                </TabsContent>

                <TabsContent value="transactions" className="mt-0 focus-visible:outline-none">
                  <Transactions 
                    transactions={transactions} 
                    onAddTransaction={handleAddTransaction}
                    theme={theme}
                  />
                </TabsContent>

                <TabsContent value="planning" className="mt-0 focus-visible:outline-none">
                  <Planning budgets={budgets} accounts={accounts} theme={theme} />
                </TabsContent>

                <TabsContent value="tax" className="mt-0 focus-visible:outline-none">
                  <TaxEngine theme={theme} />
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
