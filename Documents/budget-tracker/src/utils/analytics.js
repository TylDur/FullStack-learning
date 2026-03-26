// Format amount in Indian Rupees
export const formatIndianRupee = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Calculate total expenses for current month
export const calculateTotalExpenses = (expenses) => {
  return expenses.reduce((total, expense) => total + (expense.amount || 0), 0);
};

// Calculate breakdown by category
export const getCategoryBreakdown = (expenses) => {
  const breakdown = {};
  
  expenses.forEach(expense => {
    const category = expense.category;
    if (!breakdown[category]) {
      breakdown[category] = {
        amount: 0,
        count: 0,
        percentage: 0
      };
    }
    breakdown[category].amount += expense.amount || 0;
    breakdown[category].count += 1;
  });
  
  // Calculate percentages and convert to array sorted by amount
  const total = calculateTotalExpenses(expenses);
  const breakdownArray = Object.entries(breakdown).map(([category, data]) => ({
    category,
    amount: data.amount,
    count: data.count,
    percentage: total > 0 ? (data.amount / total) * 100 : 0
  }));
  
  // Sort by amount (highest first)
  return breakdownArray.sort((a, b) => b.amount - a.amount);
};

// Get top spending category
export const getTopCategory = (expenses) => {
  const breakdown = getCategoryBreakdown(expenses);
  return breakdown.length > 0 ? breakdown[0] : null;
};