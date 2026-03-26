import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { 
  addExpense, 
  getExpensesByMonth, 
  updateExpense, 
  deleteExpense 
} from '../services/expenseService';

export const ExpenseContext = createContext();

export const useExpenseContext = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { warning, error: showError, success } = useToast();
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [alerts, setAlerts] = useState([]);
  const [notifiedBudgets, setNotifiedBudgets] = useState({}); // Track shown alerts

  // Load expenses when user or month changes
  useEffect(() => {
    if (currentUser) {
      loadExpenses();
    } else {
      setExpenses([]);
    }
  }, [currentUser, currentMonth]);

  // Check budget alerts whenever expenses or budgets change
  useEffect(() => {
    if (expenses.length > 0 && budgets.length > 0) {
      checkBudgetAlerts();
    }
  }, [expenses, budgets]);

  // Load expenses for current month
  const loadExpenses = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const expensesData = await getExpensesByMonth(currentUser.uid, currentMonth);
      setExpenses(expensesData);
      setError('');
    } catch (err) {
      console.error("Error loading expenses: ", err);
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  // Add a new expense
  const addNewExpense = async (expenseData) => {
    if (!currentUser) return { success: false, error: 'User not logged in' };
    
    setLoading(true);
    try {
      await addExpense(currentUser.uid, expenseData);
      await loadExpenses();
      return { success: true };
    } catch (err) {
      console.error("Error adding expense: ", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Update an expense
  const editExpense = async (expenseId, updatedData) => {
    if (!currentUser) return { success: false, error: 'User not logged in' };
    
    setLoading(true);
    try {
      await updateExpense(currentUser.uid, expenseId, updatedData);
      await loadExpenses();
      return { success: true };
    } catch (err) {
      console.error("Error updating expense: ", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete an expense
  const removeExpense = async (expenseId) => {
    if (!currentUser) return { success: false, error: 'User not logged in' };
    
    setLoading(true);
    try {
      await deleteExpense(currentUser.uid, expenseId);
      await loadExpenses();
      return { success: true };
    } catch (err) {
      console.error("Error deleting expense: ", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Set or update budget for a category
  const setBudget = (category, limit) => {
    const existingIndex = budgets.findIndex(b => b.category === category);
    
    if (existingIndex >= 0) {
      // Update existing budget
      const updatedBudgets = [...budgets];
      updatedBudgets[existingIndex] = { ...updatedBudgets[existingIndex], limit };
      setBudgets(updatedBudgets);
    } else {
      // Add new budget
      setBudgets([...budgets, { 
        id: Date.now().toString(),
        category, 
        limit,
        month: currentMonth,
        userId: currentUser?.uid
      }]);
    }
    
    // Reset notification tracking for this category
    setNotifiedBudgets(prev => ({
      ...prev,
      [category]: { warning: false, exceeded: false }
    }));
  };

  // Get budget for a category
  const getBudget = (category) => {
    const budget = budgets.find(b => b.category === category);
    return budget ? budget.limit : 0;
  };

  // Get spent amount for a category in current month
  const getSpentByCategory = (category) => {
    return expenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
  };

  // Check all budgets and trigger alerts
  const checkBudgetAlerts = () => {
    const newAlerts = [];
    const updatedNotified = { ...notifiedBudgets };
    
    budgets.forEach(budget => {
      const spent = getSpentByCategory(budget.category);
      const percentage = (spent / budget.limit) * 100;
      
      // 80% warning alert
      if (percentage >= 80 && percentage < 100) {
        const alertId = `${budget.category}-warning`;
        const alert = {
          id: alertId,
          category: budget.category,
          type: 'warning',
          message: `${budget.category}: ${percentage.toFixed(0)}% of budget used (₹${spent.toFixed(2)} / ₹${budget.limit.toFixed(2)})`,
          percentage,
          remaining: budget.limit - spent
        };
        newAlerts.push(alert);
        
        // Show toast notification only once per session
        if (!notifiedBudgets[budget.category]?.warning) {
          warning(`${budget.category}: ${percentage.toFixed(0)}% of budget used!`);
          updatedNotified[budget.category] = { 
            ...updatedNotified[budget.category], 
            warning: true 
          };
        }
      }
      
      // 100% exceeded alert
      if (percentage >= 100) {
        const alertId = `${budget.category}-exceeded`;
        const alert = {
          id: alertId,
          category: budget.category,
          type: 'exceeded',
          message: `${budget.category}: Budget exceeded! Spent ₹${spent.toFixed(2)} / ₹${budget.limit.toFixed(2)}`,
          percentage,
          overspent: spent - budget.limit
        };
        newAlerts.push(alert);
        
        // Show toast notification only once per session
        if (!notifiedBudgets[budget.category]?.exceeded) {
          showError(`${budget.category}: Budget exceeded by ₹${(spent - budget.limit).toFixed(2)}!`);
          updatedNotified[budget.category] = { 
            ...updatedNotified[budget.category], 
            exceeded: true 
          };
        }
      }
    });
    
    setAlerts(newAlerts);
    setNotifiedBudgets(updatedNotified);
  };

  // Clear a specific alert
  const clearAlert = (alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  // Clear all alerts
  const clearAllAlerts = () => {
    setAlerts([]);
  };

  // Reset notifications for a new month
  const resetNotifications = () => {
    setNotifiedBudgets({});
    setAlerts([]);
  };

  // Change month and reset notifications
  const changeMonth = (year, month) => {
    const newMonth = `${year}-${String(month).padStart(2, '0')}`;
    setCurrentMonth(newMonth);
    resetNotifications();
  };

  // Calculate total expenses for current month
  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + (expense.amount || 0), 0);
  };

  // Get expenses by category
  const getExpensesByCategory = () => {
    const categories = {};
    expenses.forEach(expense => {
      const category = expense.category;
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category] += expense.amount || 0;
    });
    return categories;
  };

  const value = {
    expenses,
    budgets,
    currentMonth,
    loading,
    error,
    alerts,
    setExpenses,
    setBudgets,
    setCurrentMonth,
    setLoading,
    addNewExpense,
    editExpense,
    removeExpense,
    loadExpenses,
    getTotalExpenses,
    getExpensesByCategory,
    setBudget,
    getBudget,
    getSpentByCategory,
    checkBudgetAlerts,
    clearAlert,
    clearAllAlerts,
    changeMonth,
    resetNotifications
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};