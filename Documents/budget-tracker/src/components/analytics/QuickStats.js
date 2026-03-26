import React from 'react';
import { useExpenseContext } from '../../context/ExpenseContext';
import { formatIndianRupee, calculateTotalExpenses, getTopCategory } from '../../utils/analytics';

const QuickStats = () => {
  const { expenses, loading } = useExpenseContext();
  
  const totalExpenses = calculateTotalExpenses(expenses);
  const topCategory = getTopCategory(expenses);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Total Spent */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl shadow-sm p-6">
        <p className="text-sm font-medium text-indigo-100 mb-2">
          Total Spent This Month
        </p>
        <p className="text-3xl font-bold text-white">
          {formatIndianRupee(totalExpenses)}
        </p>
        <p className="text-xs text-indigo-200 mt-2">
          {expenses.length} transactions
        </p>
      </div>
      
      {/* Top Category */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm font-medium text-gray-600 mb-2">
          Top Category
        </p>
        {topCategory ? (
          <>
            <p className="text-2xl font-bold text-gray-800">
              {topCategory.category}
            </p>
            <p className="text-lg font-semibold text-indigo-600 mt-1">
              {formatIndianRupee(topCategory.amount)}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {topCategory.percentage.toFixed(1)}% of total
            </p>
          </>
        ) : (
          <p className="text-gray-400">No expenses yet</p>
        )}
      </div>
    </div>
  );
};

export default QuickStats;