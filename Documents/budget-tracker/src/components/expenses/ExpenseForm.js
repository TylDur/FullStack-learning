import React, { useState } from "react";
import CATEGORIES from "../../constants/categories";
import useExpenses from "../../hooks/useExpenses";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext"; // Add this import

const ExpenseForm = ({ onClose }) => {
  const { createExpense } = useExpenses();
  const { currentUser } = useAuth();
  const { success, error: showError } = useToast(); // Add toast
  const [formData, setFormData] = useState({
    amount: "",
    category: CATEGORIES[0],
    description: "",
    date: new Date().toISOString().slice(0, 10)
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!formData.amount || formData.amount <= 0) {
      showError("Please enter a valid amount"); // Replace alert
      return;
    }
    
    if (!formData.date) {
      showError("Please select a date"); // Replace alert
      return;
    }
    
    if (!formData.description.trim()) {
      showError("Please enter a description"); // Replace alert
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Make sure currentUser exists
      if (!currentUser) {
        showError("You must be logged in"); // Replace alert
        return;
      }
      
      // Create expense
      await createExpense(currentUser.uid, {
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date
      });
      
      // Show success message
      success("Expense added successfully! 🎉");
      
      // Close the form on success
      onClose();
    } catch (error) {
      console.error("Error adding expense:", error);
      showError("Failed to add expense. Please try again."); // Replace alert
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Amount */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">
          Amount (₹)
        </label>
        <input
          type="number"
          name="amount"
          placeholder="0.00"
          value={formData.amount}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          disabled={isSubmitting}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Category */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">
          Category
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={isSubmitting}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">
          Description
        </label>
        <input
          type="text"
          name="description"
          placeholder="What did you spend on?"
          value={formData.description}
          onChange={handleChange}
          disabled={isSubmitting}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Date */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-600">
          Date
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Add Expense"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>

    </form>
  );
};

export default ExpenseForm;