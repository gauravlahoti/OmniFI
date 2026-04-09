export type TransactionCategory = 
  | 'Salary' 
  | 'Bonus' 
  | 'UPI/Food' 
  | 'UPI/Groceries' 
  | 'Rent' 
  | 'Utilities' 
  | 'EMI' 
  | 'Investment' 
  | 'Shopping' 
  | 'Travel' 
  | 'Other';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: TransactionCategory;
  description: string;
  type: 'income' | 'expense';
  account: string;
  tags?: string[];
}

export interface Account {
  id: string;
  name: string;
  type: 'Savings' | 'Credit Card' | 'FD' | 'PF' | 'Mutual Fund';
  balance: number;
  color: string;
}

export interface Budget {
  category: TransactionCategory;
  limit: number;
  spent: number;
}

export interface MonthlyData {
  month: string; // YYYY-MM
  income: number;
  expense: number;
  investment: number;
  netWorth: number;
}

export interface UserProfile {
  name: string;
  annualSalary: number;
  regime: 'old' | 'new';
}
