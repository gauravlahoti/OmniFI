import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from 'recharts';
import { formatINR } from '@/src/lib/formatters';
import { Budget, Account } from '@/src/types';
import { Target, TrendingUp, Shield, Coins } from 'lucide-react';
import { motion } from 'motion/react';

interface PlanningProps {
  budgets: Budget[];
  accounts: Account[];
  theme?: 'light' | 'dark';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

export const Planning: React.FC<PlanningProps> = ({ budgets, accounts, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const investmentAccounts = accounts.filter(a => a.type === 'FD' || a.type === 'PF' || a.type === 'Mutual Fund');
  
  const assetAllocation = [
    { name: 'Equity (MF)', value: accounts.find(a => a.type === 'Mutual Fund')?.balance || 0 },
    { name: 'Debt (PF)', value: accounts.find(a => a.type === 'PF')?.balance || 0 },
    { name: 'Fixed Income (FD)', value: accounts.find(a => a.type === 'FD')?.balance || 0 },
    { name: 'Cash', value: accounts.find(a => a.type === 'Savings')?.balance || 0 },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#8b5cf6', '#3b82f6'];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Budget Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Budget Engine</h2>
          <div className="text-sm text-slate-500 font-medium">Monthly Progress</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.limit) * 100;
            const isWarning = percentage >= 80 && percentage < 100;
            const isDanger = percentage >= 100;

            return (
              <motion.div key={budget.category} variants={itemVariants}>
                <Card className={`transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500">{budget.category}</p>
                        <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatINR(budget.spent)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Limit: {formatINR(budget.limit)}</p>
                        <p className={`text-sm font-bold ${isDanger ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {percentage.toFixed(0)}%
                        </p>
                      </div>
                    </div>
                    <Progress 
                      value={Math.min(100, percentage)} 
                      className={`h-2 ${isDark ? 'bg-slate-800' : 'bg-slate-100'} ${isDanger ? '[&>div]:bg-rose-500' : isWarning ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'}`} 
                    />
                    {isDanger && (
                      <p className="text-[10px] text-rose-500 mt-2 font-medium flex items-center">
                        <Target className="h-3 w-3 mr-1" /> Budget exceeded!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Investment Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Investment Tracker</h2>
          <div className="text-sm text-slate-500 font-medium">Asset Allocation</div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className={`transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <CardHeader>
                <CardTitle className={`text-lg ${isDark ? 'text-white' : ''}`}>Allocation Mix</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke={isDark ? '#0f172a' : '#fff'}
                      animationDuration={1500}
                    >
                      {assetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={isDark ? { backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '8px' } : { borderRadius: '8px' }}
                      formatter={(val: number) => formatINR(val)} 
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {investmentAccounts.map((acc) => (
              <motion.div key={acc.id} variants={itemVariants}>
                <Card className={`transition-colors duration-300 h-full ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <CardContent className="pt-6 flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`} style={{ color: acc.color }}>
                      {acc.type === 'PF' ? <Shield className="h-6 w-6" /> : acc.type === 'Mutual Fund' ? <TrendingUp className="h-6 w-6" /> : <Coins className="h-6 w-6" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">{acc.name}</p>
                      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatINR(acc.balance)}</p>
                      <p className="text-xs text-slate-400 mt-1">{acc.type} Account</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            <motion.div variants={itemVariants}>
              <Card className={`h-full shadow-sm border-dashed border-2 flex items-center justify-center p-6 transition-colors duration-300 cursor-pointer hover:border-emerald-500/50 group ${isDark ? 'bg-emerald-900/10 border-emerald-900/30' : 'bg-emerald-50 border-emerald-100'}`}>
                <div className="text-center">
                  <p className={`font-bold text-lg group-hover:scale-105 transition-transform ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>+ Add Investment</p>
                  <p className={`${isDark ? 'text-emerald-500/50' : 'text-emerald-600/70'} text-xs`}>Track Gold, Real Estate, or Crypto</p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
