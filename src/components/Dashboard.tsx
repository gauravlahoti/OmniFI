import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { formatINR, formatMonth } from '@/src/lib/formatters';
import { MonthlyData, Transaction, Account } from '@/src/types';
import { ArrowUpRight, ArrowDownRight, Wallet, CreditCard, Landmark, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  history: MonthlyData[];
  recentTransactions: Transaction[];
  accounts: Account[];
  theme?: 'light' | 'dark';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  }
};

export const Dashboard: React.FC<DashboardProps> = ({ history, recentTransactions, accounts, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const currentMonth = history[history.length - 1];
  const totalNetWorth = currentMonth.netWorth;
  const liquidAssets = accounts.filter(a => a.type === 'Savings' || a.type === 'FD').reduce((sum, a) => sum + a.balance, 0);
  const totalDebt = Math.abs(accounts.filter(a => a.balance < 0).reduce((sum, a) => sum + a.balance, 0));
  const cashFlow = currentMonth.income - currentMonth.expense;

  const expenseBreakdown = [
    { name: 'Rent', value: 35000 },
    { name: 'EMI', value: 25000 },
    { name: 'Food/Grocery', value: 20000 },
    { name: 'Investments', value: 40000 },
    { name: 'Other', value: 15000 },
  ];

  const COLORS = ['#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#8b5cf6'];
  const chartGridColor = isDark ? '#1e293b' : '#f1f5f9';
  const chartTextColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Net Worth', value: totalNetWorth, icon: TrendingUp, color: 'text-emerald-500', sub: '+2.4% from last month', subIcon: ArrowUpRight, subColor: 'text-emerald-500' },
          { title: 'Liquid Assets', value: liquidAssets, icon: Wallet, color: 'text-blue-500', sub: 'Savings + FDs', subColor: 'text-slate-500' },
          { title: 'Total Debt', value: totalDebt, icon: CreditCard, color: 'text-rose-500', sub: 'Credit Card + Loans', subIcon: ArrowDownRight, subColor: 'text-rose-500' },
          { title: 'Monthly Cash Flow', value: cashFlow, icon: Landmark, color: 'text-emerald-500', sub: 'Income - Expenses', subColor: 'text-emerald-500' },
        ].map((kpi, i) => (
          <motion.div key={kpi.title} variants={itemVariants}>
            <Card className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-900 border-slate-800'} text-white overflow-hidden relative group`}>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
              />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">{kpi.title}</CardTitle>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatINR(kpi.value)}</div>
                <p className={`text-xs flex items-center mt-1 ${kpi.subColor}`}>
                  {kpi.subIcon && <kpi.subIcon className="h-3 w-3 mr-1" />} {kpi.sub}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className={`transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <CardHeader>
              <CardTitle className={`text-lg font-semibold ${isDark ? 'text-white' : ''}`}>12-Month Net Worth Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={formatMonth} 
                    tick={{fontSize: 12, fill: chartTextColor}} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tickFormatter={(val) => formatINR(val, true)} 
                    tick={{fontSize: 12, fill: chartTextColor}}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={isDark ? { backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '8px' } : { borderRadius: '8px' }}
                    formatter={(val: number) => [formatINR(val), 'Net Worth']}
                    labelFormatter={formatMonth}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="netWorth" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className={`transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <CardHeader>
              <CardTitle className={`text-lg font-semibold ${isDark ? 'text-white' : ''}`}>Monthly Income vs Expense</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={history.slice(-6)}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={formatMonth} 
                    tick={{fontSize: 12, fill: chartTextColor}}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tickFormatter={(val) => formatINR(val, true)} 
                    tick={{fontSize: 12, fill: chartTextColor}}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={isDark ? { backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', borderRadius: '8px' } : { borderRadius: '8px' }}
                    formatter={(val: number) => formatINR(val)}
                    labelFormatter={formatMonth}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={1500} />
                  <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className={`h-full transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <CardHeader>
              <CardTitle className={`text-lg font-semibold ${isDark ? 'text-white' : ''}`}>Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke={isDark ? '#0f172a' : '#fff'}
                    animationDuration={1500}
                  >
                    {expenseBreakdown.map((entry, index) => (
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

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className={`h-full transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <CardHeader>
              <CardTitle className={`text-lg font-semibold ${isDark ? 'text-white' : ''}`}>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.slice(0, 5).map((tx, idx) => (
                  <motion.div 
                    key={tx.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors border border-transparent ${isDark ? 'hover:bg-slate-800 hover:border-slate-700' : 'hover:bg-slate-50 hover:border-slate-100'}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                        {tx.type === 'income' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{tx.description}</p>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatINR(tx.amount)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
