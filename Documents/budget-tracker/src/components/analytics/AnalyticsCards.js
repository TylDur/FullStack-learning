import React from 'react';
import { useExpenseContext } from '../../context/ExpenseContext';
import { formatIndianRupee, calculateTotalExpenses, getCategoryBreakdown, getTopCategory } from '../../utils/analytics';

const AnalyticsCards = () => {
  const { expenses, loading } = useExpenseContext();
  
  const totalExpenses = calculateTotalExpenses(expenses);
  const categoryBreakdown = getCategoryBreakdown(expenses);
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
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-full"></div>
            <div className="h-6 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Total Spent Card - ANAL-1 */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl border border-indigo-400/20 shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-indigo-100">
            Total Spent This Month
          </p>
          <span className="text-2xl">💰</span>
        </div>
        <p className="text-3xl font-bold text-white mb-1">
          {formatIndianRupee(totalExpenses)}
        </p>
        <p className="text-xs text-indigo-200">
          {expenses.length} {expenses.length === 1 ? 'transaction' : 'transactions'}
        </p>
      </div>
      
      {/* Top Category Card - ANAL-3 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-600">
            Top Spending Category
          </p>
          <span className="text-2xl">🏆</span>
        </div>
        {topCategory ? (
          <>
            <p className="text-xl font-bold text-gray-800 mb-1">
              {topCategory.category}
            </p>
            <p className="text-lg font-semibold text-indigo-600">
              {formatIndianRupee(topCategory.amount)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {topCategory.percentage.toFixed(1)}% of total
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-400">No expenses yet</p>
        )}
      </div>
      
      {/* Category Breakdown Card - ANAL-2 (Full Width) */}
      <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-700">
              Spending by Category
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Sorted by highest spending
            </p>
          </div>
          <span className="text-2xl">📊</span>
        </div>
        
        {categoryBreakdown.length > 0 ? (
          <div className="space-y-4">
            {categoryBreakdown.map((item) => (
              <div key={item.category} className="flex items-center gap-3">
                <div className="w-24 text-sm font-medium text-gray-700">
                  {item.category}
                </div>
                <div className="flex-1">
                  <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    >
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white font-medium">
                        {item.percentage.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-28 text-right font-semibold text-gray-800">
                  {formatIndianRupee(item.amount)}
                </div>
                <div className="w-16 text-right text-xs text-gray-400">
                  {item.count} items
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">No expenses to display</p>
            <p className="text-xs text-gray-300 mt-1">Add your first expense to see analytics</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCards;