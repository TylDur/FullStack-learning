import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import ExpenseList from './expenses/ExpenseList';
import ExpenseForm from './expenses/ExpenseForm';
import BudgetForm from './budgets/BudgetForm';
import BudgetProgress from './budgets/BudgetProgress';
import QuickStats from './analytics/QuickStats';
import { exportToCSV, formatMonthForFilename } from '../services/exportService';
import { useExpenseContext } from '../context/ExpenseContext';
import { useToast } from '../context/ToastContext';
import BudgetAlerts from './budgets/BudgetAlerts';


const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  // Inside Dashboard component, add:
const { expenses, currentMonth } = useExpenseContext();
const { success, error: showError } = useToast();
const handleExport = () => {
  if (expenses.length === 0) {
    showError("No expenses to export");
    return;
  }
  const monthName = formatMonthForFilename(currentMonth);
  exportToCSV(expenses, monthName);
  success(`Exported ${expenses.length} expenses`);
};

// Add this button next to Add Expense and Set Budget:
<button
  onClick={handleExport}
  className="px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-colors shadow-sm"
>
  📥 Export
</button>

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getFirstName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(" ")[0];
    }
    const emailPrefix = currentUser?.email?.split("@")[0];
    if (emailPrefix && emailPrefix.length > 10) {
      return "there";
    }
    return emailPrefix;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {getGreeting()}, {getFirstName()} 👋
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Here is your financial summary
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowExpenseForm(true)}
              className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              + Add Expense
            </button>
            <button
              onClick={() => setShowBudgetForm(true)}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-100 transition-colors"
            >
              Set Budget
            </button>
            <button
              onClick={() => navigate('/analytics')}
              className="px-5 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
            >
              📊 Analytics
            </button>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <QuickStats />

        {/* Expense Form Modal */}
        {showExpenseForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-gray-800">
                  Add New Expense
                </h2>
                <button
                  onClick={() => setShowExpenseForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-light"
                >
                  ✕
                </button>
              </div>
              <ExpenseForm onClose={() => setShowExpenseForm(false)} />
            </div>
          </div>
        )}

        {/* Budget Form Modal */}
        {showBudgetForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-gray-800">
                  Set Budget
                </h2>
                <button
                  onClick={() => setShowBudgetForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-light"
                >
                  ✕
                </button>
              </div>
              <BudgetForm onClose={() => setShowBudgetForm(false)} />
            </div>
          </div>
        )}

        {/* Main content - expenses + budget */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              Recent Transactions
            </p>
            <ExpenseList />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm font-semibold text-gray-700 mb-4">
              Budget Overview
            </p>
            <BudgetProgress />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;