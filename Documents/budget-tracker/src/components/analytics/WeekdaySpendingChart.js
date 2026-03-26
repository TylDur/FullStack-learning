import React from 'react';
import { useExpenseContext } from '../../context/ExpenseContext';
import { getWeekdaySpending } from '../../services/analyticsService';
import { formatIndianRupee } from '../../utils/analytics';

const WeekdaySpendingChart = () => {
  const { expenses } = useExpenseContext();
  const weekdayData = getWeekdaySpending(expenses);
  
  const maxAmount = Math.max(...weekdayData.map(d => d.amount), 1);
  
  return (
    <div className="space-y-3">
      {weekdayData.map(({ day, amount, average, transactionCount }) => (
        <div key={day} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-gray-600">{day}</span>
            <div className="flex gap-3">
              <span className="text-gray-500">{transactionCount} txns</span>
              <span className="font-semibold text-gray-700">{formatIndianRupee(amount)}</span>
            </div>
          </div>
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
              style={{ width: `${(amount / maxAmount) * 100}%` }}
            />
          </div>
          {average > 0 && (
            <p className="text-xs text-gray-400">
              Avg: {formatIndianRupee(average)} per transaction
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default WeekdaySpendingChart;