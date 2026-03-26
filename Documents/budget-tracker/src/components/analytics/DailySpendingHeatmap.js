import React from 'react';
import { useExpenseContext } from '../../context/ExpenseContext';
import { getDailySpending } from '../../services/analyticsService';
import { formatIndianRupee } from '../../utils/analytics';

const DailySpendingHeatmap = () => {
  const { expenses } = useExpenseContext();
  const dailyData = getDailySpending(expenses);
  
  const maxAmount = Math.max(...dailyData.map(d => d.amount), 1);
  
  const getIntensity = (amount) => {
    const percentage = (amount / maxAmount) * 100;
    if (percentage === 0) return 'bg-gray-50';
    if (percentage < 25) return 'bg-green-100';
    if (percentage < 50) return 'bg-green-200';
    if (percentage < 75) return 'bg-yellow-200';
    return 'bg-red-200';
  };
  
  const getDaysInMonth = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  };
  
  const daysInMonth = getDaysInMonth();
  const weeks = [];
  for (let i = 0; i < daysInMonth; i += 7) {
    weeks.push(dailyData.slice(i, i + 7));
  }
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-400 mb-2">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
      
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex gap-1">
          {week.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={`flex-1 aspect-square rounded-lg ${getIntensity(day.amount)} transition-all hover:scale-110 cursor-pointer group relative`}
            >
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-gray-800 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                  Day {day.day}: {formatIndianRupee(day.amount)}
                </div>
              </div>
              <div className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-600">
                {day.day}
              </div>
            </div>
          ))}
        </div>
      ))}
      
      <div className="flex items-center justify-center gap-4 mt-4 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-100"></div>
          <span className="text-xs text-gray-500">Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-200"></div>
          <span className="text-xs text-gray-500">Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-yellow-200"></div>
          <span className="text-xs text-gray-500">High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-200"></div>
          <span className="text-xs text-gray-500">Highest</span>
        </div>
      </div>
    </div>
  );
};

export default DailySpendingHeatmap;