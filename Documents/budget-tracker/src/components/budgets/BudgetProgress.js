import React, { useEffect } from "react";
import useBudgets from "../../hooks/useBudgets";
import useExpenses from "../../hooks/useExpenses";
import { useAuth } from "../../context/AuthContext";
import { useExpenseContext } from "../../context/ExpenseContext";

const BudgetProgress = () => {
  const { currentUser } = useAuth();
  const { currentMonth } = useExpenseContext();
  const { budgets, fetchBudgets } = useBudgets();
  const { expenses } = useExpenses();

  useEffect(() => {
    if (currentUser) {
      fetchBudgets(currentUser.uid, currentMonth);
    }
  }, [currentUser, currentMonth]);

  const getSpentAmount = (category) => {
    return expenses
      .filter(expense => expense.category === category)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getProgressPercentage = (spent, limit) => {
    if (limit === 0) return 0;
    return Math.min((spent / limit) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 75) return "bg-orange-400";
    if (percentage >= 50) return "bg-yellow-400";
    return "bg-green-500";
  };

  const getTextColor = (percentage) => {
    if (percentage >= 100) return "text-red-600";
    if (percentage >= 75) return "text-orange-500";
    if (percentage >= 50) return "text-yellow-600";
    return "text-green-600";
  };

  const getBadgeStyle = (percentage) => {
    if (percentage >= 100) return "bg-red-100 text-red-600";
    if (percentage >= 75) return "bg-orange-100 text-orange-600";
    if (percentage >= 50) return "bg-yellow-100 text-yellow-600";
    return "bg-green-100 text-green-600";
  };

  const getStatusText = (percentage) => {
    if (percentage >= 100) return "Exceeded";
    if (percentage >= 75) return "Almost";
    if (percentage >= 50) return "Halfway";
    return "On track";
  };

  if (budgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <span className="text-3xl">🎯</span>
        <p className="text-sm text-gray-400 font-medium">
          No budgets set for this month
        </p>
        <p className="text-xs text-gray-300">
          Click "Set Budget" to get started
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-1">
      {budgets.map(budget => {
        const spent = getSpentAmount(budget.category);
        const percentage = getProgressPercentage(spent, budget.limit);
        const progressColor = getProgressColor(percentage);
        const textColor = getTextColor(percentage);
        const badgeStyle = getBadgeStyle(percentage);
        const statusText = getStatusText(percentage);

        return (
          <div
            key={budget.id}
            className="flex flex-col gap-2 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {/* Category row */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                {budget.category}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeStyle}`}>
                {statusText}
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${progressColor}`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            {/* Amount row */}
            <div className="flex items-center justify-between">
              <span className={`text-xs font-medium ${textColor}`}>
                ₹{spent.toFixed(2)} spent
              </span>
              <span className="text-xs text-gray-400">
                of ₹{budget.limit} limit
              </span>
            </div>

            {/* Overspend warning */}
            {percentage >= 100 && (
              <div className="flex items-center gap-1 px-3 py-2 bg-red-50 rounded-lg">
                <span className="text-xs text-red-600 font-medium">
                  Over by ₹{(spent - budget.limit).toFixed(2)}
                </span>
              </div>
            )}

            {/* Almost warning */}
            {percentage >= 75 && percentage < 100 && (
              <div className="flex items-center gap-1 px-3 py-2 bg-orange-50 rounded-lg">
                <span className="text-xs text-orange-600 font-medium">
                  ₹{(budget.limit - spent).toFixed(2)} remaining
                </span>
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
};

export default BudgetProgress;