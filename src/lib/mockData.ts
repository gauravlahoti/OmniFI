import { Transaction, Account, MonthlyData, TransactionCategory, Budget } from '../types';
import { subMonths, format, startOfMonth, endOfMonth, addDays } from 'date-fns';

const CATEGORIES: TransactionCategory[] = [
  'Salary', 'Bonus', 'UPI/Food', 'UPI/Groceries', 'Rent', 'Utilities', 'EMI', 'Investment', 'Shopping', 'Travel', 'Other'
];

export const generateMockData = () => {
  const transactions: Transaction[] = [];
  const monthlyHistory: MonthlyData[] = [];
  const accounts: Account[] = [
    { id: '1', name: 'HDFC Savings', type: 'Savings', balance: 450000, color: '#0ea5e9' },
    { id: '2', name: 'ICICI Credit Card', type: 'Credit Card', balance: -25000, color: '#f43f5e' },
    { id: '3', name: 'SBI FD', type: 'FD', balance: 1000000, color: '#8b5cf6' },
    { id: '4', name: 'EPF (Provident Fund)', type: 'PF', balance: 850000, color: '#f59e0b' },
    { id: '5', name: 'Mutual Funds (SIP)', type: 'Mutual Fund', balance: 1250000, color: '#10b981' },
  ];

  const monthlySalary = 150000;
  const rent = 35000;
  const emi = 25000;
  const sip = 40000;

  let currentNetWorth = 3500000;

  for (let i = 11; i >= 0; i--) {
    const monthDate = subMonths(new Date(), i);
    const monthStr = format(monthDate, 'yyyy-MM');
    const start = startOfMonth(monthDate);
    
    let monthlyIncome = 0;
    let monthlyExpense = 0;
    let monthlyInvestment = 0;

    // Salary - 1st of every month
    const salaryTx: Transaction = {
      id: `sal-${monthStr}`,
      date: format(start, 'yyyy-MM-dd'),
      amount: monthlySalary,
      category: 'Salary',
      description: 'Monthly Salary Credited',
      type: 'income',
      account: 'HDFC Savings'
    };
    transactions.push(salaryTx);
    monthlyIncome += monthlySalary;

    // Diwali Bonus in Oct/Nov (simulated)
    if (monthDate.getMonth() === 10) { // November
      const bonusTx: Transaction = {
        id: `bonus-${monthStr}`,
        date: format(addDays(start, 10), 'yyyy-MM-dd'),
        amount: 50000,
        category: 'Bonus',
        description: 'Diwali Performance Bonus',
        type: 'income',
        account: 'HDFC Savings'
      };
      transactions.push(bonusTx);
      monthlyIncome += 50000;
    }

    // Rent - 5th
    const rentTx: Transaction = {
      id: `rent-${monthStr}`,
      date: format(addDays(start, 4), 'yyyy-MM-dd'),
      amount: rent,
      category: 'Rent',
      description: 'Monthly House Rent',
      type: 'expense',
      account: 'HDFC Savings'
    };
    transactions.push(rentTx);
    monthlyExpense += rent;

    // EMI - 10th
    const emiTx: Transaction = {
      id: `emi-${monthStr}`,
      date: format(addDays(start, 9), 'yyyy-MM-dd'),
      amount: emi,
      category: 'EMI',
      description: 'Home Loan EMI',
      type: 'expense',
      account: 'HDFC Savings'
    };
    transactions.push(emiTx);
    monthlyExpense += emi;

    // SIP - 15th
    const sipTx: Transaction = {
      id: `sip-${monthStr}`,
      date: format(addDays(start, 14), 'yyyy-MM-dd'),
      amount: sip,
      category: 'Investment',
      description: 'Mutual Fund SIP',
      type: 'expense',
      account: 'HDFC Savings'
    };
    transactions.push(sipTx);
    monthlyInvestment += sip;
    monthlyExpense += sip;

    // Daily UPI Expenses (Randomized)
    const possibleTags = ['Personal', 'Business', 'Weekend', 'Essentials', 'Treat', 'Work'];
    for (let d = 0; d < 20; d++) {
      const day = Math.floor(Math.random() * 28) + 1;
      const amount = Math.floor(Math.random() * 1500) + 100;
      const cat = Math.random() > 0.5 ? 'UPI/Food' : 'UPI/Groceries';
      const desc = cat === 'UPI/Food' ? (Math.random() > 0.5 ? 'Zomato' : 'Swiggy') : 'Blinkit/Instamart';
      const tags = [possibleTags[Math.floor(Math.random() * possibleTags.length)]];
      
      transactions.push({
        id: `upi-${monthStr}-${d}`,
        date: format(addDays(start, day - 1), 'yyyy-MM-dd'),
        amount,
        category: cat as TransactionCategory,
        description: desc,
        type: 'expense',
        account: 'HDFC Savings',
        tags
      });
      monthlyExpense += amount;
    }

    // Market Growth (Simulated)
    const marketGrowth = currentNetWorth * (Math.random() * 0.02 - 0.005); // -0.5% to +1.5%
    currentNetWorth += (monthlyIncome - monthlyExpense + monthlyInvestment + marketGrowth);

    monthlyHistory.push({
      month: monthStr,
      income: monthlyIncome,
      expense: monthlyExpense,
      investment: monthlyInvestment,
      netWorth: currentNetWorth
    });
  }

  return {
    transactions: transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    monthlyHistory,
    accounts,
    budgets: [
      { category: 'UPI/Food', limit: 15000, spent: 12450 },
      { category: 'UPI/Groceries', limit: 10000, spent: 8200 },
      { category: 'Shopping', limit: 20000, spent: 22500 },
      { category: 'Travel', limit: 15000, spent: 4500 },
    ] as Budget[]
  };
};
