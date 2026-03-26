import { collection, addDoc , getDocs , updateDoc , deleteDoc , doc , query , where , orderBy , serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";

const expensesRef = (userId) =>
  collection(db, "users", userId, "expenses");

export const addExpense = async (userId, data) => {
  const month = data.date.slice(0, 7);
  return await addDoc(expensesRef(userId), {
    ...data,
    month,
    userId,
    createdAt: serverTimestamp(),
  });
};

export const getExpensesByMonth = async (userId, month) => {
  const q = query(
    expensesRef(userId),
    where("month", "==", month),
    orderBy("date", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
export const updateExpense = async (userId, expenseId, data) => {
  const ref = doc(db, "users", userId, "expenses", expenseId);
  return await updateDoc(ref, data);
};
export const deleteExpense = async (userId, expenseId) => {
  const ref = doc(db, "users", userId, "expenses", expenseId);
  return await deleteDoc(ref);
};