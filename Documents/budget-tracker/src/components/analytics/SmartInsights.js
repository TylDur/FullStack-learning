import React, { useEffect, useState } from 'react';
import { useExpenseContext } from '../../context/ExpenseContext';
import { generateInsights, getMonthComparison } from '../../services/analyticsService';

const SmartInsights = () => {
  const { expenses, budgets } = useExpenseContext();
  const [insights, setInsights] = useState([]);
  
  useEffect(() => {
    if (expenses.length > 0) {
      // For month comparison, we'd need previous month's data
      // For now, we'll generate insights without comparison
      const comparison = {
        percentageChange: 0,
        categoryComparison: []
      };
      const newInsights = generateInsights(expenses, budgets, comparison);
      setInsights(newInsights);
    }
  }, [expenses, budgets]);
  
  const getStyleByType = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'tip':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };
  
  if (insights.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 text-center">
        <p className="text-sm text-gray-400">Add more expenses to get personalized insights</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🧠</span>
        <h3 className="text-sm font-semibold text-gray-700">Smart Insights</h3>
      </div>
      
      {insights.map((insight, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg border ${getStyleByType(insight.type)}`}
        >
          <div className="flex items-start gap-2">
            <span className="text-lg">{insight.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium">{insight.message}</p>
              <p className="text-xs opacity-75 mt-1">{insight.action}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SmartInsights;