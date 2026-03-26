import { collection, doc, setDoc, getDocs, 
         deleteDoc, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

const budgetsRef = (userId) =>
  collection(db, "users", userId, "budgets");

export const setBudget = async (userId, category, month, limit) => {
  const docId = `${category}_${month}`;
  const ref = doc(db, "users", userId, "budgets", docId);
  return await setDoc(ref, {
    category,
    month,
    limit,
    userId
  }, { merge: true });
};

export const getBudgetsByMonth = async (userId, month) => {
  const q = query(
    budgetsRef(userId),
    where("month", "==", month)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const deleteBudget = async (userId, category, month) => {
  const docId = `${category}_${month}`;
  const ref = doc(db, "users", userId, "budgets", docId);
  return await deleteDoc(ref);
};