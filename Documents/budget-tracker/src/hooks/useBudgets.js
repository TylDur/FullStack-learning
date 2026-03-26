import { useCallback, useState } from "react";
import { useExpenseContext } from "../context/ExpenseContext";
import {
  setBudget,
  getBudgetsByMonth,
  deleteBudget
} from "../services/budgetService";
const useBudgets = () => {
  const {
    budgets,
    setBudgets,
    currentMonth,
    setLoading
  } = useExpenseContext();

  const [error, setError] = useState(null);

  const fetchBudgets = useCallback(async (userId, month) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBudgetsByMonth(userId, month);
      setBudgets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setBudgets, setLoading]);

  const createOrUpdateBudget = useCallback(async (userId, category, month, limit) => {
    setLoading(true);
    try {
      await setBudget(userId, category, month, limit);
      await fetchBudgets(userId, currentMonth);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentMonth, fetchBudgets, setLoading]);

  const removeBudget = useCallback(async (userId, category, month) => {
    setLoading(true);
    try {
      await deleteBudget(userId, category, month);
      await fetchBudgets(userId, currentMonth);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentMonth, fetchBudgets, setLoading]);

  const getRemainingBudget = useCallback((category) => {
    const budget = budgets.find(b => b.category === category);
    if (!budget) return null;
    return budget.limit;
  }, [budgets]);

  return {
    budgets,
    error,
    fetchBudgets,
    createOrUpdateBudget,
    removeBudget,
    getRemainingBudget
  };
};

export default useBudgets;
