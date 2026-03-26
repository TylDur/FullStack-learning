import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import useExpenses from "../../hooks/useExpenses";
import useBudgets from "../../hooks/useBudgets";
import { useExpenseContext } from "../../context/ExpenseContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const CategoryBreakdown = () => {
  const { expenses } = useExpenses();
  const { budgets } = useBudgets();
  const { currentMonth } = useExpenseContext();

  const formatMonthDisplay = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const getSpentPerCategory = () => {
    const totals = {};
    expenses.forEach(expense => {
      if (totals[expense.category]) {
        totals[expense.category] += expense.amount;
      } else {
        totals[expense.category] = expense.amount;
      }
    });
    return totals;
  };

  const spentPerCategory = getSpentPerCategory();
  const categories = budgets.map(b => b.category);
  const spentData = categories.map(cat => spentPerCategory[cat] || 0);
  const limitData = categories.map(b => {
    const budget = budgets.find(b2 => b2.category === b);
    return budget ? budget.limit : 0;
  });

  const getBarColor = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return "#ef4444";
    if (percentage >= 75) return "#f97316";
    if (percentage >= 50) return "#eab308";
    return "#6366f1";
  };

  const data = {
    labels: categories,
    datasets: [
      {
        label: "Spent",
        data: spentData,
        backgroundColor: categories.map((cat, i) =>
          getBarColor(spentData[i], limitData[i])
        ),
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.5,
      },
      {
        label: "Budget limit",
        data: limitData,
        backgroundColor: "#f3f4f6",
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.5,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            ` ${context.dataset.label}: ₹${context.parsed.y.toFixed(2)}`
        },
        backgroundColor: "#1f2937",
        titleColor: "#f9fafb",
        bodyColor: "#f9fafb",
        padding: 10,
        cornerRadius: 8,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 11
          },
          maxRotation: 30,
          minRotation: 30,
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "#f3f4f6",
        },
        border: {
          display: false,
          dash: [4, 4]
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 11
          },
          callback: (value) => `₹${value}`
        }
      }
    }
  };

  if (budgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <span className="text-3xl">🎯</span>
        <p className="text-sm text-gray-400 font-medium">
          No budgets set for {formatMonthDisplay(currentMonth)}
        </p>
        <p className="text-xs text-gray-300">
          Click "Set Budget" to get started
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Custom legend */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-xs text-gray-500">Spent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
          <span className="text-xs text-gray-500">Budget limit</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="text-xs text-gray-500">Exceeded</span>
        </div>
      </div>

      {/* Chart */}
      <Bar data={data} options={options} />

      {/* Status summary */}
      <div className="flex flex-col gap-1 pt-2 border-t border-gray-100">
        {categories.map((cat, i) => {
          const percentage = limitData[i] > 0
            ? ((spentData[i] / limitData[i]) * 100).toFixed(0)
            : 0;
          return (
            <div key={cat} className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{cat}</span>
              <span className={`text-xs font-medium ${
                percentage >= 100 ? "text-red-500" :
                percentage >= 75 ? "text-orange-500" :
                percentage >= 50 ? "text-yellow-600" :
                "text-indigo-500"
              }`}>
                {percentage}% used
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default CategoryBreakdown;