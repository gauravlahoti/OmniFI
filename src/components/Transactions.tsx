import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { formatINR, formatDate } from '@/src/lib/formatters';
import { Transaction, TransactionCategory } from '@/src/types';
import { Search, Plus, Filter, Download, Tag, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TransactionsProps {
  transactions: Transaction[];
  onAddTransaction: (tx: Omit<Transaction, 'id'>) => void;
  theme?: 'light' | 'dark';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const rowVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1 }
};

export const Transactions: React.FC<TransactionsProps> = ({ transactions, onAddTransaction, theme = 'dark' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newTx, setNewTx] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Other' as TransactionCategory,
    description: '',
    type: 'expense' as 'income' | 'expense',
    account: 'HDFC Savings',
    tags: [] as string[]
  });
  const [tagInput, setTagInput] = useState('');

  const allTags = Array.from(new Set(transactions.flatMap(tx => tx.tags || [])));

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         tx.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || tx.category === categoryFilter;
    const matchesTag = tagFilter === 'all' || (tx.tags && tx.tags.includes(tagFilter));
    return matchesSearch && matchesCategory && matchesTag;
  });

  const handleAddTag = () => {
    if (tagInput && !newTx.tags.includes(tagInput)) {
      setNewTx({ ...newTx, tags: [...newTx.tags, tagInput] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewTx({ ...newTx, tags: newTx.tags.filter(t => t !== tagToRemove) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      ...newTx,
      amount: parseFloat(newTx.amount) || 0
    });
    setIsModalOpen(false);
    setNewTx({
      date: new Date().toISOString().split('T')[0],
      amount: '',
      category: 'Other',
      description: '',
      type: 'expense',
      account: 'HDFC Savings',
      tags: []
    });
  };

  const categories: TransactionCategory[] = [
    'Salary', 'Bonus', 'UPI/Food', 'UPI/Groceries', 'Rent', 'Utilities', 'EMI', 'Investment', 'Shopping', 'Travel', 'Other'
  ];

  const isDark = theme === 'dark';

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Transaction Ledger</h2>
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="sm" className={`hidden md:flex ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : ''}`}>
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </motion.div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" className="bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white">
                  <Plus className="h-4 w-4 mr-2" /> Add Transaction
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className={`sm:max-w-[425px] ${isDark ? 'bg-slate-900 text-white border-slate-800' : ''}`}>
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select 
                      value={newTx.type} 
                      onValueChange={(v: any) => setNewTx({...newTx, type: v})}
                    >
                      <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      placeholder="500" 
                      value={newTx.amount}
                      onChange={(e) => setNewTx({...newTx, amount: e.target.value})}
                      className={isDark ? 'bg-slate-800 border-slate-700' : ''}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newTx.category} 
                    onValueChange={(v: any) => setNewTx({...newTx, category: v})}
                  >
                    <SelectTrigger className={isDark ? 'bg-slate-800 border-slate-700' : ''}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="Zomato Dinner" 
                    value={newTx.description}
                    onChange={(e) => setNewTx({...newTx, description: e.target.value})}
                    className={isDark ? 'bg-slate-800 border-slate-700' : ''}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add a tag..." 
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className={isDark ? 'bg-slate-800 border-slate-700' : ''}
                    />
                    <Button type="button" size="sm" onClick={handleAddTag} variant="outline" className={isDark ? 'border-slate-700' : ''}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newTx.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs rounded-full">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <input 
                    id="date" 
                    type="date" 
                    value={newTx.date}
                    onChange={(e) => setNewTx({...newTx, date: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-md outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:ring-emerald-500' : 'bg-white border-slate-200 focus:ring-slate-900'}`}
                    required
                  />
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full bg-slate-900 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:text-white">Save Transaction</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className={`border-slate-200 shadow-sm overflow-hidden transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white'}`}>
        <CardHeader className={`border-b transition-colors duration-300 ${isDark ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-slate-50/50'}`}>
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search transactions..." 
                className={`pl-10 transition-colors duration-300 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className={`w-[150px] transition-colors duration-300 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-slate-500" />
                <Select value={tagFilter} onValueChange={setTagFilter}>
                  <SelectTrigger className={`w-[150px] transition-colors duration-300 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white'}`}>
                    <SelectValue placeholder="Tag" />
                  </SelectTrigger>
                  <SelectContent className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}>
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className={isDark ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50/50'}>
                  <TableHead className={`w-[120px] ${isDark ? 'text-slate-400' : ''}`}>Date</TableHead>
                  <TableHead className={isDark ? 'text-slate-400' : ''}>Description</TableHead>
                  <TableHead className={isDark ? 'text-slate-400' : ''}>Category</TableHead>
                  <TableHead className={isDark ? 'text-slate-400' : ''}>Tags</TableHead>
                  <TableHead className={`text-right ${isDark ? 'text-slate-400' : ''}`}>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <motion.tr 
                        key={tx.id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: 10 }}
                        layout
                        className={`transition-colors ${isDark ? 'hover:bg-slate-800/50 border-slate-800' : 'hover:bg-slate-50/50'}`}
                      >
                        <TableCell className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{formatDate(tx.date)}</TableCell>
                        <TableCell className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{tx.description}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                            {tx.category}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {tx.tags?.map(tag => (
                              <span key={tag} className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${isDark ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className={`text-right font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tx.type === 'income' ? '+' : '-'}{formatINR(tx.amount)}
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                        No transactions found matching your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
