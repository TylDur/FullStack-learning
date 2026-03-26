import React from 'react';
import { useExpenseContext } from '../../context/ExpenseContext';
import { calculateFinancialHealth } from '../../services/analyticsService';
import { formatIndianRupee } from '../../utils/analytics';

const FinancialHealthCard = () => {
  const { expenses, budgets } = useExpenseContext();
  
  const health = calculateFinancialHealth(expenses, budgets);
  
  const getColorClass = () => {
    switch (health.color) {
      case 'green': return 'from-green-500 to-green-600';
      case 'blue': return 'from-blue-500 to-blue-600';
      case 'orange': return 'from-orange-500 to-orange-600';
      default: return 'from-red-500 to-red-600';
    }
  };
  
  return (
    <div className={`bg-gradient-to-br ${getColorClass()} rounded-2xl p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium opacity-90">Financial Health Score</h3>
        <span className="text-2xl">💪</span>
      </div>
      
      <div className="text-4xl font-bold mb-2">{health.score}/100</div>
      <div className="text-sm opacity-90 mb-4">{health.status}</div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span>Budget Adherence</span>
          <span>{health.breakdown.budgetAdherence}/40</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-1">
          <div 
            className="bg-white rounded-full h-1 transition-all"
            style={{ width: `${(health.breakdown.budgetAdherence / 40) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs mt-2">
          <span>Savings Rate</span>
          <span>{health.breakdown.savingsRate}/30</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-1">
          <div 
            className="bg-white rounded-full h-1 transition-all"
            style={{ width: `${(health.breakdown.savingsRate / 30) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs mt-2">
          <span>Spending Consistency</span>
          <span>{health.breakdown.consistency}/30</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-1">
          <div 
            className="bg-white rounded-full h-1 transition-all"
            style={{ width: `${(health.breakdown.consistency / 30) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-white/20">
        <div className="flex justify-between text-xs">
          <span>Savings Rate</span>
          <span className="font-medium">{health.savingsRate}%</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>Total Spent</span>
          <span className="font-medium">{formatIndianRupee(health.totalSpent)}</span>
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthCard;