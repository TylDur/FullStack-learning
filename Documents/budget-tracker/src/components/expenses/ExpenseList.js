import React, { useEffect } from "react";
import useExpenses from "../../hooks/useExpenses";
import { useExpenseContext } from "../../context/ExpenseContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import ExpenseItem from "./ExpenseItem";
import { exportToCSV, formatMonthForFilename } from "../../services/exportService";

const ExpenseList = () => {
  const { currentUser } = useAuth();
  const { currentMonth, setCurrentMonth, loading } = useExpenseContext();
  const { expenses, fetchExpenses, removeExpense } = useExpenses();
  const { success, error: showError } = useToast();

  useEffect(() => {
    if (currentUser) {
      fetchExpenses(currentUser.uid, currentMonth);
    }
  }, [currentUser, currentMonth]);

  const handleMonthChange = (direction) => {
    const [year, month] = currentMonth.split("-").map(Number);
    let newMonth = month + direction;
    let newYear = year;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    const formatted = `${newYear}-${String(newMonth).padStart(2, "0")}`;
    setCurrentMonth(formatted);
  };

  const getTotalExpenses = () => {
    return expenses
      .reduce((total, expense) => total + expense.amount, 0)
      .toFixed(2);
  };

  const formatMonthDisplay = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await removeExpense(currentUser.uid, expenseId);
        success("Expense deleted successfully! 🗑️");
      } catch (error) {
        console.error("Error deleting expense:", error);
        showError("Failed to delete expense");
      }
    }
  };

  // Handle CSV Export
  const handleExport = () => {
    if (expenses.length === 0) {
      showError("No expenses to export for this month");
      return;
    }
    
    const monthName = formatMonthForFilename(currentMonth);
    exportToCSV(expenses, monthName);
    success(`Exported ${expenses.length} expenses for ${formatMonthDisplay(currentMonth)}`);
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Month Navigator with Export Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => handleMonthChange(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
        >
          ←
        </button>
        <span className="text-sm font-semibold text-gray-700">
          {formatMonthDisplay(currentMonth)}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="p-2 rounded-lg hover:bg-green-50 transition-colors text-green-600 hover:text-green-700"
            title="Export to CSV"
          >
            📥
          </button>
          <button
            onClick={() => handleMonthChange(1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
          >
            →
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between px-4 py-3 bg-indigo-50 rounded-xl">
        <span className="text-sm font-medium text-indigo-700">
          Total Spent
        </span>
        <span className="text-lg font-bold text-indigo-700">
          ₹{getTotalExpenses()}
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Empty State */}
      {!loading && expenses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 gap-2">
          <span className="text-3xl">💸</span>
          <p className="text-sm text-gray-400 font-medium">
            No expenses for {formatMonthDisplay(currentMonth)}
          </p>
          <p className="text-xs text-gray-300">
            Click "Add Expense" to get started
          </p>
        </div>
      )}

      {/* Expense Items */}
      {!loading && expenses.length > 0 && (
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
          {expenses.map(expense => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onDelete={() => handleDelete(expense.id)}
            />
          ))}
        </div>
      )}

    </div>
  );
};

export default ExpenseList;