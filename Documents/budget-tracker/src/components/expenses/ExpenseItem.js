import React, { useState } from "react";
import CATEGORIES from "../../constants/categories";
import useExpenses from "../../hooks/useExpenses";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext"; // Add this import

const ExpenseItem = ({ expense }) => {
  const { editExpense, removeExpense } = useExpenses();
  const { currentUser } = useAuth();
  const { success, error: showError } = useToast(); // Add toast
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    amount: expense.amount,
    category: expense.category,
    description: expense.description,
    date: expense.date
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    if (!editData.amount || !editData.date) {
      showError("Please fill all fields");
      return;
    }
    
    setLoading(true);
    try {
      await editExpense(currentUser.uid, expense.id, {
        ...editData,
        amount: parseFloat(editData.amount)
      });
      success("Expense updated successfully! ✏️");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating expense:", error);
      showError("Failed to update expense");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await removeExpense(currentUser.uid, expense.id);
        success("Expense deleted successfully! 🗑️");
      } catch (error) {
        console.error("Error deleting expense:", error);
        showError("Failed to delete expense");
      }
    }
  };

  const CATEGORY_COLORS = {
    "Food & Dining": "bg-orange-100 text-orange-700",
    "Transport": "bg-blue-100 text-blue-700",
    "Shopping": "bg-pink-100 text-pink-700",
    "Utilities": "bg-yellow-100 text-yellow-700",
    "Entertainment": "bg-purple-100 text-purple-700",
    "Health": "bg-green-100 text-green-700",
    "Education": "bg-indigo-100 text-indigo-700",
    "Others": "bg-gray-100 text-gray-700",
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-3 p-4 border border-indigo-200 rounded-xl bg-indigo-50">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            name="amount"
            value={editData.amount}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Amount"
          />
          <select
            name="category"
            value={editData.category}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <input
          type="text"
          name="description"
          value={editData.description}
          onChange={handleChange}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Description"
        />
        <input
          type="date"
          name="date"
          value={editData.date}
          onChange={handleChange}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex-1 border border-gray-200 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800">
            {expense.description || "No description"}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[expense.category] || "bg-gray-100 text-gray-700"}`}>
              {expense.category}
            </span>
            <span className="text-xs text-gray-400">
              {expense.date}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-800">
          ₹{expense.amount.toFixed(2)}
        </span>
        <button
          onClick={() => setIsEditing(true)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;