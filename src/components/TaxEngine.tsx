import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { formatINR } from '@/src/lib/formatters';
import { Info, Calculator, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface TaxEngineProps {
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

export const TaxEngine: React.FC<TaxEngineProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const [annualIncome, setAnnualIncome] = useState(1800000);
  const [investments80C, setInvestments80C] = useState(150000);
  const [hra, setHra] = useState(200000);

  // Simple Tax Calculation Logic (FY 2024-25)
  const calculateOldTax = (income: number, deductions: number) => {
    const taxableIncome = Math.max(0, income - deductions - 50000); // 50k Standard Deduction
    let tax = 0;
    if (taxableIncome <= 250000) tax = 0;
    else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
    else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.2;
    else tax = 112500 + (taxableIncome - 1000000) * 0.3;
    
    // Rebate under 87A
    if (taxableIncome <= 500000) tax = 0;
    
    return tax * 1.04; // 4% Cess
  };

  const calculateNewTax = (income: number) => {
    const taxableIncome = Math.max(0, income - 75000); // 75k Standard Deduction (New Regime)
    let tax = 0;
    if (taxableIncome <= 300000) tax = 0;
    else if (taxableIncome <= 700000) tax = (taxableIncome - 300000) * 0.05;
    else if (taxableIncome <= 1000000) tax = 20000 + (taxableIncome - 700000) * 0.1;
    else if (taxableIncome <= 1200000) tax = 50000 + (taxableIncome - 1000000) * 0.15;
    else if (taxableIncome <= 1500000) tax = 80000 + (taxableIncome - 1200000) * 0.2;
    else tax = 140000 + (taxableIncome - 1500000) * 0.3;

    // Rebate under 87A for New Regime (up to 7L)
    if (taxableIncome <= 700000) tax = 0;

    return tax * 1.04; // 4% Cess
  };

  const oldTax = calculateOldTax(annualIncome, investments80C + hra);
  const newTax = calculateNewTax(annualIncome);
  const savings = Math.abs(oldTax - newTax);
  const betterRegime = oldTax < newTax ? 'Old' : 'New';

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Indian Tax Engine (FY 24-25)</h2>
        <div className={`flex items-center text-xs font-medium px-3 py-1 rounded-full ${isDark ? 'text-slate-400 bg-slate-800' : 'text-slate-500 bg-slate-100'}`}>
          <Calculator className="h-3 w-3 mr-1" /> Estimated Calculations
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className={`h-full transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <CardHeader>
              <CardTitle className={`text-lg ${isDark ? 'text-white' : ''}`}>Income & Deductions</CardTitle>
              <CardDescription className={isDark ? 'text-slate-400' : ''}>Adjust values to see tax impact</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Annual Gross Salary</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input 
                    type="number" 
                    className={`w-full pl-8 pr-4 py-2 border rounded-md outline-none transition-colors duration-300 ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:ring-emerald-500' : 'bg-white border-slate-200 focus:ring-slate-900'}`}
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>80C Investments (PPF, ELSS, etc.)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input 
                    type="number" 
                    className={`w-full pl-8 pr-4 py-2 border rounded-md outline-none transition-colors duration-300 ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:ring-emerald-500' : 'bg-white border-slate-200 focus:ring-slate-900'}`}
                    value={investments80C}
                    onChange={(e) => setInvestments80C(Math.min(150000, parseInt(e.target.value) || 0))}
                  />
                </div>
                <p className="text-[10px] text-slate-500">Max limit: ₹1,50,000</p>
              </div>
              <div className="space-y-2">
                <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>HRA Exemption</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input 
                    type="number" 
                    className={`w-full pl-8 pr-4 py-2 border rounded-md outline-none transition-colors duration-300 ${isDark ? 'bg-slate-800 border-slate-700 text-white focus:ring-emerald-500' : 'bg-white border-slate-200 focus:ring-slate-900'}`}
                    value={hra}
                    onChange={(e) => setHra(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className={`h-full text-white border-none overflow-hidden relative transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-slate-900'}`}>
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="h-32 w-32" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">Regime Comparison</CardTitle>
              <CardDescription className="text-slate-400">Which one saves you more money?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div className={`p-6 rounded-2xl border transition-all duration-500 ${betterRegime === 'Old' ? 'border-emerald-500/50 bg-emerald-500/10 scale-105' : 'border-slate-800 bg-slate-800/50'}`}>
                  <p className="text-sm text-slate-400 mb-1">Old Regime Tax</p>
                  <p className="text-3xl font-bold">{formatINR(oldTax)}</p>
                  {betterRegime === 'Old' && <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-500 text-[10px] font-bold rounded uppercase">Recommended</span>}
                </div>
                <div className={`p-6 rounded-2xl border transition-all duration-500 ${betterRegime === 'New' ? 'border-emerald-500/50 bg-emerald-500/10 scale-105' : 'border-slate-800 bg-slate-800/50'}`}>
                  <p className="text-sm text-slate-400 mb-1">New Regime Tax</p>
                  <p className="text-3xl font-bold">{formatINR(newTax)}</p>
                  {betterRegime === 'New' && <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-500 text-[10px] font-bold rounded uppercase">Recommended</span>}
                </div>
              </div>

              <div className={`p-6 rounded-2xl border flex items-center justify-between transition-colors duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-800/50 border-slate-700'}`}>
                <div>
                  <p className="text-sm text-slate-400">Potential Annual Savings</p>
                  <p className="text-2xl font-bold text-emerald-400">{formatINR(savings)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Switching to <strong>{betterRegime} Regime</strong></p>
                  <p className="text-xs text-slate-500 mt-1">is more beneficial for your profile</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Tax as % of Income</span>
                  <span>{((Math.min(oldTax, newTax) / annualIncome) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(Math.min(oldTax, newTax) / annualIncome) * 100} className={`h-1.5 ${isDark ? 'bg-slate-800' : 'bg-slate-800'}`} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className={`h-full transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <CardHeader className="flex flex-row items-center space-x-2">
              <Info className="h-5 w-5 text-blue-500" />
              <CardTitle className={`text-base ${isDark ? 'text-white' : ''}`}>Old Regime Highlights</CardTitle>
            </CardHeader>
            <CardContent className={`text-sm space-y-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <p>• Allows exemptions like HRA, LTA, and Professional Tax.</p>
              <p>• Deductions under Section 80C (PPF, LIC, ELSS) up to ₹1.5L.</p>
              <p>• Additional deduction for Home Loan Interest (Section 24b) up to ₹2L.</p>
              <p>• Higher tax slabs but more ways to reduce taxable income.</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className={`h-full transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <CardHeader className="flex flex-row items-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <CardTitle className={`text-base ${isDark ? 'text-white' : ''}`}>New Regime Highlights</CardTitle>
            </CardHeader>
            <CardContent className={`text-sm space-y-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <p>• Lower tax rates across most income slabs.</p>
              <p>• Standard deduction increased to ₹75,000 (FY 24-25).</p>
              <p>• No tax for income up to ₹7 Lakhs (due to 87A rebate).</p>
              <p>• Simple, paperwork-free filing (no need to track investments).</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};
