import React, { useState } from 'react';
import CATEGORIES from '../../constants/categories';
import { useExpenseContext } from '../../context/ExpenseContext';
import { useToast } from '../../context/ToastContext';

const BudgetForm = ({ onClose }) => {
  const { setBudget, budgets, getSpentByCategory } = useExpenseContext();
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    category: CATEGORIES[0],
    limit: ''
  });
  const [loading, setLoading] = useState(false);

  // Get existing budget for selected category
  const existingBudget = budgets.find(b => b.category === formData.category);
  const currentSpent = getSpentByCategory(formData.category);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.limit || formData.limit <= 0) {
      showError("Please enter a valid budget amount");
      return;
    }
    
    setLoading(true);
    
    try {
      setBudget(formData.category, parseFloat(formData.limit));
      
      if (existingBudget) {
        success(`${formData.category} budget updated to ₹${formData.limit}`);
      } else {
        success(`${formData.category} budget set to ₹${formData.limit}`);
      }
      
      onClose();
    } catch (error) {
      console.error("Error setting budget:", error);
      showError("Failed to set budget");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Category */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Budget Amount */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">
          Monthly Budget (₹)
        </label>
        <input
          type="number"
          name="limit"
          placeholder="Enter amount"
          value={formData.limit}
          onChange={handleChange}
          required
          min="0"
          step="100"
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {existingBudget && (
          <p className="text-xs text-gray-400 mt-1">
            Current budget: ₹{existingBudget.limit}
          </p>
        )}
        {currentSpent > 0 && (
          <p className="text-xs text-gray-400">
            Already spent this month: ₹{currentSpent.toFixed(2)}
          </p>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg p-3">
        <p className="text-xs text-blue-700">
          💡 You'll receive alerts when you reach 80% of your budget
        </p>
        {currentSpent > 0 && existingBudget && (
          <p className="text-xs text-blue-600 mt-2">
            Current usage: {((currentSpent / existingBudget.limit) * 100).toFixed(0)}% of budget
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : existingBudget ? "Update Budget" : "Set Budget"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;