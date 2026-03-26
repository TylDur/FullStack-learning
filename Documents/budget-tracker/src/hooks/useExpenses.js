import { useState, useCallback } from "react";
import { useExpenseContext } from "../context/ExpenseContext";
import { 
  addExpense, 
  getExpensesByMonth, 
  updateExpense, 
  deleteExpense 
} from "../services/expenseService";
const useExpenses = () => {
  const { 
    expenses, 
    setExpenses, 
    currentMonth, 
    setLoading 
  } = useExpenseContext();

  const [error, setError] = useState(null);
  const fetchExpenses = useCallback(async (userId, month) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExpensesByMonth(userId, month);
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setExpenses, setLoading]);
  const createExpense = useCallback(async (userId, data) => {
    setLoading(true);
    try {
      await addExpense(userId, data);
      await fetchExpenses(userId, currentMonth);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentMonth, fetchExpenses, setLoading]);
  const editExpense = useCallback(async (userId, expenseId, data) => {
    setLoading(true);
    try {
      await updateExpense(userId, expenseId, data);
      await fetchExpenses(userId, currentMonth);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentMonth, fetchExpenses, setLoading]);

  const removeExpense = useCallback(async (userId, expenseId) => {
    setLoading(true);
    try {
      await deleteExpense(userId, expenseId);
      await fetchExpenses(userId, currentMonth);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentMonth, fetchExpenses, setLoading]);
  return {
    expenses,
    error,
    fetchExpenses,
    createExpense,
    editExpense,
    removeExpense
  };
};

export default useExpenses;
