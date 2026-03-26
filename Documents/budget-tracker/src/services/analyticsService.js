import { formatIndianRupee } from '../utils/analytics';

// Get daily spending for current month
export const getDailySpending = (expenses) => {
  const daily = {};
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
  // Initialize all days with 0
  for (let i = 1; i <= daysInMonth; i++) {
    daily[i] = 0;
  }
  
  // Add expenses to days
  expenses.forEach(expense => {
    const day = parseInt(expense.date.split('-')[2]);
    daily[day] += expense.amount;
  });
  
  return Object.entries(daily).map(([day, amount]) => ({
    day: parseInt(day),
    amount
  }));
};

// Get weekday spending patterns
export const getWeekdaySpending = (expenses) => {
  const weekdays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];
  const spending = {
    Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0
  };
  const counts = { ...spending };
  
  expenses.forEach(expense => {
    const date = new Date(expense.date);
    const weekday = weekdays[date.getDay()];
    spending[weekday] += expense.amount;
    counts[weekday] += 1;
  });
  
  return Object.entries(spending).map(([day, amount]) => ({
    day,
    amount,
    average: counts[day] > 0 ? amount / counts[day] : 0,
    transactionCount: counts[day]
  }));
};

// Get month-over-month comparison
export const getMonthComparison = (currentExpenses, previousExpenses) => {
  const currentTotal = currentExpenses.reduce((sum, e) => sum + e.amount, 0);
  const previousTotal = previousExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const change = currentTotal - previousTotal;
  const percentageChange = previousTotal > 0 ? (change / previousTotal) * 100 : 0;
  
  // Category comparison
  const categories = {};
  
  currentExpenses.forEach(e => {
    if (!categories[e.category]) categories[e.category] = { current: 0, previous: 0 };
    categories[e.category].current += e.amount;
  });
  
  previousExpenses.forEach(e => {
    if (!categories[e.category]) categories[e.category] = { current: 0, previous: 0 };
    categories[e.category].previous += e.amount;
  });
  
  const categoryComparison = Object.entries(categories).map(([category, data]) => ({
    category,
    current: data.current,
    previous: data.previous,
    change: data.current - data.previous,
    percentageChange: data.previous > 0 ? ((data.current - data.previous) / data.previous) * 100 : 0
  }));
  
  return {
    currentTotal,
    previousTotal,
    change,
    percentageChange,
    isIncrease: change > 0,
    categoryComparison: categoryComparison.sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
  };
};

// Calculate financial health score
export const calculateFinancialHealth = (expenses, budgets, totalIncome = 50000) => {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Budget adherence score (0-40 points)
  let budgetScore = 40;
  budgets.forEach(budget => {
    const spent = expenses
      .filter(e => e.category === budget.category)
      .reduce((sum, e) => sum + e.amount, 0);
    
    if (spent > budget.limit) {
      budgetScore -= 5;
    } else if (spent > budget.limit * 0.8) {
      budgetScore -= 2;
    }
  });
  budgetScore = Math.max(0, budgetScore);
  
  // Savings rate score (0-30 points)
  const savingsRate = ((totalIncome - totalSpent) / totalIncome) * 100;
  let savingsScore = 0;
  if (savingsRate >= 20) savingsScore = 30;
  else if (savingsRate >= 15) savingsScore = 25;
  else if (savingsRate >= 10) savingsScore = 20;
  else if (savingsRate >= 5) savingsScore = 15;
  else if (savingsRate >= 0) savingsScore = 10;
  else savingsScore = 0;
  
  // Spending consistency score (0-30 points)
  const dailySpending = getDailySpending(expenses);
  const avgDailySpending = totalSpent / dailySpending.length;
  const variance = dailySpending.reduce((sum, d) => sum + Math.pow(d.amount - avgDailySpending, 2), 0) / dailySpending.length;
  const consistencyScore = Math.max(0, 30 - (variance / 1000));
  
  const totalScore = budgetScore + savingsScore + consistencyScore;
  
  let status = 'Excellent';
  let color = 'green';
  if (totalScore < 40) { status = 'Needs Attention'; color = 'red'; }
  else if (totalScore < 60) { status = 'Fair'; color = 'orange'; }
  else if (totalScore < 80) { status = 'Good'; color = 'blue'; }
  
  return {
    score: Math.min(100, Math.max(0, Math.round(totalScore))),
    status,
    color,
    breakdown: {
      budgetAdherence: budgetScore,
      savingsRate: savingsScore,
      consistency: Math.round(consistencyScore)
    },
    savingsRate: savingsRate.toFixed(1),
    totalSpent,
    totalIncome
  };
};

// Generate smart insights
export const generateInsights = (expenses, budgets, monthComparison) => {
  const insights = [];
  
  // 1. Month-over-month insight
  if (monthComparison) {
    if (monthComparison.percentageChange > 10) {
      insights.push({
        type: 'warning',
        icon: '📈',
        message: `Spending increased by ${monthComparison.percentageChange.toFixed(0)}% compared to last month`,
        action: 'Review your recent expenses'
      });
    } else if (monthComparison.percentageChange < -10) {
      insights.push({
        type: 'success',
        icon: '📉',
        message: `Great! Spending decreased by ${Math.abs(monthComparison.percentageChange).toFixed(0)}% compared to last month`,
        action: 'Keep up the good habits!'
      });
    }
  }
  
  // 2. Top increasing category
  if (monthComparison?.categoryComparison.length > 0) {
    const topIncrease = monthComparison.categoryComparison[0];
    if (topIncrease.percentageChange > 20) {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        message: `${topIncrease.category} spending is up ${topIncrease.percentageChange.toFixed(0)}% from last month`,
        action: `You spent ${formatIndianRupee(topIncrease.current)} vs ${formatIndianRupee(topIncrease.previous)}`
      });
    }
  }
  
  // 3. Budget alerts insight
  const nearLimitBudgets = budgets.filter(budget => {
    const spent = expenses.filter(e => e.category === budget.category).reduce((sum, e) => sum + e.amount, 0);
    return spent >= budget.limit * 0.8;
  });
  
  if (nearLimitBudgets.length > 0) {
    insights.push({
      type: 'warning',
      icon: '🎯',
      message: `${nearLimitBudgets.length} ${nearLimitBudgets.length === 1 ? 'category is' : 'categories are'} near budget limit`,
      action: nearLimitBudgets.map(b => b.category).join(', ')
    });
  }
  
  // 4. Highest spending day insight
  const weekdaySpending = getWeekdaySpending(expenses);
  const highestDay = weekdaySpending.reduce((max, d) => d.amount > max.amount ? d : max, { amount: 0 });
  if (highestDay.amount > 0) {
    insights.push({
      type: 'info',
      icon: '📅',
      message: `${highestDay.day} is your highest spending day`,
      action: `Average spending: ${formatIndianRupee(highestDay.average)} per transaction`
    });
  }
  
  // 5. Savings tip
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  if (totalSpent > 0) {
    insights.push({
      type: 'tip',
      icon: '💡',
      message: 'Consider setting up automated savings',
      action: 'Even ₹500/month adds up to ₹6000/year!'
    });
  }
  
  return insights;
};

// Get category trends over months
export const getCategoryTrends = (allExpenses) => {
  const trends = {};
  const months = [...new Set(allExpenses.map(e => e.month))].sort();
  
  allExpenses.forEach(expense => {
    if (!trends[expense.category]) {
      trends[expense.category] = {};
      months.forEach(month => { trends[expense.category][month] = 0; });
    }
    trends[expense.category][expense.month] += expense.amount;
  });
  
  return {
    months,
    categories: Object.keys(trends),
    data: trends
  };
};